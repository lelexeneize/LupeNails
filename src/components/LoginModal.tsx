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
      const msg = err?.code?.replace('auth/', '') || 'Error al iniciar sesión';
      setError(msg === 'invalid-credential' ? 'Email o contraseña incorrectos' : msg === 'email-already-in-use' ? 'Ya hay una cuenta con ese email' : msg === 'weak-password' ? 'La contraseña debe tener al menos 6 caracteres' : 'Error, intentá de nuevo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await login();
      onClose();
    } catch {
      setError('Error al iniciar con Google');
    }
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
          className="bg-brand-nude w-full max-w-md rounded-[3rem] p-12 shadow-2xl relative"
        >
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-brand-dark rounded-2xl">
                <Sparkles className="w-8 h-8 text-brand-gold" />
              </div>
            </div>
            <h2 className="text-3xl italic font-display mb-2">
              {mode === 'login' ? 'Bienvenida de vuelta' : 'Creá tu cuenta'}
            </h2>
            <p className="text-xs font-accent text-brand-dark/40 uppercase tracking-widest">
              {mode === 'login' ? 'Iniciá sesión en Lupe Nails' : 'Unite al mundo Lupe Nails'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 font-accent text-center">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            className="w-full p-4 rounded-2xl border border-brand-dark/10 bg-white flex items-center justify-center gap-3 hover:border-brand-gold transition-all mb-6"
          >
            <GoogleIcon className="w-5 h-5" />
            <span className="text-xs font-accent font-bold tracking-widest uppercase">
              {mode === 'login' ? 'Iniciar con Google' : 'Registrarse con Google'}
            </span>
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-brand-dark/10" />
            <span className="text-[10px] font-accent uppercase tracking-widest text-brand-dark/30">o con email</span>
            <div className="flex-1 h-px bg-brand-dark/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Contraseña"
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
              className="w-full premium-button bg-brand-dark text-brand-nude disabled:opacity-40"
            >
              {isSubmitting ? 'Un momento...' : mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="text-[11px] font-accent uppercase tracking-widest text-brand-dark/40 hover:text-brand-gold transition-colors"
            >
              {mode === 'login' ? '¿No tenés cuenta? Registrate' : '¿Ya tenés cuenta? Iniciá sesión'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
