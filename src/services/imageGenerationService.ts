function buildPrompt(design: {
  shape: string; color: string; effect: string; art: string; accessory: string;
}): string {
  const shapeMap: Record<string, string> = { almond: 'almond shaped', coffin: 'coffin shaped', stiletto: 'stiletto shaped', square: 'square shaped' };
  const colorMap: Record<string, string> = {
    'nude-silk': 'nude silk', 'milky-white': 'milky white', latte: 'latte', 'sand-dune': 'sand dune', vanilla: 'vanilla',
    'rose-glaze': 'rose glaze', 'peachy-pink': 'peachy pink', bubblegum: 'bubblegum', 'hot-pink': 'hot pink', mauve: 'mauve',
    'classic-red': 'classic red', 'velvet-ruby': 'velvet ruby', 'wine-cellar': 'wine',
    crimson: 'crimson', coral: 'coral', 'midnight-blue': 'midnight blue', 'sage-green': 'sage green',
    'sky-high': 'sky blue', emerald: 'emerald', lavender: 'lavender',
    onyx: 'onyx black', 'deep-espresso': 'deep espresso', charcoal: 'charcoal', plum: 'plum',
    'neon-lime': 'neon lime', 'electric-blue': 'electric blue', 'sun-yellow': 'sun yellow'
  };
  const artMap: Record<string, string> = { none: '', minimal: 'with minimalist line art', marble: 'with marble effect', floral: 'with hand-painted floral details', french: 'with modern french tip' };
  const accMap: Record<string, string> = { none: '', pearls: 'with micro pearl embellishments', crystals: 'with Swarovski crystal details', 'gold-flakes': 'with gold leaf accents' };

  return `Professional macro photo of ${shapeMap[design.shape] || 'almond shaped'} nails with ${colorMap[design.color] || design.color} color, ${design.effect.toLowerCase()} finish ${artMap[design.art]} ${accMap[design.accessory]}. Studio lighting, white background, luxury manicure, hyper-realistic, 4k, editorial fashion.`.replace(/\s+/g, ' ');
}

export async function generateNailImage(design: {
  shape: string; color: string; effect: string; art: string; accessory: string;
}): Promise<string | null> {
  const prompt = buildPrompt(design);

  try {
    const res = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) return null;

    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('Image generation error:', err);
    return null;
  }
}
