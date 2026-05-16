import { useState } from 'react';
import { Instagram, Twitter, Mail, MapPin, Phone, Shield, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../services/authContext';

export const Footer = ({ onAdminClick }: { onAdminClick: () => void }) => {
  const { user, isAdmin, refreshAdminStatus } = useAuth();
  const [showSetup, setShowSetup] = useState(false);
  const [setupState, setSetupState] = useState<'idle' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);

  const handleAdminClick = () => {
    if (isAdmin) {
      onAdminClick();
    } else if (user) {
      setShowSetup(true);
      setSetupState('idle');
    }
  };

  const handleSetupAdmin = async () => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'admins', user.uid), {
        uid: user.uid,
        email: user.email,
        addedAt: new Date().toISOString()
      });
      setSetupState('success');
      setTimeout(() => {
        setShowSetup(false);
        refreshAdminStatus();
      }, 1500);
    } catch (err) {
      console.error('Error activando admin:', err);
      setSetupState('error');
    }
  };

  const handleCopyUid = () => {
    if (!user) return;
    navigator.clipboard.writeText(user.uid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <AnimatePresence>
        {showSetup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-brand-dark/20 backdrop-blur-2xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-brand-nude w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative"
            >
              <button onClick={() => setShowSetup(false)} className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              {setupState === 'idle' && (
                <>
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-brand-dark rounded-3xl">
                      <Shield className="w-10 h-10 text-brand-gold" />
                    </div>
                  </div>
                  <h2 className="text-2xl italic font-display text-center mb-2">Acceso Admin</h2>
                  <p className="text-xs font-accent text-brand-dark/40 uppercase tracking-widest text-center mb-8">
                    {user?.email}
                  </p>
                  <p className="text-sm font-accent text-brand-dark/60 mb-8 text-center leading-relaxed">
                    ¿Querés activar tu cuenta como administradora de Lupe Nails Studio? Vas a poder crear cupones, gestionar turnos y subir diseños.
                  </p>
                  <button
                    onClick={handleSetupAdmin}
                    className="w-full premium-button bg-brand-dark text-brand-nude mb-4"
                  >
                    Activar Admin
                  </button>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-brand-dark/10" />
                    <span className="text-[10px] font-accent text-brand-dark/30">o hacerlo manual</span>
                    <div className="flex-1 h-px bg-brand-dark/10" />
                  </div>
                  <div className="bg-white rounded-2xl p-4 border border-brand-dark/5">
                    <p className="text-[10px] font-accent uppercase tracking-widest text-brand-dark/40 mb-2">Tu ID de usuario</p>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-[11px] font-mono text-brand-dark/60 truncate">{user?.uid}</code>
                      <button onClick={handleCopyUid} className="p-2 hover:bg-brand-dark/5 rounded-xl shrink-0 transition-colors">
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-brand-dark/40" />}
                      </button>
                    </div>
                    <p className="text-[10px] font-accent text-brand-dark/30 mt-2">
                      Copiá este ID y agregalo en Firebase Console → Firestore → colección "admins"
                    </p>
                  </div>
                </>
              )}

              {setupState === 'success' && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-2xl italic font-display mb-2">¡Admin Activado!</h2>
                  <p className="text-sm text-brand-dark/60">Redirigiendo al panel...</p>
                </div>
              )}

              {setupState === 'error' && (
                <div className="text-center py-8">
                  <p className="text-sm text-red-500 mb-4">Error al activar. ¿Querés probar de nuevo o hacerlo manual?</p>
                  <button onClick={handleSetupAdmin} className="premium-button bg-brand-dark text-brand-nude mb-3 w-full">Reintentar</button>
                  <button onClick={() => { setCopied(false); navigator.clipboard.writeText(user?.uid || ''); setCopied(true); }} className="text-xs font-accent underline text-brand-dark/40">Copiar mi ID</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-brand-dark text-brand-nude/80 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-white text-3xl font-display mb-6 tracking-widest">LUPE NAILS</h2>
              <p className="max-w-sm text-brand-nude/60 mb-8 leading-relaxed font-sans">
                Elevamos la experiencia de manicuría a un nivel de arte. 
                Minimalismo, tendencia y lujo en cada detalle.
              </p>
              <div className="flex items-center gap-6">
                <Instagram className="w-6 h-6 cursor-pointer hover:text-brand-gold transition-colors" />
                <Twitter className="w-6 h-6 cursor-pointer hover:text-brand-gold transition-colors" />
                <Mail className="w-6 h-6 cursor-pointer hover:text-brand-gold transition-colors" />
              </div>
            </div>

            <div>
              <h4 className="text-white font-accent text-sm uppercase tracking-widest mb-6">Explorar</h4>
              <ul className="flex flex-col gap-4 text-sm font-accent">
                <li className="hover:text-white cursor-pointer transition-colors">Diseños</li>
                <li className="hover:text-white cursor-pointer transition-colors">Servicios</li>
                <li className="hover:text-white cursor-pointer transition-colors">Nuestros Artistas</li>
                <li className="hover:text-white cursor-pointer transition-colors">Ubicación</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-accent text-sm uppercase tracking-widest mb-6">Contacto</h4>
              <ul className="flex flex-col gap-4 text-sm font-accent">
                <li className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-brand-gold" />
                  <span>Palermo, Buenos Aires</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-brand-gold" />
                  <span>+54 11 2345 6789</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-brand-gold" />
                  <span className="hover:opacity-100 cursor-pointer transition-opacity">hola@lupe.nails</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs font-accent uppercase tracking-widest opacity-40">
              © 2026 LUPE NAILS STUDIO. TODOS LOS DERECHOS RESERVADOS.
            </p>
            <div className="flex items-center gap-8 text-[10px] uppercase tracking-widest opacity-40">
              <span onClick={handleAdminClick} className="hover:opacity-100 cursor-pointer transition-opacity">
                {isAdmin ? 'Admin Panel' : user ? 'Activar Admin' : 'Admin Panel'}
              </span>
              <span className="hover:opacity-100 cursor-pointer transition-opacity">Privacy Policy</span>
              <span className="hover:opacity-100 cursor-pointer transition-opacity">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
