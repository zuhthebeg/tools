import { pipeline, env, RawImage } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1';

env.allowLocalModels = false;
const MODEL = 'onnx-community/depth-anything-v2-small';
let de = null, key = '';

self.onmessage = async ({ data: m }) => {
  try {
    if (m.type === 'load') {
      const k = `${m.device}|${m.dtype}`;
      if (k !== key) {
        if (de) { try { await de.dispose(); } catch (e) {} de = null; key = ''; }
        de = await pipeline('depth-estimation', MODEL, {
          device: m.device, dtype: m.dtype,
          progress_callback: (p) => self.postMessage({ type: 'progress', p }),
        });
        key = k;
      }
      self.postMessage({ type: 'ready' });
    } else if (m.type === 'run') {
      const { depth } = await de(new RawImage(m.rgb, m.w, m.h, 3));
      const d = depth.channels === 1 ? depth : depth.grayscale();
      const out = new Uint8Array(d.data);
      self.postMessage({ type: 'result', w: d.width, h: d.height, data: out }, [out.buffer]);
    }
  } catch (e) {
    self.postMessage({ type: 'error', message: String((e && e.message) || e) });
  }
};
