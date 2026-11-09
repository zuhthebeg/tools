/* ai.js — on-device AI for /wiki/: Whisper speech-to-text, Tesseract OCR, sentence embeddings,
 * and text generation with Chrome's Gemini Nano or WebLLM. Nothing is sent to a server. */
(function (g) {
  const TESS = 'https://cdn.jsdelivr.net/npm/tesseract.js@6.0.1/dist/tesseract.min.js';
  const WEBLLM = 'https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.85/lib/index.js';
  const ASR = 'onnx-community/whisper-base';
  const EMB = 'Xenova/paraphrase-multilingual-MiniLM-L12-v2';
  const LLMS = [
    { id: 'Qwen3.5-2B', name: 'Qwen3.5 2B', f16: 'Qwen3.5-2B-q4f16_1-MLC', f32: 'Qwen3.5-2B-q4f32_1-MLC', gb: 2.2 },
    { id: 'Qwen3.5-0.8B', name: 'Qwen3.5 0.8B', f16: 'Qwen3.5-0.8B-q4f16_1-MLC', f32: 'Qwen3.5-0.8B-q4f32_1-MLC', gb: 1.6 },
  ];
  const OCR_LANGS = { ko: ['kor', 'eng'], en: ['eng'], 'zh-CN': ['chi_sim', 'eng'], 'zh-TW': ['chi_tra', 'eng'], es: ['spa', 'eng'] };
  const CJK = '\\u3040-\\u30ff\\u3400-\\u4dbf\\u4e00-\\u9fff\\uf900-\\ufaff\\u3000-\\u303f\\uff00-\\uffef';
  const CJK_GAP = new RegExp(`([${CJK}])[ \\t]+(?=[${CJK}])`, 'g');

  let gpuP = null;
  function gpu() {
    if (!gpuP) gpuP = (async () => {
      try {
        const ad = navigator.gpu && (await navigator.gpu.requestAdapter());
        const fb = ad && (ad.isFallbackAdapter || (ad.info && ad.info.isFallbackAdapter));
        if (ad && !fb) return { ok: true, f16: ad.features.has('shader-f16') };
      } catch (e) {}
      return { ok: false, f16: false };
    })();
    return gpuP;
  }

  /* one module worker for Whisper + embeddings; calls run one at a time */
  let worker = null, chain = Promise.resolve(), seq = 0;
  const pending = new Map();
  function getWorker() {
    if (!worker) {
      worker = new Worker('/wiki/ai-worker.js', { type: 'module' });
      worker.onmessage = ({ data }) => {
        const p = pending.get(data.id);
        if (!p) return;
        if (data.type === 'progress') { if (p.onProgress) p.onProgress(data.p); return; }
        pending.delete(data.id);
        if (data.type === 'error') p.rej(new Error(data.message)); else p.res(data);
      };
      worker.onerror = (e) => {
        pending.forEach((p) => p.rej(new Error(e.message || 'worker error')));
        pending.clear();
        worker.terminate();
        worker = null;
      };
    }
    return worker;
  }
  function call(msg, transfer, onProgress) {
    const run = () => new Promise((res, rej) => {
      const id = ++seq;
      pending.set(id, { res, rej, onProgress });
      getWorker().postMessage({ ...msg, id }, transfer || []);
    });
    const p = chain.then(run, run);
    chain = p.catch(() => {});
    return p;
  }
  function dl(cb) {
    const files = {};
    return (p) => {
      if (!cb || p.status !== 'progress' || !p.file || !p.total) return;
      files[p.file] = [p.loaded, p.total];
      const v = Object.values(files);
      const l = v.reduce((a, x) => a + x[0], 0), tt = v.reduce((a, x) => a + x[1], 0);
      cb({ stage: 'download', frac: l / tt });
    };
  }

  async function decode(blob) {
    const Ctx = g.AudioContext || g.webkitAudioContext;
    const ctx = new Ctx({ sampleRate: 16000 });
    try {
      const ab = await ctx.decodeAudioData(await blob.arrayBuffer());
      const n = ab.numberOfChannels, out = new Float32Array(ab.length);
      for (let c = 0; c < n; c++) { const d = ab.getChannelData(c); for (let i = 0; i < d.length; i++) out[i] += d[i] / n; }
      return out;
    } finally { ctx.close(); }
  }

  async function transcribe(blob, onProgress) {
    const audio = await decode(blob);
    const G = await gpu();
    await call({ type: 'load', task: 'asr', model: ASR, device: G.ok ? 'webgpu' : 'wasm', dtype: G.ok ? { encoder_model: 'fp32', decoder_model_merged: 'q4' } : 'q8' }, null, dl(onProgress));
    const WIN = 300 * 16000, parts = [];
    for (let s = 0; s < audio.length; s += WIN) {
      if (onProgress) onProgress({ stage: 'run', frac: s / audio.length });
      const slice = audio.slice(s, s + WIN);
      const { text } = await call({ type: 'asr', audio: slice }, [slice.buffer]);
      if (text && text.trim()) parts.push(text.trim());
    }
    return parts.join(' ');
  }

  async function embed(texts, onProgress) {
    await call({ type: 'load', task: 'embed', model: EMB, device: 'wasm', dtype: 'q8' }, null, dl(onProgress));
    const r = await call({ type: 'embed', texts }, null, (p) => onProgress && onProgress({ stage: 'run', frac: p.done / p.total }));
    const out = [];
    for (let i = 0; i < texts.length; i++) out.push(r.data.slice(i * r.dim, (i + 1) * r.dim));
    return out;
  }

  function loadScript(src) {
    return new Promise((res, rej) => {
      if (g.Tesseract) return res();
      const s = document.createElement('script');
      s.src = src;
      s.onload = res;
      s.onerror = () => rej(new Error('failed to load ' + src));
      document.head.appendChild(s);
    });
  }
  let tess = null, tessKey = '', tessCb = null, ochain = Promise.resolve();
  function ocr(blob, onProgress) {
    const run = async () => {
      const langs = OCR_LANGS[g.I18n && g.I18n.lang] || ['eng'];
      const key = langs.join('+');
      tessCb = onProgress;
      await loadScript(TESS);
      const logger = (m) => tessCb && tessCb({ stage: m.status === 'recognizing text' ? 'run' : 'download', frac: typeof m.progress === 'number' ? m.progress : 0 });
      if (!tess) tess = await g.Tesseract.createWorker(langs, 1, { logger });
      else if (tessKey !== key) await tess.reinitialize(langs, 1);
      tessKey = key;
      const { data } = await tess.recognize(blob);
      return (data.text || '').replace(CJK_GAP, '$1').replace(/\n{3,}/g, '\n\n').trim();
    };
    const p = ochain.then(run, run);
    ochain = p.catch(() => {});
    return p;
  }

  async function llmOptions() {
    const out = [];
    let nano = 'unavailable';
    if (g.LanguageModel && g.LanguageModel.availability) { try { nano = await g.LanguageModel.availability(); } catch (e) {} }
    if (nano !== 'unavailable') out.push({ id: 'nano', name: 'Gemini Nano (Chrome)' });
    const G = await gpu();
    if (G.ok) LLMS.forEach((m) => out.push({ id: m.id, name: `${m.name} · WebLLM (${m.gb} GB)` }));
    return out;
  }

  const strip = (s) => String(s).replace(/<think>[\s\S]*?(<\/think>|$)/g, '').trim();
  let engP = null, engId = '';
  function engine(id, onProgress) {
    if (engP && engId === id) return engP;
    const prev = engP;
    engId = id;
    engP = (async () => {
      if (prev) { try { const e = await prev; await e.unload(); } catch (e) {} }
      if (id === 'nano') {
        const LM = g.LanguageModel;
        const monitor = (m) => m.addEventListener('downloadprogress', (e) => onProgress && onProgress({ stage: 'download', frac: e.total ? e.loaded / e.total : e.loaded }));
        (await LM.create({ monitor })).destroy();
        return {
          async gen(messages, { onText, signal }) {
            const s = await LM.create({ initialPrompts: messages.slice(0, -1), signal });
            try {
              let text = '';
              for await (const c of s.promptStreaming(messages[messages.length - 1].content, { signal })) {
                text = text && c.startsWith(text) ? c : text + c;
                if (onText) onText(text);
              }
              return text;
            } finally { s.destroy(); }
          },
          unload() {},
        };
      }
      const m = LLMS.find((x) => x.id === id);
      const G = await gpu();
      if (!m || !G.ok) throw new Error('WebGPU');
      const webllm = await import(WEBLLM);
      const w = new Worker('/browserllm/worker.js', { type: 'module' });
      let mlc;
      try {
        mlc = await webllm.CreateWebWorkerMLCEngine(w, G.f16 ? m.f16 : m.f32, { initProgressCallback: (p) => onProgress && onProgress({ stage: 'download', frac: p.progress || 0 }) });
      } catch (e) { w.terminate(); throw e; }
      return {
        async gen(messages, { onText, signal }) {
          const chunks = await mlc.chat.completions.create({ messages, temperature: 0.3, max_tokens: 1024, stream: true, extra_body: { enable_thinking: false } });
          let text = '';
          for await (const c of chunks) {
            if (signal && signal.aborted) { try { mlc.interruptGenerate(); } catch (e) {} throw Object.assign(new Error('aborted'), { name: 'AbortError' }); }
            text += (c.choices && c.choices[0] && c.choices[0].delta && c.choices[0].delta.content) || '';
            if (onText) onText(strip(text));
          }
          return strip(text);
        },
        async unload() { try { await mlc.unload(); } finally { w.terminate(); } },
      };
    })();
    engP.catch(() => { if (engId === id) { engP = null; engId = ''; } });
    return engP;
  }

  g.WikiAI = { gpu, transcribe, ocr, embed, llmOptions, engine, EMB };
})(window);
