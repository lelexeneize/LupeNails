// api/gemini.ts
// Vercel Serverless Function — proxy seguro para Google Gemini
//
// SETUP:
//   1. Colocá este archivo en /api/gemini.ts en la raíz del proyecto
//   2. En Vercel Dashboard → Settings → Environment Variables, agregá:
//      GEMINI_API_KEY = tu_clave_real
//   3. En tu frontend, reemplazá las llamadas directas a Gemini por:
//      fetch('/api/gemini', { method: 'POST', body: JSON.stringify({ prompt }) })
//
// La API key NUNCA se expone al navegador.

import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key not configured on server' });
  }

  const { prompt, contents, generationConfig } = req.body ?? {};

  if (!prompt && !contents) {
    return res.status(400).json({ error: 'Se requiere "prompt" o "contents"' });
  }

  // Construir el body para la API de Gemini
  const geminiBody = {
    contents: contents ?? [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: generationConfig ?? {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  };

  try {
    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return res.status(geminiRes.status).json({ error: errText });
    }

    const data = await geminiRes.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('[/api/gemini] Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
