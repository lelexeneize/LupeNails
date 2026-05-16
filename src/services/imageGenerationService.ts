const PHOTOS: Record<string, string[]> = {
  almond: [
    'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=600',
    'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=600',
    'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600',
    'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=600',
    'https://images.unsplash.com/photo-1610992015732-2449b76344bc?q=80&w=600',
  ],
  coffin: [
    'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=600',
    'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=600',
    'https://images.unsplash.com/photo-1567721913486-6585f069b332?q=80&w=600',
    'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=600',
  ],
  stiletto: [
    'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=600',
    'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=600',
    'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=600',
    'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=600',
  ],
  square: [
    'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600',
    'https://images.unsplash.com/photo-1567721913486-6585f069b332?q=80&w=600',
    'https://images.unsplash.com/photo-1610992015732-2449b76344bc?q=80&w=600',
    'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=600',
  ],
};

const CHROME = 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=600';
const PINK = 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?q=80&w=600';
const RED = 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600';
const NUDE = 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=600';
const ART = 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=600';
const DARK = 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=600';
const GLITTER = 'https://images.unsplash.com/photo-1567721913486-6585f069b332?q=80&w=600';
const GENERAL = 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=600';

const COLOR_MAP: Record<string, string> = {
  'nude-silk': NUDE, 'milky-white': NUDE, latte: NUDE, 'sand-dune': NUDE, vanilla: NUDE,
  'rose-glaze': PINK, 'peachy-pink': PINK, bubblegum: PINK, 'hot-pink': PINK, mauve: PINK,
  'classic-red': RED, 'velvet-ruby': RED, 'wine-cellar': RED, crimson: RED, coral: RED,
  onyx: DARK, 'deep-espresso': DARK, charcoal: DARK, plum: DARK,
  'midnight-blue': DARK, 'sage-green': DARK, emerald: DARK,
  'neon-lime': DARK, 'electric-blue': DARK, 'sun-yellow': PINK,
};

export function generateNailImage(design: {
  shape: string; color: string; effect: string; art: string; accessory: string;
}): Promise<string | null> {
  const seed = hashDesign(design);
  const shape = design.shape || 'almond';
  const photos = PHOTOS[shape] || PHOTOS.almond;
  const colorMatch = COLOR_MAP[design.color];
  const effectMatch = design.effect === 'Chrome' ? CHROME : design.effect === 'Glitter' ? GLITTER : null;
  const artMatch = design.art !== 'none' ? ART : null;

  const pick = colorMatch || effectMatch || artMatch || photos[seed % photos.length] || GENERAL;
  return Promise.resolve(pick);
}

function hashDesign(d: Record<string, string>): number {
  let h = 0;
  const s = `${d.shape}|${d.color}|${d.effect}|${d.art}|${d.accessory}`;
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
  return Math.abs(h);
}
