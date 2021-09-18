import init, { WasmNes } from "./nes-rust";
export * from "./nes-rust";
import { Config } from "./type";
const setupAudio = (nes: WasmNes) => {
  const audioContext = AudioContext;
  if (audioContext === undefined) {
    throw new Error("This browser seems not to support AudioContext.");
  }
  const bufferLength = 4096;
  const context = new audioContext({ sampleRate: 44100 });
  const scriptProcessor = context.createScriptProcessor(bufferLength, 0, 1);
  scriptProcessor.onaudioprocess = (e) => {
    const data = e.outputBuffer.getChannelData(0);
    nes.update_sample_buffer(data);
    // Adjust volume
    for (let i = 0; i < data.length; i++) {
      data[i] *= 0.25;
    }
  };
  scriptProcessor.connect(context.destination);
};

export const createNes: (c: Config) => Promise<WasmNes> = async ({
  rom,
  canvas,
  fps = 60,
}) => {
  let buf: Uint8Array;
  if (typeof rom === "string") {
    buf = new Uint8Array(await (await fetch(rom)).arrayBuffer());
  } else {
    buf = rom;
  }
  await init();
  const width = 256;
  const height = 240;
  const ctx = canvas.getContext("2d")!;
  canvas.width = width;
  canvas.height = height;
  const imageData = ctx.createImageData(width, height);
  const pixels = new Uint8Array(imageData.data.buffer);
  const nes = WasmNes.new();
  nes.set_rom(buf);
  setupAudio(nes);
  nes.bootup();
  const inv = 1000 / fps;
  const raf = (f: () => void) => {
    setTimeout(f, inv);
  };
  const stepFrame = () => {
    raf(stepFrame);
    nes.step_frame();
    nes.update_pixels(pixels);
    ctx.putImageData(imageData, 0, 0);
  };
  stepFrame();
  return nes;
};
