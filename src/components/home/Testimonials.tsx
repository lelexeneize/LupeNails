import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Camila R.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    text: 'Salió exactamente como le mostré en la foto. El diseño chrome quedó impecable y duró semanas sin saltarse.',
    rating: 5,
    service: 'Soft Gel + Nail Art'
  },
  {
    id: 2,
    name: 'Martina G.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    text: 'El mejor lugar para uñas en CABA. La atención es increíble y los diseños son únicos. Súper recomendado.',
    rating: 5,
    service: 'Kapping'
  },
  {
    id: 3,
    name: 'Lucía P.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    text: 'Hace un año que voy y siempre salgo feliz. La calidad del semipermanente es superior a otros lugares.',
    rating: 5,
    service: 'Semi Permanente'
  },
  {
    id: 4,
    name: 'Sofía D.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    text: 'Las uñas 3D que me hicieron para mi casamiento fueron una locura. Todas las invitadas me preguntaron dónde me las hice.',
    rating: 5,
    service: 'Nail Art Luxury'
  },
];

export const Testimonials = () => {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] font-accent uppercase tracking-[0.4em] text-stone-400 mb-4"
          >
            Clientes Felices
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl"
          >
            Lo que dicen <span className="italic font-light text-brand-gold">de nosotras</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-brand-nude rounded-[2rem] p-8 border border-brand-border/20 relative"
            >
              <Quote className="w-8 h-8 text-brand-gold/20 absolute top-6 right-6" />
              
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, ri) => (
                    <Star key={ri} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                  ))}
                </div>
                <span className="text-[10px] font-accent uppercase tracking-widest text-brand-dark/30">{t.service}</span>
              </div>

              <p className="text-sm text-brand-dark/70 leading-relaxed mb-6 font-accent">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <span className="text-sm font-accent font-semibold">{t.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
