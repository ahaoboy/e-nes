export type Config = {
  fps?: number;
  rom: string | Uint8Array;
  canvas: HTMLCanvasElement;
};
export type CreateNes = (c: Config) => Promise<CreateNes>;
