const ART_NAMES: Record<string, string> = {
  none: 'sin arte', minimal: 'minimalista', marble: 'mármol', floral: 'flores', french: 'francesa'
};
const ACC_NAMES: Record<string, string> = {
  none: 'sin accesorios', pearls: 'perlas', crystals: 'cristales', 'gold-flakes': 'oro'
};
const STYLE_NAMES = [
  'Chrome Pearl Glaze', 'Soft Vanilla Cloud', 'Rose Gold Aura', 'Milky Lavender Dream',
  'Golden Hour Shimmer', 'Crystal Nude Elegance', 'Pink Sand Dune', 'Midnight Chrome Luxe',
  'French Couture Gloss', 'Clean Girl Pearl', 'Holographic Halo', 'Satin Blush Finish',
  'Glazed Donut Chic', 'Mermaid Scale Chrome', 'Opal Dreamscape'
];

export const geminiService = {
  async getDesignRecommendations(query: string) {
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'inspire', query }),
      });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return null;
    }
  },

  generateFallbackResult(design: { shape: string; color: string; effect: string; art: string; accessory: string }) {
    const name = STYLE_NAMES[Math.floor(Math.random() * STYLE_NAMES.length)];
    const desc = `Diseño en forma ${design.shape} con ${design.effect === 'Brillante' ? 'brillo ultra premium' : design.effect === 'Mate' ? 'acabado mate sedoso' : design.effect === 'Chrome' ? 'efecto chrome espejado' : design.effect === 'Glazed' ? 'acabado glazed donut' : 'destellos glitter'}${design.art !== 'none' ? ` y arte ${ART_NAMES[design.art] || 'personalizado'}` : ''}${design.accessory !== 'none' ? ` con ${ACC_NAMES[design.accessory] || 'accesorios'}` : ''}. Un estilo que grita elegancia y tendencia.`;
    return { name, description: desc };
  },

  async generateNailStudioResult(design: { shape: string; color: string; effect: string; art: string; accessory: string }) {
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'design', design }),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      if (data.name) return data;
      return this.generateFallbackResult(design);
    } catch {
      return this.generateFallbackResult(design);
    }
  }
};
