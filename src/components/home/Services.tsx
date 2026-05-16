import { motion } from 'motion/react';
import { Sparkles, Zap, Shield, Heart, Clock } from 'lucide-react';

const services = [
  {
    id: 'kapping',
    name: 'Kapping',
    duration: '60 min',
    price: '$35',
    description: 'Refuerzo de uña natural para máxima durabilidad y brillo.',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=600&h=800'
  },
  {
    id: 'soft-gel',
    name: 'Soft Gel',
    duration: '90 min',
    price: '$45',
    description: 'Extensiones ligeras y flexibles con acabado natural.',
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&q=80&w=600&h=800'
  },
  {
    id: 'nail-art',
    name: 'Nail Art Luxury',
    duration: '30+ min',
    price: '+ $15',
    description: 'Diseños personalizados pintados a mano o 3D.',
    image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&q=80&w=600&h=800'
  },
  {
    id: 'semi-perm',
    name: 'Semi Permanente',
    duration: '45 min',
    price: '$25',
    description: 'Color impecable que dura hasta 3 semanas.',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=600&h=800&fit=crop&crop=top'
  }
];

export const Services = ({ onBookingClick }: { onBookingClick: () => void }) => {
  return (
    <section id="servicios" className="py-24 px-6 bg-brand-nude border-y border-brand-border/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] font-accent uppercase tracking-[0.4em] text-stone-400 mb-4"
          >
            Nuestros Rituales
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl"
          >
            Experiencias de <span className="italic font-light text-brand-gold">Lujo</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-6">
                <img 
                  src={service.image} 
                  alt={service.name} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-colors duration-500" />
                
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="glass-panel p-4 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <p className="text-xs font-accent font-semibold">{service.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-accent font-medium">{service.name}</h3>
                <span className="font-accent text-brand-gold">{service.price}</span>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-brand-dark/40 font-accent uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {service.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Higiene Pro
                </div>
              </div>

              <button 
                onClick={onBookingClick}
                className="mt-6 w-full py-3 rounded-xl border border-brand-dark/5 text-xs font-accent uppercase tracking-widest hover:bg-brand-dark hover:text-brand-nude transition-all duration-500"
              >
                Reservar Ahora
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
