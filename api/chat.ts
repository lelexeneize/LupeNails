/**
 * Chatbot IA — responde preguntas frecuentes sobre Lupe Nails Studio
 * Usa Gemini para respuestas naturales y contextuales
 */

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history } = req.body || {};
  if (!message) {
    return res.status(400).json({ error: 'message required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const systemPrompt = `Sos Luna, la asistente virtual de "Lupe Nails Studio", un estudio premium de uñas en Buenos Aires.

INFORMACIÓN DEL NEGOCIO:
- Servicios: Kapping ($35, 60min), Soft Gel ($45, 90min), Nail Art Luxury (+$15, 30+min), Semi Permanente ($25, 45min)
- Ubicación: Av. Corrientes 1234, CABA (Palermo)
- Horarios: Lun-Vie 10-20hs, Sáb 10-18hs
- WhatsApp: +54 11 1234-5678
- Instagram: @lupenails
- Se aceptan: Efectivo, débito, crédito, MercadoPago
- Diseños personalizados: Sí, se pueden crear diseños únicos con nail art

REGLAS:
- Respondé SIEMPRE en español argentino, con tono cálido y cercano
- Respuestas breves y útiles (máximo 3 oraciones)
- Si preguntan por precios, mencioná los servicios relevantes
- Si preguntan por reservas, decí que pueden reservar desde la web
- Si no sabés algo, decí que consulten por WhatsApp
- NUNCA inventes información que no esté en el contexto

Historial del chat: ${JSON.stringify(history || [])}
Consulta de la clienta: "${message}"`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('Chatbot API error:', err);
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ error: 'Respuesta vacía' });
    }

    const cleaned = text.replace(/```json|```|```text/g, '').trim();
    res.json({ response: cleaned });
  } catch (err) {
    console.error('Chatbot error:', err);
    res.status(500).json({ error: 'Error generando respuesta' });
  }
}
