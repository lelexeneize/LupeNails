function buildPrompt(design: {
  shape: string; color: string; effect: string; art: string; accessory: string;
}): string {
  const shapeMap: Record<string, string> = { almond: 'almond', coffin: 'coffin', stiletto: 'stiletto', square: 'square' };
  const colorMap: Record<string, string> = {
    'nude-silk': 'nude silk', 'milky-white': 'milky white', latte: 'latte', 'sand-dune': 'sand dune', vanilla: 'vanilla',
    'rose-glaze': 'rose glaze', 'peachy-pink': 'peachy pink', bubblegum: 'bubblegum', 'hot-pink': 'hot pink', mauve: 'mauve',
    'classic-red': 'classic red', 'velvet-ruby': 'velvet ruby', 'wine-cellar': 'wine',
    crimson: 'crimson', coral: 'coral', 'midnight-blue': 'midnight blue', 'sage-green': 'sage green',
    'sky-high': 'sky blue', emerald: 'emerald', lavender: 'lavender',
    onyx: 'onyx black', 'deep-espresso': 'deep espresso', charcoal: 'charcoal', plum: 'plum',
    'neon-lime': 'neon lime', 'electric-blue': 'electric blue', 'sun-yellow': 'sun yellow'
  };
  const artMap: Record<string, string> = { none: '', minimal: 'minimalist line art', marble: 'marble effect', floral: 'hand-painted flowers', french: 'modern french tip' };
  const accMap: Record<string, string> = { none: '', pearls: 'micro pearls', crystals: 'Swarovski crystals', 'gold-flakes': 'gold leaf' };
  const shape = shapeMap[design.shape] || 'almond';
  const color = colorMap[design.color] || design.color;
  const art = artMap[design.art] || '';
  const acc = accMap[design.accessory] || '';
  return `${shape} nails, ${color} color, ${design.effect.toLowerCase()} finish ${art} ${acc}, luxury manicure, studio lighting, white background, photorealistic`.trim();
}

export async function generateNailImage(design: {
  shape: string; color: string; effect: string; art: string; accessory: string;
}): Promise<string | null> {
  const prompt = buildPrompt(design);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=600&height=800&nologo=true`;
}
