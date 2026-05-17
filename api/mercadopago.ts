/**
 * MercadoPago - Crea preferencia de pago para Gift Cards
 */

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, title, message } = req.body || {};
  if (!amount || amount < 10) {
    return res.status(400).json({ error: 'Monto inválido (mínimo $10)' });
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

  // Sin access token: modo demo/dev
  if (!accessToken) {
    console.log('MP demo: gift card creada', { amount, title, message });
    return res.json({
      id: `gc_demo_${Date.now()}`,
      init_point: null, // Sin redirect, modo éxito directo
      status: 'demo',
    });
  }

  try {
    const preference = {
      items: [{
        id: `gift-card-${Date.now()}`,
        title: title || `Gift Card Lupe Nails`,
        description: message || 'Tarjeta de regalo',
        quantity: 1,
        currency_id: 'ARS',
        unit_price: amount,
      }],
      back_urls: {
        success: 'https://lupenails.vercel.app/?gift=success',
        failure: 'https://lupenails.vercel.app/?gift=failure',
        pending: 'https://lupenails.vercel.app/?gift=pending',
      },
      auto_return: 'approved',
      notification_url: 'https://lupenails.vercel.app/api/mercadopago-webhook',
    };

    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference),
    });

    if (!mpRes.ok) {
      const err = await mpRes.text();
      console.error('MP error:', err);
      return res.status(mpRes.status).json({ error: err });
    }

    const mpData = await mpRes.json();
    res.json({
      id: mpData.id,
      init_point: mpData.init_point,
      status: 'created',
    });
  } catch (err) {
    console.error('MP create preference error:', err);
    res.status(500).json({ error: 'Error al crear preferencia de pago' });
  }
}
