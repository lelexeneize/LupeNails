import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Instagram, Smartphone, Heart, MessageCircle, ExternalLink, Sparkles } from 'lucide-react';

interface TrendingDesign {
  id: string;
  title: string;
  category: string;
  image: string;
  views?: string;
}

export const ViralFeed = () => {
  const [designs, setDesigns] = useState<TrendingDesign[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch('/api/pins?offset=0&limit=8');
        if (res.ok) {
          const data = await res.json();
          setDesigns(data.designs?.slice(0, 8) || []);
        }
      } catch {
        // Silencio
      }
    };
    fetchTrending();
  }, []);

  // No mostrar si no hay diseños
  if (designs.length === 0) return null;

  return (
    <section className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 text-brand-gold mb-4">
              <Instagram className="w-5 h-5" />
              <span className="text-[10px] font-accent uppercase tracking-[0.4em]">Viral on Socials</span>
            </div>
            <h2 className="text-5xl md:text-6xl leading-tight">Universo <br /> <span className="italic font-light text-brand-gold">en un Scroll</span></h2>
          </div>
          <a 
            href="https://www.pinterest.com/search/pins/?q=nail+art"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm font-accent uppercase tracking-widest border-b border-brand-dark/20 pb-2 hover:border-brand-gold transition-colors"
          >
            Ver más en Pinterest <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {designs.map((design, index) => (
            <motion.div
              key={design.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative aspect-[9/16] rounded-[2rem] overflow-hidden group cursor-pointer"
            >
              <img 
                src={design.image}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                alt={design.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent opacity-60" />
              
              <div className="absolute bottom-6 left-6 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-white/90">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-accent">{design.title}</span>
                </div>
                <span className="text-[10px] font-accent uppercase tracking-widest text-white/60">{design.category}</span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-brand-dark/20">
                <div className="flex gap-4">
                  <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
