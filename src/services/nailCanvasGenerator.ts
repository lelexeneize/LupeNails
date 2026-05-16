export function generateNailCanvas(design: {
  shape: string; color: string; effect: string; art: string; accessory: string;
}): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      const dpr = window.devicePixelRatio || 1;
      const canvas = document.createElement('canvas');
      canvas.width = 600 * dpr;
      canvas.height = 800 * dpr;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(null);
      ctx.scale(dpr, dpr);

      const COLORS: Record<string, string> = {
        'nude-silk': '#F3E5D8', 'milky-white': '#FFF8F0', latte: '#D2B48C',
        'sand-dune': '#C2B280', vanilla: '#F3E5AB', 'rose-glaze': '#FDE2E4',
        'peachy-pink': '#FFCBBE', bubblegum: '#FFADED', 'hot-pink': '#FF69B4',
        mauve: '#E0B0FF', 'classic-red': '#B22222', 'velvet-ruby': '#8B0000',
        'wine-cellar': '#4E0707', crimson: '#DC143C', coral: '#FF7F50',
        'midnight-blue': '#191970', 'sage-green': '#8FBC8F', 'sky-high': '#87CEEB',
        emerald: '#50C878', lavender: '#E6E6FA', onyx: '#1A1A1A',
        'deep-espresso': '#3E2723', charcoal: '#333333', plum: '#8E4585',
        'neon-lime': '#32CD32', 'electric-blue': '#00FFFF', 'sun-yellow': '#FFD700',
      };

      const nailColor = COLORS[design.color] || design.color || '#FDE2E4';

      // --- Background ---
      const bg = ctx.createLinearGradient(0, 0, 0, 800);
      bg.addColorStop(0, '#FFF8F3'); bg.addColorStop(1, '#EDE4DA');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 600, 800);

      // --- Finger base ---
      ctx.beginPath();
      ctx.moveTo(130, 320); ctx.bezierCurveTo(130, 480, 70, 550, 60, 650);
      ctx.lineTo(140, 650);
      ctx.bezierCurveTo(145, 550, 175, 480, 175, 320);
      ctx.closePath();
      const skin = ctx.createRadialGradient(95, 400, 20, 95, 450, 250);
      skin.addColorStop(0, '#F5E6D3'); skin.addColorStop(0.5, '#EED9C4'); skin.addColorStop(1, '#D4BFA8');
      ctx.fillStyle = skin;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.03)'; ctx.lineWidth = 1; ctx.stroke();

      // --- Shadow behind nail ---
      ctx.beginPath();
      drawNailShape(ctx, design.shape);
      ctx.closePath();
      ctx.save();
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 12;
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fill();
      ctx.restore();

      // --- Nail base with 3D color ---
      ctx.beginPath();
      drawNailShape(ctx, design.shape);
      ctx.closePath();
      ctx.save();

      // Fill with color + 3D gradient
      const grad = ctx.createLinearGradient(0, 0, 190, 0);
      const c = hexToRgb(nailColor);
      grad.addColorStop(0, `rgb(${c.r * 0.65 | 0},${c.g * 0.65 | 0},${c.b * 0.65 | 0})`);
      grad.addColorStop(0.15, nailColor);
      grad.addColorStop(0.5, nailColor);
      grad.addColorStop(0.85, nailColor);
      grad.addColorStop(1, `rgb(${c.r * 0.6 | 0},${c.g * 0.6 | 0},${c.b * 0.6 | 0})`);
      ctx.fillStyle = grad;
      ctx.fill();

      // Cylinder shading overlay
      ctx.clip();
      const cylinderGrad = ctx.createLinearGradient(0, 0, 190, 0);
      cylinderGrad.addColorStop(0, 'rgba(0,0,0,0.35)');
      cylinderGrad.addColorStop(0.12, 'rgba(0,0,0,0.08)');
      cylinderGrad.addColorStop(0.4, 'rgba(255,255,255,0.06)');
      cylinderGrad.addColorStop(0.6, 'rgba(255,255,255,0.03)');
      cylinderGrad.addColorStop(0.88, 'rgba(0,0,0,0.08)');
      cylinderGrad.addColorStop(1, 'rgba(0,0,0,0.4)');
      ctx.fillStyle = cylinderGrad;
      ctx.fillRect(0, 0, 190, 290);

      // --- Effect layers (inside clip) ---
      applyEffect(ctx, design.effect, nailColor);

      // --- Superior specular highlight (curved) ---
      ctx.beginPath();
      ctx.ellipse(70, 35, 25, 45, -0.25, 0, Math.PI * 2);
      const shine = ctx.createLinearGradient(40, 0, 100, 80);
      shine.addColorStop(0, 'rgba(255,255,255,0.45)');
      shine.addColorStop(0.3, 'rgba(255,255,255,0.08)');
      shine.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = shine;
      ctx.fill();

      // Secondary small highlight
      ctx.beginPath();
      ctx.ellipse(40, 60, 6, 15, -0.1, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fill();

      // --- Cuticle zone ---
      ctx.beginPath();
      ctx.ellipse(95, 265, 35, 12, 0, Math.PI, 0);
      const cuticleGrad = ctx.createLinearGradient(60, 260, 130, 280);
      cuticleGrad.addColorStop(0, 'rgba(0,0,0,0)');
      cuticleGrad.addColorStop(0.5, 'rgba(0,0,0,0.06)');
      cuticleGrad.addColorStop(1, 'rgba(0,0,0,0.12)');
      ctx.fillStyle = cuticleGrad;
      ctx.fill();

      // --- Art (inside clip) ---
      if (design.art && design.art !== 'none') {
        drawNailArt(ctx, design.art);
      }

      // --- Accessories (inside clip) ---
      if (design.accessory && design.accessory !== 'none') {
        drawAccessories(ctx, design.accessory);
      }

      ctx.restore(); // remove clip

      // --- Subtle tip transparency ---
      ctx.beginPath();
      drawNailShape(ctx, design.shape);
      ctx.closePath();
      ctx.save();
      ctx.clip();
      const tipGrad = ctx.createLinearGradient(0, 0, 0, 40);
      tipGrad.addColorStop(0, 'rgba(255,255,255,0.12)');
      tipGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = tipGrad;
      ctx.fillRect(0, 0, 190, 50);
      ctx.restore();

      // --- 3D side refline (edge detail) ---
      ctx.beginPath();
      drawNailShape(ctx, design.shape);
      ctx.closePath();
      ctx.strokeStyle = 'rgba(0,0,0,0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // --- Subtle skin fold at base ---
      ctx.beginPath();
      ctx.ellipse(95, 272, 32, 4, 0, Math.PI, 0);
      ctx.strokeStyle = 'rgba(0,0,0,0.04)';
      ctx.lineWidth = 1;
      ctx.stroke();

      resolve(canvas.toDataURL('image/png'));
    } catch (err) {
      console.error('Canvas error:', err);
      resolve(null);
    }
  });
}

