const SHAPE_PATHS: Record<string, string> = {
  almond: 'M 95 20 C 130 20 160 50 160 120 C 160 190 140 280 95 280 C 50 280 30 190 30 120 C 30 50 60 20 95 20 Z',
  coffin: 'M 95 15 C 140 15 170 45 170 100 C 170 160 150 240 140 270 L 50 270 C 40 240 20 160 20 100 C 20 45 50 15 95 15 Z',
  stiletto: 'M 95 0 C 160 0 185 60 185 140 C 185 220 150 290 95 290 C 40 290 5 220 5 140 C 5 60 30 0 95 0 Z',
  square: 'M 95 20 C 130 20 160 30 160 80 C 160 160 150 240 145 270 L 45 270 C 40 240 30 160 30 80 C 30 30 60 20 95 20 Z',
};

const ART_SVGS: Record<string, (ctx: CanvasRenderingContext2D, w: number, h: number) => void> = {
  minimal: (ctx, w, h) => {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.4);
    ctx.lineTo(w * 0.7, h * 0.35);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w * 0.7, h * 0.35, 3, 0, Math.PI * 2);
    ctx.fill();
  },
  marble: (ctx, w, h) => {
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `hsl(${40 + i * 20}, 30%, ${50 + i * 8}%)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const x = w * (0.2 + Math.random() * 0.6);
      const y = h * (0.3 + Math.random() * 0.5);
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x + 20, y - 15, x + 40, y + 10, x + 60, y - 5);
      ctx.stroke();
    }
    const rng = (Math.random() * 16777215 | 0).toString(16).padStart(6, '0');
    ctx.globalAlpha = 0.07;
    ctx.fillStyle = `#${rng}`;
    ctx.fillRect(w * 0.2, h * 0.3, w * 0.6, h * 0.5);
    ctx.globalAlpha = 1;
  },
  floral: (ctx, w, h) => {
    const cx = w * 0.5, cy = h * 0.5;
    for (let a = 0; a < 5; a++) {
      const angle = (a / 5) * Math.PI * 2;
      const px = cx + Math.cos(angle) * 15;
      const py = cy + Math.sin(angle) * 15;
      ctx.beginPath();
      ctx.ellipse(px, py, 8, 5, angle, 0, Math.PI * 2);
      ctx.fillStyle = ['#FFB6C1', '#FFC0CB', '#FF69B4', '#FF1493', '#DB7093'][a];
      ctx.globalAlpha = 0.6;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
  },
  french: (ctx, w, h) => {
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.15, w * 0.35, Math.PI, 0);
    ctx.fillStyle = '#FFF';
    ctx.fill();
    ctx.strokeStyle = '#F5F5DC';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.18, w * 0.38, Math.PI, 0);
    ctx.stroke();
  },
};

