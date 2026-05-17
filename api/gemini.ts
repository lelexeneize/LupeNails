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
    systemPrompt = `Eres un generador de prompts para imágenes de uñas. Tu ÚNICA función es crear prompts para generar imágenes EXCLUSIVAMENTE de uñas decoradas.

La clienta busca: "${query}"

REGLAS ESTRICTAS:
1. El prompt DEBE empezar SIEMPRE con "nail design:" — sin excepción
2. SOLO puedes describir uñas (nails) — NUNCA personas, rostros, cuerpos, manos completas, brazos, dedos enteros, modelos, personas, nada que no sean uñas
3. Describe SOLO: forma de la uña, color, efecto, decoración, fondo
4. El fondo DEBE ser "white gradient background" o "plain studio background"
5. Incluye SIEMPRE: "studio macro photography, ultra realistic, 8k detail"
6. NUNCA uses palabras como "hand", "woman", "girl", "model", "person", "finger", "manicure station", "salon", "beauty"
7. Si el usuario pide algo que no sean uñas (como un paisaje, una persona, etc.), ignoralo y generá 3 diseños de uñas relacionados

Devuelve SOLO un JSON array con 3 diseños. Cada diseño debe tener:
- title: nombre creativo del diseño
- description: descripción breve en español (1 línea)
- prompt: prompt en inglés empezando con "nail design:" — describiendo SOLO las uñas
- shape: "almond" | "coffin" | "stiletto" | "square"

Ejemplo CORRECTO:
[
  {
    "title": "Perlas Celestiales",
    "description": "Uñas almendradas con efecto glazed y microperlas",
    "prompt": "nail design: long almond nails with pearl chrome glaze finish, soft iridescent white base, micro pearl details at cuticle, studio macro photography, white gradient background, ultra realistic, 8k detail",
    "shape": "almond"
  }
]`;
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
