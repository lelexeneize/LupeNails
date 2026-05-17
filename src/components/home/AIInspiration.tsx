import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, ArrowRight, Loader2, Palette, Calendar, RefreshCw, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';

interface AIInspirationProps {
  onOpenGenerator?: (params: { shape: string; effect: string; art: string; accessory: string; color: string }) => void;
  onBooking?: () => void;
}

interface ParsedDesign {
  shape: string;
  effect: string;
  art?: string;
  accessory?: string;
  prompt?: string;
  name?: string;
}

export const AIInspiration = ({ onOpenGenerator, onBooking }: AIInspirationProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [parsed, setParsed] = useState<ParsedDesign | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string>('');

  const generateImage = async (searchQuery: string, retry = false) => {
    setIsGenerating(true);
    setImageError(false);
    if (!retry) {
      setGeneratedImage(null);
      setParsed(null);
    }

    try {
      // 1. Get structured data + enhanced prompt from Gemini
      let prompt = searchQuery;
      let designData: ParsedDesign = { shape: 'almond', effect: 'Brillante' };

      try {
        const geminiRes = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'inspire', query: searchQuery }),
        });
        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const first = Array.isArray(geminiData) ? geminiData[0] : geminiData;
          if (first?.prompt) {
            prompt = first.prompt;
          }
          designData = {
            shape: first.shape || 'almond',
            effect: first.effect || 'Brillante',
            art: first.art || 'none',
            accessory: first.accessory || 'none',
            prompt: first.prompt || prompt,
            name: first.title || 'Diseño IA',
          };
        }
      } catch {
        // fallback to raw query
      }

      setLastPrompt(prompt);
      setParsed(designData);

      // 2. Generate image with FLUX
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (res.ok) {
        const blob = await res.blob();
        setGeneratedImage(URL.createObjectURL(blob));
      } else {
        setImageError(true);
      }
    } catch {
      setImageError(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    generateImage(query);
  };

  const handleRetry = () => {
    if (lastPrompt) {
      generateImage(lastPrompt, true);
    }
  };

  const handleOpenGenerator = () => {
    if (onOpenGenerator && parsed) {
      onOpenGenerator({
        shape: parsed.shape || 'almond',
        effect: parsed.effect || 'Brillante',
        art: parsed.art || 'none',
        accessory: parsed.accessory || 'none',
        color: 'rose-glaze',
      });
      setIsOpen(false);
    }
  };

  const handleBook = () => {
    if (onBooking) {
      onBooking();
      setIsOpen(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      alert('Debés iniciar sesión para guardar un diseño');
      return;
    }
    if (!generatedImage) return;

    try {
      // Upload blob image to Firebase Storage first
      const blobRes = await fetch(generatedImage);
      const blob = await blobRes.blob();
      const storageRef = ref(storage, `inspirations/${user.uid}/${Date.now()}.png`);
      await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'designs'), {
        title: parsed?.name || `Diseño: ${query}`,
        description: query,
        imageUrl, // Guardamos URL permanente de Storage, no blob temporal
        elements: [parsed?.shape || '', parsed?.effect || ''],
        creatorId: user.uid,
        isPublic: false,
        source: 'ai-inspiration',
        query,
        createdAt: new Date().toISOString()
      });
      alert('¡Diseño guardado en favoritos!');
    } catch {
      alert('Error al guardar');
    }
  };

  return (
    <>
      <div className="fixed bottom-32 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="bg-brand-dark text-brand-nude p-3 rounded-full shadow-xl flex items-center gap-2 transition-all hover:bg-brand-gold hover:text-brand-dark"
        >
          <Sparkles className="w-5 h-5 text-brand-gold animate-pulse" />
          <span className="text-xs font-accent uppercase tracking-widest pr-2">Inspiración con IA</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-brand-nude/95 backdrop-blur-3xl flex flex-col md:items-center md:justify-center"
          >
            {/* Close button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 hover:bg-white/50 rounded-full transition-colors z-50"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-full h-full md:h-auto md:max-w-5xl md:max-h-[90vh] flex flex-col md:flex-row overflow-hidden md:rounded-[3rem] shadow-2xl bg-white">
              
              {/* Left side - Image / Preview */}
              <div className="flex-1 bg-brand-nude relative flex items-center justify-center p-4 md:p-8 min-h-[40vh] md:min-h-0">
                <div className="absolute top-4 left-4 md:top-8 md:left-8">
                  <span className="text-[10px] font-accent uppercase tracking-[0.4em] text-stone-400">
                    {isGenerating ? 'Generando...' : generatedImage ? 'Tu diseño' : 'Inspiración IA'}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="relative">
                        <Loader2 className="w-12 h-12 text-brand-gold animate-spin" />
                        <Sparkles className="absolute inset-0 m-auto w-4 h-4 text-brand-gold animate-pulse" />
                      </div>
                      <p className="text-xs font-accent uppercase tracking-[0.3em] text-brand-dark/50">Creando tu diseño...</p>
                    </motion.div>
                  ) : generatedImage ? (
                    <motion.div
                      key="image"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full max-w-md aspect-[3/4] relative"
                    >
                      {imageError ? (
                        <div className="w-full h-full rounded-[2rem] bg-brand-dark/5 flex flex-col items-center justify-center gap-2">
                          <p className="text-sm text-brand-dark/40">No se pudo generar la imagen</p>
                          <button
                            onClick={handleRetry}
                            className="px-4 py-2 bg-brand-dark text-brand-nude rounded-full text-xs font-accent uppercase tracking-widest"
                          >
                            Reintentar
                          </button>
                        </div>
                      ) : (
                        <>
                          <img
                            src={generatedImage}
                            onError={() => setImageError(true)}
                            alt="Diseño generado"
                            className="w-full h-full object-cover rounded-[2rem] shadow-2xl"
                          />
                          <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/20" />
                        </>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center gap-4 text-center"
                    >
                      <div className="w-24 h-24 bg-brand-dark/5 rounded-full flex items-center justify-center">
                        <Wand2 className="w-10 h-10 text-brand-gold" />
                      </div>
                      <p className="text-sm text-brand-dark/40 font-accent">Describí tu diseño ideal<br/>y la IA lo genera al instante</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right side - Controls */}
              <div className="w-full md:w-[420px] bg-white flex flex-col p-4 md:p-8 overflow-y-auto">
                <h2 className="text-2xl md:text-3xl italic font-display mb-1">Inspiración IA</h2>
                <p className="text-[10px] font-accent uppercase tracking-[0.4em] text-stone-400 mb-6">
                  {generatedImage ? '¿Te gusta? Personalizalo o reservá.' : 'Describí tu idea y generamos el diseño.'}
                </p>

                {/* Search input - always visible */}
                <div className="relative mb-6">
                  <input 
                    type="text"
                    placeholder="Ej: Uñas almendradas con efecto perla..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-brand-nude border border-brand-dark/5 rounded-full px-6 py-4 text-sm font-display focus:outline-none focus:border-brand-gold transition-colors shadow-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button 
                    onClick={handleSearch}
                    disabled={isGenerating || !query.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-dark text-brand-nude p-2.5 rounded-full disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>

                {/* Tags */}
                {parsed && !isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap gap-2 mb-6"
                  >
                    {parsed.shape && (
                      <span className="text-[10px] font-accent uppercase tracking-widest bg-brand-rose/30 px-3 py-1.5 rounded-full">
                        {parsed.shape === 'almond' ? 'Almendra' : parsed.shape === 'coffin' ? 'Coffin' : parsed.shape === 'stiletto' ? 'Stiletto' : 'Cuadrada'}
                      </span>
                    )}
                    <span className="text-[10px] font-accent uppercase tracking-widest bg-brand-gold/20 px-3 py-1.5 rounded-full">
                      {parsed.effect}
                    </span>
                    {parsed.art && parsed.art !== 'none' && (
                      <span className="text-[10px] font-accent uppercase tracking-widest bg-brand-rose/30 px-3 py-1.5 rounded-full">
                        {parsed.art === 'minimal' ? 'Minimalista' : parsed.art === 'marble' ? 'Mármol' : parsed.art === 'floral' ? 'Flores' : 'Francesa'}
                      </span>
                    )}
                  </motion.div>
                )}

                {/* Action buttons */}
                {generatedImage && !isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <button
                      onClick={handleOpenGenerator}
                      className="w-full py-4 rounded-2xl bg-brand-dark text-brand-nude text-xs font-accent uppercase tracking-widest hover:bg-brand-gold transition-all flex items-center justify-center gap-2"
                    >
                      <Palette className="w-4 h-4" />
                      Personalizar en Studio
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleBook}
                        className="py-3 rounded-2xl border border-brand-dark/10 text-xs font-accent uppercase tracking-widest hover:bg-brand-rose/10 transition-colors flex items-center justify-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        Reservar
                      </button>
                      <button
                        onClick={handleSave}
                        className="py-3 rounded-2xl border border-brand-dark/10 text-xs font-accent uppercase tracking-widest hover:bg-brand-rose/10 transition-colors flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Guardar
                      </button>
                    </div>

                    <button
                      onClick={handleRetry}
                      className="w-full py-3 rounded-2xl text-xs font-accent uppercase tracking-widest text-stone-400 hover:text-brand-dark transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Generar otra variante
                    </button>
                  </motion.div>
                )}

                {/* Suggested tags when no result */}
                {!generatedImage && !isGenerating && (
                  <div className="flex flex-wrap gap-2">
                    {['Clean Girl', 'Aura Nails', 'Coquette Style', 'Efecto Perla'].map(tag => (
                      <button 
                        key={tag}
                        onClick={() => { setQuery(tag); }}
                        className="px-4 py-2 bg-brand-nude border border-brand-dark/5 rounded-full text-[10px] font-accent uppercase tracking-widest hover:border-brand-gold transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