function drawNailShape(ctx: CanvasRenderingContext2D, shape: string) {
  switch (shape) {
    case 'coffin':
      ctx.moveTo(95, 10); ctx.bezierCurveTo(145, 10, 175, 50, 175, 105);
      ctx.bezierCurveTo(173, 170, 155, 235, 145, 270);
      ctx.lineTo(45, 270);
      ctx.bezierCurveTo(35, 235, 17, 170, 15, 105);
      ctx.bezierCurveTo(15, 50, 45, 10, 95, 10);
      break;
    case 'stiletto':
      ctx.moveTo(95, 0); ctx.bezierCurveTo(170, 0, 195, 65, 195, 145);
      ctx.bezierCurveTo(195, 225, 155, 285, 95, 285);
      ctx.bezierCurveTo(35, 285, -5, 225, -5, 145);
      ctx.bezierCurveTo(-5, 65, 20, 0, 95, 0);
      break;
    case 'square':
      ctx.moveTo(95, 15); ctx.bezierCurveTo(140, 15, 165, 35, 165, 85);
      ctx.bezierCurveTo(165, 165, 155, 235, 148, 270);
      ctx.lineTo(42, 270);
      ctx.bezierCurveTo(35, 235, 25, 165, 25, 85);
      ctx.bezierCurveTo(25, 35, 50, 15, 95, 15);
      break;
    default: // almond
      ctx.moveTo(95, 15); ctx.bezierCurveTo(140, 15, 168, 55, 168, 125);
      ctx.bezierCurveTo(168, 200, 145, 280, 95, 280);
      ctx.bezierCurveTo(45, 280, 22, 200, 22, 125);
      ctx.bezierCurveTo(22, 55, 50, 15, 95, 15);
  }
}

