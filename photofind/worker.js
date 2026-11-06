import { AutoTokenizer, AutoProcessor, SiglipTextModel, SiglipVisionModel, RawImage, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1';

env.allowLocalModels = false;
const MODEL = 'onnx-community/siglip2-base-patch16-224-ONNX';
let proc = null, vision = null, visionKey = '', tok = null, text = null;
const embs = new Map();
const progress = (p) => self.postMessage({ type: 'progress', p });

function norm(v) {
  let n = 0;
  for (let i = 0; i < v.length; i++) n += v[i] * v[i];
  n = Math.sqrt(n) || 1;
  const o = new Float32Array(v.length);
  for (let i = 0; i < v.length; i++) o[i] = v[i] / n;
  return o;
}
const dot = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; };
const rank = (q) => [...embs].map(([id, e]) => [id, dot(q, e)]).sort((a, b) => b[1] - a[1]);

async function loadVision(device, dtype) {
  const k = `${device}|${dtype}`;
  if (k === visionKey) return;
  if (vision) { try { await vision.dispose(); } catch (e) {} vision = null; visionKey = ''; }
  proc = proc || await AutoProcessor.from_pretrained(MODEL, { progress_callback: progress });
  vision = await SiglipVisionModel.from_pretrained(MODEL, { device, dtype, progress_callback: progress });
  visionKey = k;
}
async function loadText() {
  if (text) return;
  tok = tok || await AutoTokenizer.from_pretrained(MODEL, { progress_callback: progress });
  text = await SiglipTextModel.from_pretrained(MODEL, { device: 'wasm', dtype: 'q8', progress_callback: progress });
}

self.onmessage = async ({ data: m }) => {
  try {
    if (m.type === 'loadVision') {
      await loadVision(m.device, m.dtype);
      self.postMessage({ type: 'ready' });
    } else if (m.type === 'embed') {
      const out = await vision(await proc(new RawImage(m.rgba, m.w, m.h, 4)));
      embs.set(m.id, norm(out.pooler_output.data));
      self.postMessage({ type: 'embedded', id: m.id });
    } else if (m.type === 'remove') {
      if (m.ids) m.ids.forEach((id) => embs.delete(id)); else embs.clear();
      self.postMessage({ type: 'removed' });
    } else if (m.type === 'text') {
      await loadText();
      const inp = tok([m.query.toLowerCase()], { padding: 'max_length', max_length: 64, truncation: true });
      const out = await text(inp);
      self.postMessage({ type: 'ranked', list: rank(norm(out.pooler_output.data)) });
    } else if (m.type === 'similar') {
      const q = embs.get(m.id);
      self.postMessage({ type: 'ranked', list: q ? rank(q) : [] });
    } else if (m.type === 'groups') {
      const ids = [...embs.keys()], E = ids.map((id) => embs.get(id)), parent = ids.map((_, i) => i);
      const find = (i) => { while (parent[i] !== i) i = parent[i] = parent[parent[i]]; return i; };
      for (let i = 0; i < E.length; i++) {
        for (let j = i + 1; j < E.length; j++) if (dot(E[i], E[j]) >= m.threshold) parent[find(j)] = find(i);
        if (i % 200 === 199) self.postMessage({ type: 'gprogress', done: i + 1, total: E.length });
      }
      const g = new Map();
      ids.forEach((id, i) => { const r = find(i); g.set(r, [...(g.get(r) || []), id]); });
      self.postMessage({ type: 'groups', groups: [...g.values()].filter((x) => x.length > 1).sort((a, b) => b.length - a.length) });
    }
  } catch (e) {
    self.postMessage({ type: 'error', message: String((e && e.message) || e) });
  }
};
