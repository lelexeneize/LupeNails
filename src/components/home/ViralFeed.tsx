import { motion } from 'motion/react';
import { Instagram, Smartphone, Heart, MessageCircle } from 'lucide-react';

const REELS = [
  { id: 1, video: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&q=80&w=600', views: '125K' },
  { id: 2, video: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&q=80&w=600', views: '89K' },
  { id: 3, video: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&q=80&w=600', views: '210K' },
  { id: 4, video: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=600', views: '67K' },
];

export const ViralFeed = () => {
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
          <button className="text-sm font-accent uppercase tracking-widest border-b border-brand-dark/20 pb-2 hover:border-brand-gold transition-colors">
            Síguenos @lumina.studio
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {REELS.map((reel, index) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative aspect-[9/16] rounded-[2rem] overflow-hidden group cursor-pointer"
            >
              <img 
                src={reel.video} 
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                alt="Viral Reel"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent opacity-60" />
              
              <div className="absolute bottom-6 left-6 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-white/90">
                  <Smartphone className="w-4 h-4" />
                  <span className="text-xs font-accent">{reel.views} vistas</span>
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={`heart-indicator-${i}`} className="w-6 h-6 rounded-full border-2 border-white/20 bg-brand-rose" />
                  ))}
                </div>
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
