import { motion, AnimatePresence } from 'motion/react';
import { Home, Grid, Calendar, Settings, Heart, MessageCircle, User as UserIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../services/authContext.tsx';

export const Header = ({ onDashboardClick }: { onDashboardClick: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, login } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 ${
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <span className="font-display text-2xl italic tracking-tighter font-bold text-brand-dark">
            LUPE <span className="text-brand-gold font-normal not-italic">Nails</span>
          </span>
        </motion.div>

        <nav className="hidden md:flex items-center gap-10 text-[11px] font-accent uppercase tracking-[0.2em]">
          <a href="#designs" className="hover:text-brand-rose transition-colors">Diseños</a>
          <a href="#servicios" className="hover:text-brand-rose transition-colors">Servicios</a>
          <a href="#booking" className="hover:text-brand-rose transition-colors">Reservar</a>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <button 
              onClick={onDashboardClick}
              className="flex items-center gap-3 p-1 pr-4 bg-white border border-brand-border/20 rounded-full hover:shadow-md transition-shadow"
            >
              <img src={user.photoURL || ''} className="w-8 h-8 rounded-full" alt="" />
              <span className="text-[10px] font-accent uppercase tracking-widest font-bold">Perfil</span>
            </button>
          ) : (
            <button 
              onClick={login}
              className="hidden md:flex items-center gap-2 h-10 px-6 border border-brand-dark/10 rounded-full text-[10px] font-accent uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-all"
            >
              <UserIcon className="w-3 h-3" /> Log In
            </button>
          )}
          <button className="hidden md:block bg-brand-dark text-brand-nude px-6 py-2 rounded-full text-xs font-accent uppercase tracking-widest hover:bg-brand-gold transition-all duration-500">
            Reservar Turno
          </button>
        </div>
      </div>
    </header>
  );
};

export const BottomNav = ({ onDashboardClick }: { onDashboardClick: () => void }) => {
  const { user, login } = useAuth();
  
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden w-[90%] max-w-sm">
      <div className="glass-panel rounded-full px-6 py-4 flex items-center justify-between shadow-2xl">
        <NavIcon icon={Home} active />
        <NavIcon icon={Grid} />
        <div className="relative -top-8 px-4">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-brand-dark p-4 rounded-full shadow-xl shadow-brand-dark/20 text-brand-nude"
          >
            <Calendar className="w-6 h-6" />
          </motion.button>
        </div>
        <NavIcon icon={Heart} />
        {user ? (
          <button onClick={onDashboardClick} className="p-2 text-brand-dark/40">
            <UserIcon className="w-5 h-5" />
          </button>
        ) : (
          <button onClick={login} className="p-2 text-brand-dark/40">
            <Settings className="w-5 h-5" />
          </button>
        )}
      </div>
    </nav>
  );
};

const NavIcon = ({ icon: Icon, active = false }) => (
  <button className={`p-2 transition-colors ${active ? 'text-brand-gold' : 'text-brand-dark/40'}`}>
    <Icon className="w-5 h-5" />
  </button>
);

export const FloatingWhatsApp = () => (
  <motion.a
    href="https://wa.me/your-number"
    target="_blank"
    rel="noreferrer"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    whileHover={{ scale: 1.1 }}
    className="fixed bottom-24 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg shadow-green-500/20"
  >
    <MessageCircle className="w-6 h-6 fill-current" />
  </motion.a>
);
