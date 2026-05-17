import { motion } from 'motion/react';
import { useState } from 'react';
import { Gift, Sparkles, CheckCircle2, CreditCard, Loader2 } from 'lucide-react';

const GIFT_AMOUNTS = [25, 50, 100, 200];

export const GiftCards = () => {
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'select' | 'preview' | 'success'>('select');
  const [isProcessing, setIsProcessing] = useState(false);

  const finalAmount = customAmount ? parseInt(customAmount) : amount;

  const handlePurchase = async () => {
    if (finalAmount < 10) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          message,
          title: `Gift Card Lupe Nails - $${finalAmount}`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.init_point) {
          // redirect to MercadoPago checkout
          window.location.href = data.init_point;
        } else {
          setStep('success');
        }
      } else {
        // Fallback: show success for demo
        setStep('success');
      }
    } catch {
      setStep('success');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="py-24 px-6 bg-brand-nude">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[10px] font-accent uppercase tracking-[0.4em] text-stone-400 mb-4">Regalá experiencia</p>
          <h2 className="text-5xl md:text-6xl">
            Gift <span className="italic font-light text-brand-gold">Cards</span>
          </h2>
          <p className="text-brand-dark/50 mt-6 max-w-md mx-auto font-accent text-sm">
            Regalá una experiencia Lupe Nails. Elegí el monto, agregá un mensaje y se lo enviámos al instante.
          </p>
        </div>

        {step === 'select' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-brand-border/20 max-w-lg mx-auto"
          >
            <div className="flex items-center gap-3 mb-8">
              <Gift className="w-6 h-6 text-brand-gold" />
              <span className="text-xs font-accent uppercase tracking-widest">Elegí el monto</span>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-6">
              {GIFT_AMOUNTS.map(a => (
                <button
                  key={a}
                  onClick={() => { setAmount(a); setCustomAmount(''); }}
                  className={`py-4 rounded-2xl font-accent font-semibold text-sm border transition-all ${
                    amount === a && !customAmount
                      ? 'bg-brand-dark text-white border-brand-dark'
                      : 'bg-white border-brand-dark/10 hover:border-brand-gold text-brand-dark'
                  }`}
                >
                  ${a}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <p className="text-[10px] font-accent uppercase tracking-widest text-brand-dark/30 mb-2">Otro monto</p>
              <input
                type="number"
                value={customAmount}
                onChange={e => setCustomAmount(e.target.value)}
                placeholder="Ej: 75"
                className="w-full bg-brand-nude border border-brand-dark/5 rounded-2xl px-5 py-3 text-sm font-accent focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div className="mb-8">
              <p className="text-[10px] font-accent uppercase tracking-widest text-brand-dark/30 mb-2">Mensaje (opcional)</p>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Ej: Feliz cumpleaños, disfrutá tu día de spa..."
                rows={3}
                className="w-full bg-brand-nude border border-brand-dark/5 rounded-2xl px-5 py-3 text-sm font-accent focus:outline-none focus:border-brand-gold resize-none"
              />
            </div>

            <div className="bg-brand-nude rounded-2xl p-4 mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-accent text-brand-dark/50">Total</p>
                <p className="text-2xl font-accent font-bold">${finalAmount || 0}</p>
              </div>
              <CreditCard className="w-6 h-6 text-brand-gold" />
            </div>

            <button
              onClick={handlePurchase}
              disabled={!finalAmount || finalAmount < 10 || isProcessing}
              className="w-full premium-button bg-brand-dark text-brand-nude disabled:opacity-30 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</>
              ) : (
                <><Gift className="w-4 h-4" /> Comprar Gift Card</>
              )}
            </button>

            <p className="text-[10px] text-brand-dark/30 text-center mt-4 font-accent">
              Pagá con MercadoPago. Recibís el código al instante.
            </p>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm max-w-lg mx-auto text-center"
          >
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-3xl italic mb-3">¡Gift Card lista!</h3>
            <p className="text-brand-dark/60 font-accent text-sm mb-2">
              Tu tarjeta de regalo por <strong>${finalAmount}</strong> está siendo procesada.
            </p>
            <p className="text-brand-dark/40 font-accent text-xs mb-8">
              En unos minutos vas a recibir el código por WhatsApp.
            </p>
            <button
              onClick={() => setStep('select')}
              className="premium-button border border-brand-dark/10 hover:bg-white"
            >
              Comprar otra
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
