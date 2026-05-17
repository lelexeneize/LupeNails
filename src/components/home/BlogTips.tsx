import { motion } from 'motion/react';
import { ArrowRight, Clock, Heart } from 'lucide-react';

const ARTICLES = [
  {
    id: 1,
    title: 'Cómo mantener tu semipermanente impecable 3 semanas',
    excerpt: 'Tips de expertas para que el esmaltado dure como el primer día. La clave está en la preparación.',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=600',
    readTime: '4 min',
    category: 'Cuidado'
  },
  {
    id: 2,
    title: 'Las 5 formas de uñas más favorecedoras según tu mano',
    excerpt: 'No todas las formas quedan igual en todas las manos. Descubrí cuál es la tuya ideal.',
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&q=80&w=600',
    readTime: '5 min',
    category: 'Tendencias'
  },
  {
    id: 3,
    title: 'Kapping vs Soft Gel: ¿cuál elegir?',
    excerpt: 'Las diferencias entre ambas técnicas para que llegues al turno sabiendo exactamente qué pedir.',
    image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&q=80&w=600',
    readTime: '3 min',
    category: 'Guía'
  },
  {
    id: 4,
    title: 'Colores que serán tendencia esta temporada',
    excerpt: 'Los tonos que todas van a estar pidiendo en el estudio. Preparate para brillar.',
    image: 'https://images.unsplash.com/photo-1563310026068-5c9405b1104b?auto=format&fit=crop&q=80&w=600',
    readTime: '2 min',
    category: 'Tendencias'
  },
];

export const BlogTips = () => {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-[10px] font-accent uppercase tracking-[0.4em] text-stone-400 mb-4">Tips & Tendencias</p>
            <h2 className="text-5xl md:text-6xl">
              Blog de <span className="italic font-light text-brand-gold">Uñas</span>
            </h2>
          </div>
          <button className="flex items-center gap-2 text-xs font-accent uppercase tracking-widest text-brand-dark/50 hover:text-brand-dark transition-colors">
            Ver todos los artículos <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ARTICLES.map((article, i) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/3] rounded-[2rem] overflow-hidden mb-5 bg-brand-nude">
                <img
                  src={article.image}
                  alt={article.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-accent uppercase tracking-widest text-brand-gold">{article.category}</span>
                <span className="w-1 h-1 rounded-full bg-brand-dark/10" />
                <span className="text-[10px] font-accent text-brand-dark/30 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {article.readTime}
                </span>
              </div>

              <h3 className="font-accent font-semibold text-lg mb-2 leading-snug group-hover:text-brand-gold transition-colors">
                {article.title}
              </h3>
              <p className="text-sm text-brand-dark/50 leading-relaxed">{article.excerpt}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
