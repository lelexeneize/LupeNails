/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { Header, BottomNav, FloatingWhatsApp } from './components/layout/Navigation';
import { Hero } from './components/home/Hero';
import { Services } from './components/home/Services';
import { Gallery } from './components/gallery/Gallery';
import { ViralFeed } from './components/home/ViralFeed';
import { Footer } from './components/layout/Footer';
import { AIInspiration } from './components/home/AIInspiration';
import { BookingModal } from './components/booking/BookingModal';
import { NailGenerator } from './components/home/NailGenerator';
import { AdminDashboard } from './components/AdminDashboard';
import { ClientDashboard } from './components/dashboard/ClientDashboard';
import { useAuth } from './services/authContext';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [view, setView] = useState<'user' | 'admin'>('user');
  const { isAdmin } = useAuth();

  const toggleView = () => {
    if (isAdmin) {
      setView(view === 'user' ? 'admin' : 'user');
    }
  };

  if (view === 'admin') {
    return (
      <>
        <AdminDashboard />
        <button 
          onClick={() => setView('user')}
          className="fixed bottom-8 right-8 z-[200] premium-button bg-brand-dark text-brand-nude"
        >
          Volver a la Web
        </button>
      </>
    );
  }

  return (
    <div className="min-h-screen selection:bg-brand-gold/20 scroll-smooth">
      <Header onDashboardClick={() => setIsDashboardOpen(true)} />
      
      <main>
        <Hero onBookingClick={() => setIsBookingOpen(true)} />
        
        <div id="booking-marquee" className="py-16 bg-brand-dark overflow-hidden whitespace-nowrap border-y border-white/5">
          <div className="flex animate-marquee gap-12">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <span key={`marquee-${i}`} className="text-white/5 text-8xl font-display italic tracking-tighter uppercase">
                Uñas de Ensueño • Experiencia Premium • Reservar Ahora • Viral Style • 
              </span>
            ))}
          </div>
        </div>

        {/* New Generator CTA Section */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 bg-white rounded-[4rem] p-12 md:p-24 shadow-sm border border-brand-dark/5">
            <div className="flex-1">
              <span className="text-brand-gold text-[10px] uppercase font-accent tracking-[0.4em] mb-4 block">Experimental Studio</span>
              <h2 className="text-5xl md:text-6xl mb-8 leading-tight">Virtual Nail <br /> <span className="italic font-display">Generator</span></h2>
              <p className="text-brand-dark/60 text-lg mb-12 max-w-md">
                ¿No sabes qué diseño elegir? Crea tu propio concepto en nuestro laboratorio 3D y envíanoslo directamente al reservar.
              </p>
              <button 
                onClick={() => setIsGeneratorOpen(true)}
                className="premium-button bg-brand-dark text-brand-nude flex items-center gap-3 group"
              >
                Abrir Generador <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
            <div className="flex-1 relative flex justify-center">
              <div className="w-64 h-96 bg-brand-nude rounded-[3rem] border-8 border-brand-dark/5 animate-float flex items-center justify-center overflow-hidden">
                <div className="w-32 h-64 bg-brand-rose rounded-t-full shadow-2xl relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent" />
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 glass-panel p-6 rounded-3xl shadow-xl">
                <p className="text-xs font-accent mb-2">Popular Match</p>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => <div key={`dot-${i}`} className="w-6 h-6 rounded-full bg-brand-rose border border-brand-dark/5" />)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <Services onBookingClick={() => setIsBookingOpen(true)} />
        <Gallery />
        <ViralFeed />
        
        {/* Reservation Section */}
        <section id="booking" className="py-32 px-6 bg-brand-nude relative overflow-hidden border-t border-brand-border/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 blur-[120px] rounded-full" />
          
          <div className="max-w-5xl mx-auto glass-panel p-20 md:p-32 rounded-[5rem] text-center relative z-10 border-brand-border/30 shadow-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[10px] font-accent uppercase tracking-[0.5em] text-stone-400 mb-8">Disponibilidad Limitada</p>
              <h2 className="text-6xl md:text-8xl mb-12 leading-[0.85] tracking-tighter">Lista de <br /> <span className="italic font-light text-brand-gold">Espera</span></h2>
              <p className="text-xl text-stone-500 mb-16 max-w-lg mx-auto leading-relaxed">
                Nuestros turnos se agotan en horas. Asegura tu lugar hoy mismo y vive la experiencia que todas quieren subir a sus historias.
              </p>
              <button 
                onClick={() => setIsBookingOpen(true)}
                className="premium-button bg-brand-dark text-white shadow-2xl hover:bg-brand-rose transition-all h-24 px-16 text-xl tracking-[0.1em]"
              >
                Consultar Disponibilidad
              </button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer onAdminClick={toggleView} />
      <BottomNav onDashboardClick={() => setIsDashboardOpen(true)} />
      <FloatingWhatsApp />
      <AIInspiration />
      
      <ClientDashboard isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} />
      
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <NailGenerator 
        isOpen={isGeneratorOpen} 
        onClose={() => setIsGeneratorOpen(false)} 
        onFinish={(design) => {
          setIsGeneratorOpen(false);
          setIsBookingOpen(true);
          console.log('Design finished:', design);
        }} 
      />
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
