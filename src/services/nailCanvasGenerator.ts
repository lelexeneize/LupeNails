function drawNailPath(ctx: CanvasRenderingContext2D, shape: string) {
  ctx.beginPath();
  switch (shape) {
    case 'coffin':
      ctx.moveTo(95, 15); ctx.bezierCurveTo(140, 15, 170, 45, 170, 100);
      ctx.bezierCurveTo(170, 160, 150, 240, 140, 270);
      ctx.lineTo(50, 270);
      ctx.bezierCurveTo(40, 240, 20, 160, 20, 100);
      ctx.bezierCurveTo(20, 45, 50, 15, 95, 15);
      break;
    case 'stiletto':
      ctx.moveTo(95, 0); ctx.bezierCurveTo(160, 0, 185, 60, 185, 140);
      ctx.bezierCurveTo(185, 220, 150, 290, 95, 290);
      ctx.bezierCurveTo(40, 290, 5, 220, 5, 140);
      ctx.bezierCurveTo(5, 60, 30, 0, 95, 0);
      break;
    case 'square':
      ctx.moveTo(95, 20); ctx.bezierCurveTo(130, 20, 160, 30, 160, 80);
      ctx.bezierCurveTo(160, 160, 150, 240, 145, 270);
      ctx.lineTo(45, 270);
      ctx.bezierCurveTo(40, 240, 30, 160, 30, 80);
      ctx.bezierCurveTo(30, 30, 60, 20, 95, 20);
      break;
    default: // almond
      ctx.moveTo(95, 20); ctx.bezierCurveTo(130, 20, 160, 50, 160, 120);
      ctx.bezierCurveTo(160, 190, 140, 280, 95, 280);
      ctx.bezierCurveTo(50, 280, 30, 190, 30, 120);
      ctx.bezierCurveTo(30, 50, 60, 20, 95, 20);
  }
  ctx.closePath();
}

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
      if (!ctx) return resolve(null);

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

      // Background
      ctx.fillStyle = '#F5F0EB';
      ctx.fillRect(0, 0, 600, 800);

      // Shadow
      ctx.save();
      ctx.translate(0, 6);
      drawNailPath(ctx, design.shape);
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fill();
      ctx.restore();

      // Nail base
      drawNailPath(ctx, design.shape);
      ctx.save();
      ctx.clip();

      // Fill with color
      ctx.fillStyle = nailColor;
      ctx.fillRect(0, 0, 600, 800);

      // Effect layers
      if (design.effect === 'Chrome') {
        const grad = ctx.createLinearGradient(0, 0, 200, 280);
        grad.addColorStop(0, 'rgba(255,255,255,0.5)');
        grad.addColorStop(0.3, 'rgba(255,200,210,0.2)');
        grad.addColorStop(0.5, 'rgba(255,255,255,0.3)');
        grad.addColorStop(0.7, 'rgba(200,200,210,0.2)');
        grad.addColorStop(1, 'rgba(255,255,255,0.4)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 600, 800);

        for (let i = 0; i < 15; i++) {
          ctx.strokeStyle = `rgba(255,255,255,${0.05 + (i % 3) * 0.03})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(25 + i * 10, 0);
          ctx.lineTo(15 + i * 10, 280);
          ctx.stroke();
        }
      } else if (design.effect === 'Glazed') {
        const grad = ctx.createLinearGradient(0, 0, 0, 280);
        grad.addColorStop(0, 'rgba(255,255,255,0.5)');
        grad.addColorStop(0.2, 'rgba(255,255,255,0.05)');
        grad.addColorStop(0.8, 'rgba(255,255,255,0.05)');
        grad.addColorStop(1, 'rgba(255,255,255,0.2)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 600, 800);
      } else if (design.effect === 'Glitter') {
        for (let i = 0; i < 40; i++) {
          ctx.fillStyle = `hsla(${Math.random() * 360}, 80%, 70%, ${0.3 + Math.random() * 0.5})`;
          ctx.beginPath();
          ctx.arc(30 + Math.random() * 130, 20 + Math.random() * 250, 1 + Math.random() * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (design.effect === 'Brillante') {
        const grad = ctx.createLinearGradient(0, 0, 0, 280);
        grad.addColorStop(0, 'rgba(255,255,255,0.25)');
        grad.addColorStop(0.5, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 600, 800);
      }

      // Shine highlight
      const shine = ctx.createLinearGradient(30, 20, 90, 100);
      shine.addColorStop(0, 'rgba(255,255,255,0.35)');
      shine.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = shine;
      ctx.beginPath();
      ctx.ellipse(65, 50, 22, 40, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Art
      if (design.art && design.art !== 'none') {
        drawArt(ctx, design.art);
      }

      // Accessories
      if (design.accessory && design.accessory !== 'none') {
        drawAccessories(ctx, design.accessory);
      }

      ctx.restore();

      // Outline
      drawNailPath(ctx, design.shape);
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

function drawArt(ctx: CanvasRenderingContext2D, art: string) {
  switch (art) {
    case 'minimal':
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(55, 110); ctx.lineTo(130, 95); ctx.stroke();
      ctx.beginPath(); ctx.arc(130, 95, 3, 0, Math.PI * 2); ctx.fill();
      break;
    case 'marble':
      ctx.globalAlpha = 0.15;
      for (let i = 0; i < 6; i++) {
        ctx.strokeStyle = `hsl(${40 + i * 15}, 25%, ${55 + i * 5}%)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40 + Math.random() * 110, 80 + Math.random() * 120);
        ctx.bezierCurveTo(60 + Math.random() * 100, 60 + Math.random() * 100,
          80 + Math.random() * 80, 100 + Math.random() * 80, 100 + Math.random() * 80, 70 + Math.random() * 100);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      break;
    case 'floral':
      const cx = 95, cy = 130;
      for (let a = 0; a < 5; a++) {
        const angle = (a / 5) * Math.PI * 2;
        const px = cx + Math.cos(angle) * 14;
        const py = cy + Math.sin(angle) * 14;
        ctx.beginPath();
        ctx.ellipse(px, py, 7, 4, angle, 0, Math.PI * 2);
        ctx.fillStyle = ['#FFB6C1', '#FFC0CB', '#FF69B4', '#FF1493', '#DB7093'][a];
        ctx.globalAlpha = 0.5;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FFD700'; ctx.fill();
      break;
    case 'french':
      ctx.beginPath();
      ctx.arc(95, 40, 55, Math.PI, 0); ctx.closePath();
      ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fill();
      break;
  }
}

function drawAccessories(ctx: CanvasRenderingContext2D, acc: string) {
  switch (acc) {
    case 'pearls':
      for (let i = 0; i < 6; i++) {
        const x = 35 + Math.random() * 120;
        const y = 80 + Math.random() * 100;
        const g = ctx.createRadialGradient(x - 1, y - 1, 0.5, x, y, 4);
        g.addColorStop(0, '#FFF'); g.addColorStop(0.5, '#F5F0E0'); g.addColorStop(1, '#D2B48C');
        ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      }
      break;
    case 'crystals':
      for (let i = 0; i < 6; i++) {
        const x = 30 + Math.random() * 130;
        const y = 70 + Math.random() * 120;
        ctx.save(); ctx.translate(x, y); ctx.rotate(Math.random() * Math.PI);
        ctx.beginPath();
        for (let j = 0; j < 4; j++) {
          const a = (j / 4) * Math.PI * 2 - Math.PI / 2;
          const r = j % 2 === 0 ? 5 : 2.5;
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
      for (let i = 0; i < 8; i++) {
        const x = 25 + Math.random() * 140;
        const y = 60 + Math.random() * 150;
        ctx.save(); ctx.translate(x, y); ctx.rotate(Math.random() * Math.PI);
        ctx.beginPath(); ctx.ellipse(0, 0, 5, 1.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700'; ctx.globalAlpha = 0.3 + Math.random() * 0.4; ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      break;
  }
}
