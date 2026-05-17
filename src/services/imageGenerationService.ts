function buildPrompt(design: {
  shape: string; color: string; effect: string; art: string; accessory: string;
}): string {
  const shapeMap: Record<string, string> = { almond: 'almond', coffin: 'coffin', stiletto: 'stiletto', square: 'square' };
  const colorMap: Record<string, string> = {
    'bubble-bath': 'soft pink nude', 'funny-bunny': 'milky white', 'ballet-slippers': 'pale ballet pink',
    'samoan-sand': 'beige nude', 'put-it-in-neutral': 'warm beige nude', 'miso-happy': 'warm caramel nude',
    'mod-about-you': 'baby pink', 'fiji': 'sheer pink', 'strawberry-marg': 'bright strawberry pink',
    'pink-flamenco': 'hot pink', 'cactus-rose': 'dusty rose',
    'big-apple-red': 'classic bright red', 'russian-navy': 'deep burgundy',
    'cajun-shrimp': 'coral red', 'got-blues-red': 'blue-toned red', 'malaga-wine': 'deep wine',
    'lincoln-park': 'deep dark purple', 'do-you-speak-love': 'berry purple',
    'grape- Expectations': 'grape purple', 'lavender-lace': 'soft lavender',
    'cant-find-czech': 'deep teal', 'turquoise-caicos': 'bright turquoise',
    'jade-black': 'emerald green', 'sky-blue': 'sky blue',
    'black-onyx': 'black', 'chocolate-moose': 'dark chocolate brown',
    'charcoal': 'charcoal grey', 'glitter-all-way': 'silver glitter',
    'golden-i': 'gold', 'chrome': 'chrome mirror',
    'neon-lime': 'neon lime green', 'electric-blue': 'electric blue', 'sun-yellow': 'sun yellow',
  };
  const artMap: Record<string, string> = { none: '', minimal: 'minimalist line art', marble: 'marble effect', floral: 'hand-painted floral', french: 'modern french tip' };
  const accMap: Record<string, string> = { none: '', pearls: 'micro pearls', crystals: 'Swarovski crystals', 'gold-flakes': 'gold leaf' };
  const shape = shapeMap[design.shape] || 'almond';
  const color = colorMap[design.color] || design.color;
  const art = artMap[design.art] || '';
  const acc = accMap[design.accessory] || '';
  return `${shape} nails, ${color}, ${design.effect.toLowerCase()} finish ${art} ${acc}, luxury manicure, studio lighting, white background, photorealistic, 4k, professional product photo`.trim();
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

    if (!res.ok) {
      const err = await res.text();
      console.error('Image gen error:', err);
      return null;
    }

    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('Image generation error:', err);
    return null;
  }
}
