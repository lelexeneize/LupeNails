import { motion } from 'motion/react';
import { MapPin, Phone, Clock, Instagram, ArrowRight } from 'lucide-react';

export const Location = () => {
  return (
    <section className="py-24 px-6 bg-brand-nude border-y border-brand-border/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="rounded-[3rem] overflow-hidden shadow-xl aspect-[4/3] lg:aspect-auto lg:h-[450px]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.016712505842!2d-58.38375908477039!3d-34.60373888045914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4aa9f0a6da5edb%3A0x11bead4e234e558b!2sObelisco!5e0!3m2!1ses!2sar!4v1684567890123!5m2!1ses!2sar"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '300px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación del estudio"
              className="w-full h-full"
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <p className="text-[10px] font-accent uppercase tracking-[0.4em] text-stone-400 mb-4">Visitanos</p>
            <h2 className="text-5xl md:text-6xl mb-8">
              Nuestro <span className="italic font-light text-brand-gold">Estudio</span>
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <MapPin className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <p className="font-accent font-semibold mb-1">Dirección</p>
                  <p className="text-sm text-brand-dark/60">Av. Corrientes 1234, CABA</p>
                  <p className="text-sm text-brand-dark/40">Palermo, Buenos Aires</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Clock className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <p className="font-accent font-semibold mb-1">Horarios</p>
                  <p className="text-sm text-brand-dark/60">Lun — Vie: 10:00 — 20:00</p>
                  <p className="text-sm text-brand-dark/60">Sáb: 10:00 — 18:00</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Phone className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <p className="font-accent font-semibold mb-1">Contacto</p>
                  <p className="text-sm text-brand-dark/60">+54 11 1234-5678</p>
                  <p className="text-sm text-brand-dark/40">hola@lupenails.com</p>
                </div>
              </div>

              <a
                href="https://www.instagram.com/lupenails/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 mt-8 px-6 py-3 bg-white border border-brand-dark/5 rounded-full w-fit hover:border-brand-gold transition-all text-xs font-accent uppercase tracking-widest"
              >
                <Instagram className="w-4 h-4" />
                @lupenails
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
