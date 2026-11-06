import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1';

env.allowLocalModels = false;
const MODEL = 'onnx-community/Supertonic-TTS-2-ONNX';
let tts = null, key = '';

self.onmessage = async ({ data: m }) => {
  try {
    if (m.type === 'load') {
      if (m.device !== key) {
        if (tts) { try { await tts.dispose(); } catch (e) {} tts = null; key = ''; }
        tts = await pipeline('text-to-speech', MODEL, {
          device: m.device,
          progress_callback: (p) => self.postMessage({ type: 'progress', p }),
        });
        key = m.device;
      }
      self.postMessage({ type: 'ready' });
    } else if (m.type === 'run') {
      const voice = `https://huggingface.co/${MODEL}/resolve/main/voices/${m.voice}.bin`;
      for (let i = 0; i < m.chunks.length; i++) {
        const out = await tts(`<${m.lang}>${m.chunks[i]}</${m.lang}>`, {
          speaker_embeddings: voice, num_inference_steps: m.steps, speed: m.speed,
        });
        const audio = new Float32Array(out.audio);
        self.postMessage({ type: 'chunk', i, total: m.chunks.length, sr: out.sampling_rate, audio }, [audio.buffer]);
      }
      self.postMessage({ type: 'done' });
    }
  } catch (e) {
    self.postMessage({ type: 'error', message: String((e && e.message) || e) });
  }
};
