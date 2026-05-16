import { motion } from 'motion/react';
import { ArrowRight, Star, TrendingUp, Users, Clock } from 'lucide-react';

export const Hero = ({ onBookingClick }: { onBookingClick: () => void }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20 px-6 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-rose/20 -z-10 rounded-l-[100px] blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-brand-champagne/30 -z-10 rounded-r-full blur-3xl opacity-30" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 border border-brand-rose text-xs font-accent uppercase tracking-widest text-brand-dark/70 mb-8">
            <Star className="w-3 h-3 fill-brand-gold text-brand-gold" />
            Pinterest Viral Designs 2026
          </div>
          
          <h1 className="text-[70px] md:text-[110px] font-display leading-[0.85] tracking-tighter mb-8">
            Tus uñas <br />
            <span className="text-brand-gold italic font-light">hablan</span> <br />
            por vos.
          </h1>
          
          <p className="text-lg text-brand-dark/60 max-w-md mb-10 font-sans leading-relaxed">
            Convertimos ideas virales en arte. Experiencia premium de manicuría 
            con una estética minimalista y lujosa diseñada para inspirarte.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBookingClick}
              className="premium-button bg-brand-dark text-brand-nude w-full sm:w-auto shadow-2xl shadow-brand-dark/20 flex items-center justify-center gap-2"
            >
              Reservar Turno <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('designs')?.scrollIntoView({ behavior: 'smooth' })}
              className="premium-button border border-brand-dark/10 w-full sm:w-auto hover:bg-white transition-colors"
            >
              Ver Diseños
            </motion.button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8">
            <StatItem icon={Users} label="Clientas" value="5K+" />
            <StatItem icon={Star} label="Rating" value="4.9/5" />
            <StatItem icon={Clock} label="Wait list" value="2d" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative aspect-square md:aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl"
        >
          <img 
            src="https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&q=80&w=1200" 
            alt="Premium Nail Art" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent" />
          
          <div className="absolute bottom-8 left-8 right-8">
            <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-brand-dark/50 mb-1">Trending now</p>
                <p className="font-display text-xl">Chrome Pearl Glaze</p>
              </div>
              <TrendingUp className="text-brand-gold w-6 h-6" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const StatItem = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2 text-brand-dark/40">
      <Icon className="w-3 h-3" />
      <span className="text-[10px] uppercase tracking-widest leading-none">{label}</span>
    </div>
    <span className="font-accent text-xl font-semibold">{value}</span>
  </div>
);
