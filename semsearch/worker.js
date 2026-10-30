import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1';

env.allowLocalModels = false;
let embed = null, key = '';

self.onmessage = async ({ data: m }) => {
  try {
    if (m.type === 'load') {
      const k = `${m.model}|${m.device}|${m.dtype}`;
      if (k !== key) {
        if (embed) { try { await embed.dispose(); } catch (e) {} embed = null; key = ''; }
        embed = await pipeline('feature-extraction', m.model, {
          device: m.device,
          dtype: m.dtype,
          progress_callback: (p) => self.postMessage({ type: 'progress', p }),
        });
        key = k;
      }
      self.postMessage({ type: 'ready' });
    } else if (m.type === 'embed') {
      const B = 16, out = [];
      let dim = 0;
      for (let i = 0; i < m.texts.length; i += B) {
        const t = await embed(m.texts.slice(i, i + B), { pooling: m.pooling || 'mean', normalize: true });
        dim = t.dims[t.dims.length - 1];
        out.push(t.data);
        self.postMessage({ type: 'step', done: Math.min(i + B, m.texts.length), total: m.texts.length });
      }
      const flat = new Float32Array(m.texts.length * dim);
      let o = 0;
      for (const a of out) { flat.set(a, o); o += a.length; }
      self.postMessage({ type: 'result', dim, data: flat }, [flat.buffer]);
    } else if (m.type === 'pairs') {
      const { vecs, dim, n, thr, max, texts } = m;
      let top = [], total = 0, t0 = Date.now();
      for (let i = 0; i < n; i++) {
        const oi = i * dim;
        for (let j = i + 1; j < n; j++) {
          let s;
          if (texts[i] === texts[j]) s = 1;
          else {
            const oj = j * dim;
            s = 0;
            for (let k = 0; k < dim; k++) s += vecs[oi + k] * vecs[oj + k];
            if (s < thr) continue;
          }
          total++;
          top.push([s, i, j]);
          if (top.length > max * 4) { top.sort((a, b) => b[0] - a[0]); top.length = max; }
        }
        if (Date.now() - t0 > 100) { t0 = Date.now(); self.postMessage({ type: 'step', done: i + 1, total: n }); }
      }
      top.sort((a, b) => b[0] - a[0]);
      self.postMessage({ type: 'result', total, items: top.slice(0, max) });
    }
  } catch (e) {
    self.postMessage({ type: 'error', message: String((e && e.message) || e) });
  }
};
