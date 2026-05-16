import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Heart, Share2, Maximize2, X } from 'lucide-react';

const CATEGORIES = [
  'All', 'Chrome', 'French', 'Minimalist', 'Luxury', 'Clean Girl', 'Aura', '3D Art'
];

const DESIGNS = [
  { id: 1, title: 'Pearl Chrome', category: 'Chrome', image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&q=80&w=600&h=800', height: 'aspect-[3/4]' },
  { id: 2, title: 'Minimalist Line', category: 'Minimalist', image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&q=80&w=600&h=600', height: 'aspect-[1/1]' },
  { id: 3, title: 'Glazed Donut', category: 'Clean Girl', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=600&h=400', height: 'aspect-[3/2]' },
  { id: 4, title: 'Aura Gradient', category: 'Aura', image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&q=80&w=600&h=750', height: 'aspect-[4/5]' },
  { id: 5, title: 'Classic French', category: 'French', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=600&h=800', height: 'aspect-[3/4]' },
  { id: 6, title: 'Gold Flakes', category: 'Luxury', image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&q=80&w=600&h=600', height: 'aspect-[1/1]' },
  { id: 7, title: '3D Chrome', category: '3D Art', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=600&h=900', height: 'aspect-[2/3]' },
  { id: 8, title: 'Nude Velvet', category: 'Clean Girl', image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&q=80&w=600&h=750', height: 'aspect-[4/5]' },
];

export const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedDesign, setSelectedDesign] = useState<any>(null);

  const filteredDesigns = DESIGNS.filter(d => activeCategory === 'All' || d.category === activeCategory);

  return (
    <section id="designs" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <p className="text-[10px] font-accent uppercase tracking-[0.4em] text-stone-400 mb-4">Pinterest Viral</p>
          <h2 className="text-5xl md:text-6xl mb-8">Nails <span className="italic font-light text-brand-gold">Inspiration</span></h2>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-4 max-w-full justify-start md:justify-center no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-xs font-accent uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${
                  activeCategory === cat 
                    ? 'bg-brand-dark text-brand-nude' 
                    : 'bg-white border border-brand-dark/5 text-brand-dark/60 hover:border-brand-gold'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="masonry-grid">
          <AnimatePresence mode="popLayout">
            {filteredDesigns.map((design) => (
              <motion.div
                key={design.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className={`mb-4 group relative overflow-hidden rounded-3xl cursor-zoom-in ${design.height}`}
                onClick={() => setSelectedDesign(design)}
              >
                <img 
                  src={design.image} 
                  alt={design.title} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-between p-6">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-brand-dark transition-all">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-brand-dark transition-all">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-end justify-between text-white">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1">{design.category}</p>
                      <p className="font-display text-xl">{design.title}</p>
                    </div>
                    <Maximize2 className="w-5 h-5 opacity-70" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-16 text-center">
          <button className="premium-button border border-brand-dark/10 hover:bg-white transition-colors">
            Cargar más diseños
          </button>
        </div>
      </div>

      <AnimatePresence>
        {selectedDesign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-nude/95 backdrop-blur-xl"
          >
            <motion.button
              onClick={() => setSelectedDesign(null)}
              className="absolute top-8 right-8 p-4 bg-white/50 rounded-full hover:bg-white transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>

            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="rounded-[40px] overflow-hidden shadow-2xl"
              >
                <img src={selectedDesign.image} alt={selectedDesign.title} className="w-full h-full object-cover" />
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-xs font-accent uppercase tracking-[0.3em] text-brand-dark/40 mb-4">{selectedDesign.category}</p>
                <h3 className="text-5xl mb-6">{selectedDesign.title}</h3>
                <p className="text-lg text-brand-dark/60 mb-10 leading-relaxed">
                  Este diseño viral combina técnicas de chrome perlado con una base nude traslúcida. 
                  Perfecto para ocasiones especiales o un look clean girl sofisticado.
                </p>
                
                <div className="flex flex-col gap-4">
                  <button className="premium-button bg-brand-dark text-brand-nude shadow-xl">
                    Quiero este diseño
                  </button>
                  <button className="premium-button border border-brand-dark/10">
                    Guardar en favoritos
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