const ACC_DRAWS: Record<string, (ctx: CanvasRenderingContext2D, w: number, h: number) => void> = {
  pearls: (ctx, w, h) => {
    for (let i = 0; i < 6; i++) {
      const x = w * (0.2 + Math.random() * 0.6);
      const y = h * (0.3 + Math.random() * 0.4);
      const grad = ctx.createRadialGradient(x - 2, y - 2, 1, x, y, 4);
      grad.addColorStop(0, '#FFF');
      grad.addColorStop(0.5, '#F5F5DC');
      grad.addColorStop(1, '#D2B48C');
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  },
  crystals: (ctx, w, h) => {
    for (let i = 0; i < 8; i++) {
      const x = w * (0.15 + Math.random() * 0.7);
      const y = h * (0.25 + Math.random() * 0.5);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.random() * Math.PI);
      ctx.beginPath();
      for (let j = 0; j < 4; j++) {
        const a = (j / 4) * Math.PI * 2 - Math.PI / 2;
        const r = j % 2 === 0 ? 5 : 3;
        j === 0 ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fillStyle = '#E0FFFF';
      ctx.globalAlpha = 0.8;
      ctx.fill();
      ctx.strokeStyle = '#FFF';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  },
  'gold-flakes': (ctx, w, h) => {
    for (let i = 0; i < 10; i++) {
      const x = w * (0.1 + Math.random() * 0.8);
      const y = h * (0.2 + Math.random() * 0.6);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.random() * Math.PI);
      ctx.beginPath();
      ctx.ellipse(0, 0, 6, 2, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#FFD700';
      ctx.globalAlpha = 0.4 + Math.random() * 0.4;
      ctx.fill();
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  },
};

export function generateNailCanvas(design: {
  shape: string; color: string; effect: string; art: string; accessory: string;
}): Promise<string | null> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return resolve(null);

    const COLORS: Record<string, string> = {
      'nude-silk': '#F3E5D8', 'milky-white': '#FFF8F0', latte: '#D2B48C', 'sand-dune': '#C2B280', vanilla: '#F3E5AB',
      'rose-glaze': '#FDE2E4', 'peachy-pink': '#FFCBBE', bubblegum: '#FFADED', 'hot-pink': '#FF69B4', mauve: '#E0B0FF',
      'classic-red': '#B22222', 'velvet-ruby': '#8B0000', 'wine-cellar': '#4E0707', crimson: '#DC143C', coral: '#FF7F50',
      'midnight-blue': '#191970', 'sage-green': '#8FBC8F', 'sky-high': '#87CEEB', emerald: '#50C878', lavender: '#E6E6FA',
      onyx: '#1A1A1A', 'deep-espresso': '#3E2723', charcoal: '#333', plum: '#8E4585',
      'neon-lime': '#32CD32', 'electric-blue': '#00FFFF', 'sun-yellow': '#FFD700',
    };

    const bgColor = '#F5F0EB';
    const nailColor = COLORS[design.color] || design.color || '#FDE2E4';
    const path = SHAPE_PATHS[design.shape] || SHAPE_PATHS.almond;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 600, 800);

    // Soft shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.08)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 10;
    const shadowPath = new Path2D(path);
    shadowPath.transform(new DOMMatrix().translate(0, 5));
    ctx.fillStyle = '#000';
    ctx.fill(shadowPath);
    ctx.restore();

    // Main nail shape
    const nailPath = new Path2D(path);
    ctx.save();
    ctx.fillStyle = nailColor;
    ctx.fill(nailPath);

    // Apply effects
    if (design.effect === 'Chrome') {
      const grad = ctx.createLinearGradient(50, 0, 160, 280);
      grad.addColorStop(0, 'rgba(255,255,255,0.6)');
      grad.addColorStop(0.3, 'rgba(255,182,193,0.2)');
      grad.addColorStop(0.5, 'rgba(255,255,255,0.4)');
      grad.addColorStop(0.7, 'rgba(192,192,192,0.3)');
      grad.addColorStop(1, 'rgba(255,255,255,0.5)');
      ctx.fillStyle = grad;
      ctx.fill(nailPath);
      ctx.save();
      ctx.clip(nailPath);
      for (let i = 0; i < 20; i++) {
        ctx.strokeStyle = `hsla(${i * 18}, 50%, 70%, 0.1)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(30 + i * 7, 0);
        ctx.lineTo(20 + i * 7, 280);
        ctx.stroke();
      }
      ctx.restore();
    } else if (design.effect === 'Glazed') {
      const grad = ctx.createLinearGradient(0, 0, 0, 280);
      grad.addColorStop(0, 'rgba(255,255,255,0.5)');
      grad.addColorStop(0.3, 'rgba(255,255,255,0.05)');
      grad.addColorStop(0.7, 'rgba(255,255,255,0.05)');
      grad.addColorStop(1, 'rgba(255,255,255,0.2)');
      ctx.fillStyle = grad;
      ctx.fill(nailPath);
    } else if (design.effect === 'Glitter') {
      ctx.clip(nailPath);
      for (let i = 0; i < 60; i++) {
        const x = 30 + Math.random() * 130;
        const y = 20 + Math.random() * 250;
        ctx.fillStyle = `hsla(${Math.random() * 360}, 80%, 70%, ${0.3 + Math.random() * 0.5})`;
        ctx.beginPath();
        ctx.arc(x, y, 1 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    } else if (design.effect === 'Mate') {
      // Matte = no extra shine
    } else {
      // Brillante = subtle shine
      const grad = ctx.createLinearGradient(0, 0, 0, 280);
      grad.addColorStop(0, 'rgba(255,255,255,0.3)');
      grad.addColorStop(0.5, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fill(nailPath);
    }

    // Shine highlight
    ctx.save();
    ctx.clip(nailPath);
    const shine = ctx.createLinearGradient(30, 20, 100, 100);
    shine.addColorStop(0, 'rgba(255,255,255,0.4)');
    shine.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = shine;
    ctx.beginPath();
    ctx.ellipse(70, 60, 30, 50, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();

    // Art
    if (design.art && design.art !== 'none' && ART_SVGS[design.art]) {
      ctx.save();
      ctx.clip(nailPath);
      ART_SVGS[design.art](ctx, 190, 280);
      ctx.restore();
    }

    // Accessories
    if (design.accessory && design.accessory !== 'none' && ACC_DRAWS[design.accessory]) {
      ctx.save();
      ctx.clip(nailPath);
      ACC_DRAWS[design.accessory](ctx, 190, 280);
      ctx.restore();
    }

    // Nail outline
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    ctx.stroke(nailPath);

    resolve(canvas.toDataURL('image/png'));
  });
}
