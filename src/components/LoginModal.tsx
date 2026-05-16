import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { X, Mail, Lock, User, ChromeIcon as GoogleIcon, Sparkles } from 'lucide-react';
import { useAuth } from '../services/authContext';

export const LoginModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { login, register, loginWithEmail } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (mode === 'register') {
        await register(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
      onClose();
    } catch (err: any) {
      const code = err?.code?.replace('auth/', '') || '';
      const messages: Record<string, string> = {
        'invalid-credential': 'Email o contraseña incorrectos',
        'email-already-in-use': 'Ya hay una cuenta con ese email',
        'weak-password': 'La contraseña debe tener al menos 6 caracteres',
        'user-not-found': 'No hay cuenta con ese email',
        'wrong-password': 'Contraseña incorrecta',
        'too-many-requests': 'Demasiados intentos. Esperá un momento',
      };
      setError(messages[code] || 'Error, intentá de nuevo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await login();
      onClose();
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/unauthorized-domain' || code === 'auth/operation-not-allowed') {
        setError('El inicio con Google no está habilitado para este dominio. Mientras, podés registrarte con email y contraseña.');
      } else if (code === 'auth/popup-blocked' || code === 'auth/popup-closed-by-user') {
        setError('El popup fue bloqueado. Permití popups para este sitio o usá email y contraseña.');
      } else {
        setError('Error al iniciar con Google. Probá con email y contraseña.');
      }
    }
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] bg-brand-dark/20 backdrop-blur-2xl flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-brand-nude w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative"
        >
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>

          {/* Tabs */}
          <div className="flex bg-white rounded-2xl p-1.5 mb-8 border border-brand-dark/5">
            <button
              onClick={() => switchMode('login')}
              className={`flex-1 py-3 rounded-xl text-xs font-accent uppercase tracking-widest font-bold transition-all ${
                mode === 'login' ? 'bg-brand-dark text-white shadow-sm' : 'text-brand-dark/40 hover:text-brand-dark'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => switchMode('register')}
              className={`flex-1 py-3 rounded-xl text-xs font-accent uppercase tracking-widest font-bold transition-all ${
                mode === 'register' ? 'bg-brand-dark text-white shadow-sm' : 'text-brand-dark/40 hover:text-brand-dark'
              }`}
            >
              Registrarse
            </button>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl italic font-display mb-1">
              {mode === 'login' ? 'Bienvenida de vuelta' : 'Creá tu cuenta'}
            </h2>
            <p className="text-[11px] font-accent text-brand-dark/40 uppercase tracking-widest">
              {mode === 'login' ? 'Iniciá sesión en Lupe Nails' : 'Unite al mundo Lupe Nails'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 font-accent text-center leading-relaxed">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            className="w-full p-4 rounded-2xl border border-brand-dark/10 bg-white flex items-center justify-center gap-3 hover:border-brand-gold transition-all mb-6 group"
          >
            <GoogleIcon className="w-5 h-5" />
            <span className="text-xs font-accent font-bold tracking-widest uppercase group-hover:text-brand-dark">
              {mode === 'login' ? 'Google' : 'Google'}
            </span>
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-brand-dark/10" />
            <span className="text-[10px] font-accent uppercase tracking-widest text-brand-dark/30">o con email</span>
            <div className="flex-1 h-px bg-brand-dark/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/30" />
                <input
                  type="text"
                  placeholder="Nombre"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full bg-white border border-brand-dark/5 rounded-2xl px-12 py-4 text-sm font-accent focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/30" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-white border border-brand-dark/5 rounded-2xl px-12 py-4 text-sm font-accent focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/30" />
              <input
                type="password"
                placeholder="Contraseña (mín. 6 caracteres)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-white border border-brand-dark/5 rounded-2xl px-12 py-4 text-sm font-accent focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full premium-button bg-brand-dark text-brand-nude disabled:opacity-40 mt-2"
            >
              {isSubmitting ? 'Un momento...' : mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta Gratis'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
