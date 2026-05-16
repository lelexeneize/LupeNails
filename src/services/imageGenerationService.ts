import { generateNailCanvas } from './nailCanvasGenerator';

export async function generateNailImage(design: {
  shape: string; color: string; effect: string; art: string; accessory: string;
}): Promise<string | null> {
  return generateNailCanvas(design);
}
