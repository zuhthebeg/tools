/* ai-worker.js — Whisper speech-to-text and sentence embeddings for /wiki/, off the main thread. */
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1';

env.allowLocalModels = false;
const P = {};

self.onmessage = async ({ data: m }) => {
  const post = (o, tr) => self.postMessage({ ...o, id: m.id }, tr || []);
  try {
    if (m.type === 'load') {
      const k = `${m.model}|${m.device}|${JSON.stringify(m.dtype)}`;
      const cur = P[m.task];
      if (!cur || cur.key !== k) {
        if (cur) { try { await cur.pipe.dispose(); } catch (e) {} delete P[m.task]; }
        const pipe = await pipeline(m.task === 'asr' ? 'automatic-speech-recognition' : 'feature-extraction', m.model, {
          device: m.device,
          dtype: m.dtype,
          progress_callback: (p) => post({ type: 'progress', p }),
        });
        P[m.task] = { pipe, key: k };
      }
      post({ type: 'ready' });
    } else if (m.type === 'asr') {
      const out = await P.asr.pipe(m.audio, { chunk_length_s: 30, stride_length_s: 5 });
      post({ type: 'result', text: out.text || '' });
    } else if (m.type === 'embed') {
      const B = 16, out = [];
      let dim = 0;
      for (let i = 0; i < m.texts.length; i += B) {
        const t = await P.embed.pipe(m.texts.slice(i, i + B), { pooling: 'mean', normalize: true });
        dim = t.dims[t.dims.length - 1];
        out.push(t.data);
        post({ type: 'progress', p: { done: Math.min(i + B, m.texts.length), total: m.texts.length } });
      }
      const flat = new Float32Array(m.texts.length * dim);
      let o = 0;
      for (const a of out) { flat.set(a, o); o += a.length; }
      post({ type: 'result', dim, data: flat }, [flat.buffer]);
    }
  } catch (e) {
    post({ type: 'error', message: String((e && e.message) || e) });
  }
};
