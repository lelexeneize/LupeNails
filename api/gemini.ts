const RATE_LIMIT = 20;
const WINDOW_MS = 60_000;
const ipMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipMap.get(ip);
  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export default async function handler(req: any, res: any) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Demasiadas solicitudes' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, design, query } = req.body || {};

  if (!action || typeof action !== 'string') {
    return res.status(400).json({ error: 'action required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  let systemPrompt = '';
  if (action === 'design') {
    if (!design) return res.status(400).json({ error: 'design required' });
    const { shape, color, effect, art, accessory } = design;
    systemPrompt = `Actúa como estilista de uñas de lujo en "Lupe Nails Studio".
La clienta diseñó: forma ${shape}, color ${color}, efecto ${effect}, arte ${art}, accesorios ${accessory}.
Genera un nombre artístico viral y descripción aspiracional de 2 líneas.
Responde SOLO JSON: { "name": "...", "description": "..." }`;
  } else if (action === 'inspire') {
    if (!query) return res.status(400).json({ error: 'query required' });
    systemPrompt = `Actúa como estilista de uñas experta. La clienta busca: "${query}".
Recomienda 3 diseños virales de Pinterest/Instagram.
CADA DISEÑO DEBE SER EXCLUSIVAMENTE DE UÑAS — nada que no sean uñas decoradas.
Cada uno con: title, description breve, elements (array de 3 string de colores/materiales),
y prompt: descripción detallada en inglés para generar IMAGEN DE UÑAS FOTORREALISTA con IA.
El prompt DEBE empezar con "nail design:" y describir solo uñas. Ejemplo:
"nail design: long almond nails, pearl chrome finish, soft pink base, tiny crystal details at cuticle, studio macro photography, white gradient background, ultra realistic, 8k detail"
NUNCA incluyas personas, rostros, cuerpos, manos completas ni nada que no sean uñas.
Responde SOLO JSON array.`;
  } else if (action === 'parse') {
    if (!query) return res.status(400).json({ error: 'query required' });
    systemPrompt = `Extraé los parámetros de diseño de uñas de esta descripción: "${query}".
Devuelve SOLO JSON con esta estructura exacta:
{
  "shape": "almond" | "coffin" | "stiletto" | "square",
  "colorName": "descripción del color en español (ej: rosa pastel, nude, rojo vino)",
  "effect": "Brillante" | "Mate" | "Chrome" | "Glazed" | "Glitter",
  "art": "none" | "minimal" | "marble" | "floral" | "french",
  "accessory": "none" | "pearls" | "crystals" | "gold-flakes",
  "name": "nombre creativo para este diseño"
}
Elegí el valor más cercano. Si no hay información para un campo, usá el default (shape: almond, effect: Brillante, art: none, accessory: none).`;
  } else {
    return res.status(400).json({ error: 'acción no válida' });
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini API error:', err);
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ error: 'Respuesta vacía de Gemini' });
    }

    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    res.json(parsed);
  } catch (err) {
    console.error('Gemini proxy error:', err);
    res.status(500).json({ error: 'Error generando respuesta' });
  }
}
