import { pipeline, RawImage, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1';

env.allowLocalModels = false;
let seg = null, key = '';

self.onmessage = async ({ data: m }) => {
  try {
    if (m.type === 'load') {
      const k = `${m.model}|${m.device}|${m.dtype}`;
      if (k !== key) {
        if (seg) { try { await seg.dispose(); } catch (e) {} seg = null; key = ''; }
        seg = await pipeline('background-removal', m.model, {
          device: m.device,
          dtype: m.dtype,
          progress_callback: (p) => self.postMessage({ type: 'progress', p }),
        });
        key = k;
      }
      self.postMessage({ type: 'ready' });
    } else if (m.type === 'run') {
      const img = await RawImage.fromBlob(m.blob);
      const [out] = await seg(img);
      const rgba = out.channels === 4 ? out : out.rgba();
      self.postMessage({ type: 'result', width: rgba.width, height: rgba.height, data: rgba.data }, [rgba.data.buffer]);
    }
  } catch (e) {
    self.postMessage({ type: 'error', message: String((e && e.message) || e) });
  }
};
