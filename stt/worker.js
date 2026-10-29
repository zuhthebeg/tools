import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1';

env.allowLocalModels = false;
let asr = null, key = '';

self.onmessage = async ({ data: m }) => {
  try {
    if (m.type === 'load') {
      const k = `${m.model}|${m.device}|${JSON.stringify(m.dtype)}`;
      if (k !== key) {
        if (asr) { try { await asr.dispose(); } catch (e) {} asr = null; key = ''; }
        asr = await pipeline('automatic-speech-recognition', m.model, {
          device: m.device,
          dtype: m.dtype,
          progress_callback: (p) => self.postMessage({ type: 'progress', p }),
        });
        key = k;
      }
      self.postMessage({ type: 'ready' });
    } else if (m.type === 'run') {
      const opts = { return_timestamps: true, chunk_length_s: 30, stride_length_s: 5, task: m.task };
      if (m.lang) opts.language = m.lang;
      const out = await asr(m.audio, opts);
      self.postMessage({ type: 'result', id: m.id, out });
    }
  } catch (e) {
    self.postMessage({ type: 'error', message: String((e && e.message) || e) });
  }
};