function applyEffect(ctx: CanvasRenderingContext2D, effect: string, color: string) {
  if (effect === 'Chrome') {
    const g = ctx.createLinearGradient(0, 0, 190, 0);
    g.addColorStop(0, 'rgba(255,255,255,0.2)');
    g.addColorStop(0.2, 'rgba(255,200,220,0.15)');
    g.addColorStop(0.4, 'rgba(255,255,255,0.25)');
    g.addColorStop(0.55, 'rgba(200,220,255,0.1)');
    g.addColorStop(0.7, 'rgba(255,200,200,0.15)');
    g.addColorStop(0.85, 'rgba(255,255,255,0.2)');
    g.addColorStop(1, 'rgba(255,255,255,0.15)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 190, 290);
    for (let i = 0; i < 10; i++) {
      ctx.strokeStyle = `rgba(255,255,255,${0.04 + (i % 3) * 0.02})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(20 + i * 16, 5);
      ctx.lineTo(10 + i * 16, 280);
      ctx.stroke();
    }
  } else if (effect === 'Glazed') {
    const g = ctx.createLinearGradient(0, 0, 0, 290);
    g.addColorStop(0, 'rgba(255,255,255,0.45)');
    g.addColorStop(0.15, 'rgba(255,255,255,0.05)');
    g.addColorStop(0.85, 'rgba(255,255,255,0.03)');
    g.addColorStop(1, 'rgba(255,255,255,0.15)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 190, 290);
  } else if (effect === 'Glitter') {
    const seed = Date.now();
    for (let i = 0; i < 50; i++) {
      const x = 15 + ((seed * (i + 1) * 7) % 160);
      const y = 10 + ((seed * (i + 1) * 13) % 260);
      ctx.fillStyle = `hsla(${(seed + i * 37) % 360}, 80%, 70%, ${0.2 + ((seed * (i + 1) % 50) / 100)})`;
      ctx.beginPath();
      ctx.arc(x, y, 1 + ((seed * (i + 1)) % 3), 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (effect === 'Brillante') {
    const g = ctx.createLinearGradient(0, 0, 0, 290);
    g.addColorStop(0, 'rgba(255,255,255,0.2)');
    g.addColorStop(0.4, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 190, 290);
  }
  // 'Mate' = no overlay
}

function drawNailArt(ctx: CanvasRenderingContext2D, art: string) {
  switch (art) {
    case 'minimal':
      ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(50, 120); ctx.lineTo(140, 100); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(60, 130); ctx.lineTo(130, 115); ctx.stroke();
      ctx.beginPath(); ctx.arc(140, 100, 2.5, 0, Math.PI * 2); ctx.fillStyle = '#333'; ctx.fill();
      break;
    case 'marble':
      ctx.globalAlpha = 0.12;
      for (let i = 0; i < 8; i++) {
        ctx.strokeStyle = `hsl(${35 + i * 12}, 20%, ${50 + i * 5}%)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const sx = 30 + Math.random() * 130, sy = 60 + Math.random() * 170;
        ctx.moveTo(sx, sy);
        ctx.bezierCurveTo(sx + 30, sy - 20, sx + 60, sy + 15, sx + 90, sy - 8);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      break;
    case 'floral':
      const cx = 95, cy = 130;
      for (let a = 0; a < 5; a++) {
        const angle = (a / 5) * Math.PI * 2;
        const px = cx + Math.cos(angle) * 12, py = cy + Math.sin(angle) * 12;
        ctx.beginPath(); ctx.ellipse(px, py, 6, 3.5, angle, 0, Math.PI * 2);
        ctx.fillStyle = ['#FFB6C1', '#FFC0CB', '#FF69B4', '#FF1493', '#DB7093'][a];
        ctx.globalAlpha = 0.5; ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFD700'; ctx.fill();
      // Stem
      ctx.strokeStyle = '#7CB342'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cx, cy + 12); ctx.lineTo(cx + 10, cy + 30); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx + 8, cy + 22, 4, 2, 0.5, 0, Math.PI * 2);
      ctx.fillStyle = '#7CB342'; ctx.fill();
      break;
    case 'french':
      ctx.beginPath();
      ctx.arc(95, 32, 58, Math.PI * 1.1, -Math.PI * 0.1);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fill();
      ctx.strokeStyle = 'rgba(200,180,160,0.4)'; ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(95, 32, 58, Math.PI * 1.1, -Math.PI * 0.1);
      ctx.stroke();
      break;
  }
}

function drawAccessories(ctx: CanvasRenderingContext2D, acc: string) {
  const seed = Date.now();
  switch (acc) {
    case 'pearls':
      for (let i = 0; i < 5; i++) {
        const x = 30 + ((seed * (i + 1) * 11) % 130);
        const y = 70 + ((seed * (i + 1) * 17) % 120);
        const g = ctx.createRadialGradient(x - 1, y - 1, 0.5, x, y, 3.5);
        g.addColorStop(0, '#FFF'); g.addColorStop(0.4, '#F5F0E0'); g.addColorStop(1, '#D2B48C');
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.06)'; ctx.lineWidth = 0.5; ctx.stroke();
      }
      break;
    case 'crystals':
      for (let i = 0; i < 5; i++) {
        const x = 25 + ((seed * (i + 1) * 13) % 140);
        const y = 60 + ((seed * (i + 1) * 19) % 130);
        ctx.save(); ctx.translate(x, y); ctx.rotate((seed + i * 37) % 360 * Math.PI / 180);
        ctx.beginPath();
        for (let j = 0; j < 4; j++) {
          const a = (j / 4) * Math.PI * 2 - Math.PI / 2;
          const r = j % 2 === 0 ? 4.5 : 2.5;
          j === 0 ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fillStyle = '#E0FFFF'; ctx.globalAlpha = 0.7; ctx.fill();
        ctx.strokeStyle = '#FFF'; ctx.lineWidth = 0.5; ctx.stroke();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      break;
    case 'gold-flakes':
      for (let i = 0; i < 7; i++) {
        const x = 20 + ((seed * (i + 1) * 7) % 150);
        const y = 50 + ((seed * (i + 1) * 11) % 160);
        ctx.save(); ctx.translate(x, y); ctx.rotate((seed + i * 53) % 360 * Math.PI / 180);
        ctx.beginPath(); ctx.ellipse(0, 0, 4.5, 1.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700'; ctx.globalAlpha = 0.25 + (seed * (i + 1) % 30) / 100;
        ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      break;
  }
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16) || 0,
    g: parseInt(h.substring(2, 4), 16) || 0,
    b: parseInt(h.substring(4, 6), 16) || 0,
  };
}
