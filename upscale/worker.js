import { pipeline, env, RawImage } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1';

env.allowLocalModels = false;
let up = null, key = '';

self.onmessage = async ({ data: m }) => {
  try {
    if (m.type === 'load') {
      const k = `${m.model}|${m.device}|${m.dtype}`;
      if (k !== key) {
        if (up) { try { await up.dispose(); } catch (e) {} up = null; key = ''; }
        up = await pipeline('image-to-image', m.model, {
          device: m.device,
          dtype: m.dtype,
          progress_callback: (p) => self.postMessage({ type: 'progress', p }),
        });
        key = k;
      }
      self.postMessage({ type: 'ready' });
    } else if (m.type === 'run') {
      const { rgb, w, h, s, tile, pad } = m;
      const W = w * s, H = h * s, out = new Uint8ClampedArray(W * H * 4);
      const total = Math.ceil(w / tile) * Math.ceil(h / tile);
      let done = 0;
      for (let ty = 0; ty < h; ty += tile) {
        for (let tx = 0; tx < w; tx += tile) {
          const x0 = Math.max(0, tx - pad), y0 = Math.max(0, ty - pad);
          const x1 = Math.min(w, tx + tile + pad), y1 = Math.min(h, ty + tile + pad);
          const tw = x1 - x0, th = y1 - y0, buf = new Uint8ClampedArray(tw * th * 3);
          for (let y = 0; y < th; y++) buf.set(rgb.subarray(((y0 + y) * w + x0) * 3, ((y0 + y) * w + x1) * 3), y * tw * 3);
          const r = await up(new RawImage(buf, tw, th, 3));
          const rc = r.channels, rw = r.width;
          const ix1 = Math.min(w, tx + tile), iy1 = Math.min(h, ty + tile);
          for (let oy = ty * s; oy < iy1 * s; oy++) {
            const sy = oy - y0 * s;
            for (let ox = tx * s; ox < ix1 * s; ox++) {
              const si = (sy * rw + (ox - x0 * s)) * rc, di = (oy * W + ox) * 4;
              out[di] = r.data[si]; out[di + 1] = r.data[si + 1]; out[di + 2] = r.data[si + 2]; out[di + 3] = 255;
            }
          }
          self.postMessage({ type: 'step', done: ++done, total });
        }
      }
      self.postMessage({ type: 'result', w: W, h: H, data: out }, [out.buffer]);
    }
  } catch (e) {
    self.postMessage({ type: 'error', message: String((e && e.message) || e) });
  }
};
