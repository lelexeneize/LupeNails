export default async function handler(req, res) {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'prompt required' });

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('HF API error:', err);
      return res.status(response.status).json({ error: err });
    }

    const buffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Image generation failed' });
  }
}
