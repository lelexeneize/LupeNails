import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Sparkles, Check, ChevronRight, X, Play, Palette, Layout, MousePointer2, Loader2, Heart, Calendar, Share2, Download } from 'lucide-react';
import { geminiService } from '../../services/geminiService';
import { useAuth } from '../../services/authContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const SHAPES = [
  { id: 'almond', name: 'Almendra', image: 'https://images.unsplash.com/photo-1604243708230-058f96791986?q=80&w=300' },
  { id: 'coffin', name: 'Coffin', image: 'https://images.unsplash.com/photo-1632345031435-08207908c6ba?q=80&w=300' },
  { id: 'stiletto', name: 'Stiletto', image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=300' },
  { id: 'square', name: 'Cuadrada', image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=300' },
];

const COLORS = [
  // Nudes & Whites
  { id: 'nude-silk', name: 'Seda Nude', hex: '#F3E5D8', category: 'Nudes' },
  { id: 'milky-white', name: 'Blanco Milky', hex: '#FFFFFF', category: 'Nudes' },
  { id: 'latte', name: 'Latte', hex: '#D2B48C', category: 'Nudes' },
  { id: 'sand-dune', name: 'Sand Dune', hex: '#C2B280', category: 'Nudes' },
  { id: 'vanilla', name: 'Vanilla', hex: '#F3E5AB', category: 'Nudes' },
  
  // Pinks & Roses
  { id: 'rose-glaze', name: 'Rosa Glaze', hex: '#FDE2E4', category: 'Pinks' },
  { id: 'peachy-pink', name: 'Peachy Pink', hex: '#FFCBBE', category: 'Pinks' },
  { id: 'bubblegum', name: 'Bubblegum', hex: '#FFADED', category: 'Pinks' },
  { id: 'hot-pink', name: 'Hot Pink', hex: '#FF69B4', category: 'Pinks' },
  { id: 'mauve', name: 'Mauve', hex: '#E0B0FF', category: 'Pinks' },
  
  // Reds & Berries
  { id: 'classic-red', name: 'Rojo Clásico', hex: '#B22222', category: 'Reds' },
  { id: 'velvet-ruby', name: 'Velvet Ruby', hex: '#8B0000', category: 'Reds' },
  { id: 'wine-cellar', name: 'Cava Wine', hex: '#4E0707', category: 'Reds' },
  { id: 'crimson', name: 'Carmesí', hex: '#DC143C', category: 'Reds' },
  { id: 'coral', name: 'Coral', hex: '#FF7F50', category: 'Reds' },
  
  // Cool & Earthy
  { id: 'midnight-blue', name: 'Midnight', hex: '#191970', category: 'Cool' },
  { id: 'sage-green', name: 'Verde Sage', hex: '#8FBC8F', category: 'Cool' },
  { id: 'sky-high', name: 'Sky High', hex: '#87CEEB', category: 'Cool' },
  { id: 'emerald', name: 'Emerald', hex: '#50C878', category: 'Cool' },
  { id: 'lavender', name: 'Lavender', hex: '#E6E6FA', category: 'Cool' },
  
  // Dark & Deep
  { id: 'onyx', name: 'Onyx', hex: '#000000', category: 'Deep' },
  { id: 'deep-espresso', name: 'Espresso', hex: '#3E2723', category: 'Deep' },
  { id: 'charcoal', name: 'Charcoal', hex: '#333333', category: 'Deep' },
  { id: 'plum', name: 'Plum', hex: '#8E4585', category: 'Deep' },
  
  // Neons
  { id: 'neon-lime', name: 'Neon Lime', hex: '#32CD32', category: 'Neon' },
  { id: 'electric-blue', name: 'Electro Blue', hex: '#00FFFF', category: 'Neon' },
  { id: 'sun-yellow', name: 'Sun Yellow', hex: '#FFFF00', category: 'Neon' },
];

const EFFECTS = ['Brillante', 'Mate', 'Chrome', 'Glazed', 'Glitter'];

const ART_STYLES = [
  { id: 'none', name: 'Sin Arte', icon: X },
  { id: 'minimal', name: 'Minimalista', icon: MousePointer2 },
  { id: 'marble', name: 'Efecto Mármol', icon: Palette },
  { id: 'floral', name: 'Flores Manuales', icon: Sparkles },
  { id: 'french', name: 'Francesa Moderna', icon: Layout },
];

const ACCESSORIES = [
  { id: 'none', name: 'Sin Accesorios', icon: X },
  { id: 'pearls', name: 'Perlas Micro', icon: Sparkles },
  { id: 'crystals', name: 'Cristales Swarovski', icon: Sparkles },
  { id: 'gold-flakes', name: 'Hojas de Oro', icon: Sparkles },
];

export const NailGenerator = ({ isOpen, onClose, onFinish }: { isOpen: boolean, onClose: () => void, onFinish: (design: any) => void }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<{ name: string, description: string } | null>(null);
  const [design, setDesign] = useState({
    shape: 'almond',
    color: 'rose-glaze',
    effect: 'Brillante',
    art: 'none',
    accessory: 'none'
  });

  const handleNext = () => setStep(s => s + 1);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStep(5);
    
    try {
      const result = await geminiService.generateNailStudioResult(design);
      setAiResult(result);
      setTimeout(() => {
        setIsGenerating(false);
        setStep(6);
      }, 2500);
    } catch (error) {
      console.error(error);
      setIsGenerating(false);
      setStep(6);
    }
  };

  const handleSave = async () => {
    if (!user) return alert('Debes iniciar sesión para guardar tu diseño');
    try {
      // Use different placeholders based on design
      let imageUrl = 'https://images.unsplash.com/photo-1604243708230-058f96791986?q=80&w=600&auto=format&fit=crop';
      if (design.art !== 'none') imageUrl = 'https://images.unsplash.com/photo-1627289901140-025586676fd3?q=80&w=600';
      if (design.effect === 'Chrome') imageUrl = 'https://images.unsplash.com/photo-1610651165403-1498e916329c?q=80&w=600';

      await addDoc(collection(db, 'designs'), {
        ...design,
        ...aiResult,
        imageUrl,
        creatorId: user.uid,
        isPublic: false,
        createdAt: new Date().toISOString()
      });
      alert('¡Diseño guardado en tu perfil!');
    } catch (e) {
      alert('Error al guardar');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-brand-dark/20 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12"
      >
        <motion.div 
          initial={{ y: 50, scale: 0.95 }}
          animate={{ y: 0, scale: 1 }}
          className="bg-brand-nude w-full max-w-6xl h-full md:h-[85vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
        >
          <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-white/50 hover:bg-white rounded-full transition-colors z-50">
            <X className="w-5 h-5" />
          </button>

          {/* Preview Panel */}
          <div className="flex-1 bg-white relative p-12 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-brand-dark/5">
            <div className="absolute top-12 left-12">
              <span className="text-[10px] font-accent uppercase tracking-[0.4em] text-stone-400">
                {step === 6 ? 'Diseño Final' : 'Vista Previa'}
              </span>
              <h2 className="text-4xl italic font-display">{aiResult?.name || 'Tu creación'}</h2>
            </div>

            <motion.div 
              key={JSON.stringify(design) + step}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-sm aspect-[4/5] flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-brand-rose/10 blur-[100px] rounded-full" />
              
              {step === 5 ? (
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <Loader2 className="w-16 h-16 text-brand-gold animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-brand-gold animate-pulse" />
                  </div>
                  <p className="text-sm font-accent uppercase tracking-[0.3em] text-brand-dark animate-pulse">Revelando tu estilo...</p>
                </div>
              ) : step === 6 ? (
                <motion.div 
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 0 }}
                  transition={{ duration: 1, type: 'spring' }}
                  className="relative group"
                >
                  <img 
                    src={`https://images.unsplash.com/photo-1604243708230-058f96791986?q=80&w=600&auto=format&fit=crop`} 
                    className="w-72 h-[450px] object-cover rounded-[3rem] shadow-2xl skew-y-2 group-hover:skew-y-0 transition-transform duration-700" 
                    alt="Final result"
                  />
                  <div className="absolute inset-0 rounded-[3rem] ring-1 ring-inset ring-white/20" />
                  <div className="absolute -right-8 bottom-12">
                    <div className="bg-brand-dark text-white p-6 rounded-3xl shadow-xl max-w-[200px]">
                      <Sparkles className="w-6 h-6 text-brand-gold mb-3" />
                      <p className="text-xs italic leading-relaxed">{aiResult?.description}</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="relative z-10 w-32 h-64 bg-white rounded-t-full rounded-b-xl border-4 border-brand-nude shadow-2xl overflow-hidden transition-all duration-500"
                  style={{ 
                    backgroundColor: COLORS.find(c => c.id === design.color)?.hex || (design.color.startsWith('#') ? design.color : '#FFFFFF'),
                    borderRadius: design.shape === 'stiletto' ? '200px 200px 40px 40px' : '80px 80px 40px 40px',
                    boxShadow: design.effect === 'Glossy' ? 'inset -10px -10px 40px rgba(255,255,255,0.4), 0 20px 40px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  {design.effect === 'Chrome' && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent animate-shimmer" />
                  )}
                  {design.effect === 'Glazed' && (
                    <div className="absolute inset-0 opacity-40 bg-gradient-to-b from-white via-transparent to-white/20" />
                  )}
                </div>
              )}

              {step < 5 && (
                <div className="absolute -right-12 top-1/4 space-y-2">
                  <Badge text={design.shape} icon={Layout} />
                  <Badge text={design.effect} icon={Sparkles} />
                  {design.art !== 'none' && <Badge text={ART_STYLES.find(a => a.id === design.art)?.name || ''} icon={Palette} />}
                  {design.accessory !== 'none' && <Badge text={ACCESSORIES.find(a => a.id === design.accessory)?.name || ''} icon={Sparkles} />}
                </div>
              )}
            </motion.div>

            <div className="mt-12 text-center">
              <p className="text-xs font-accent text-brand-dark/40 italic">“Un diseño que parece sacado de Pinterest”</p>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="w-full md:w-[400px] bg-brand-nude flex flex-col p-8 md:p-12 overflow-y-auto">
            <div className="mb-12">
              <div className="flex gap-2 mb-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={`step-dot-${i}`} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-brand-dark' : 'bg-brand-dark/10'}`} />
                ))}
              </div>
              <h3 className="text-4xl mb-2 italic font-display">Studio Lab</h3>
              <p className="text-[10px] font-accent uppercase tracking-[0.4em] text-stone-400">Paso {step <= 4 ? step : 4} de 4</p>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h4 className="text-lg font-accent font-medium mb-6">Elige la forma base</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {SHAPES.map(s => (
                      <button 
                        key={s.id}
                        onClick={() => setDesign({ ...design, shape: s.id })}
                        className={`p-4 rounded-3xl border transition-all ${
                          design.shape === s.id ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white border-brand-dark/5 hover:border-brand-gold'
                        }`}
                      >
                        <div className="aspect-square bg-brand-nude rounded-2xl mb-3 overflow-hidden">
                          <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-accent uppercase tracking-widest">{s.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h4 className="text-lg font-accent font-medium mb-6">Color & Efecto</h4>
                  
                  <div className="flex justify-between items-end mb-4">
                    <p className="text-[10px] font-accent uppercase tracking-widest text-brand-dark/40">Gama de Colores</p>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-accent uppercase tracking-widest text-brand-dark/40">Personalizado</span>
                       <input 
                        type="color" 
                        value={COLORS.find(c => c.id === design.color)?.hex || design.color}
                        onChange={(e) => setDesign({ ...design, color: e.target.value })}
                        className="w-6 h-6 rounded-full border-none cursor-pointer bg-transparent"
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-3 mb-8 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                    {COLORS.map(c => (
                      <button 
                        key={c.id}
                        onClick={() => setDesign({ ...design, color: c.id })}
                        title={c.name}
                        className={`group relative p-1 rounded-full border-2 transition-all ${
                          design.color === c.id ? 'border-brand-dark' : 'border-transparent hover:border-brand-gold'
                        }`}
                      >
                        <div className="w-full aspect-square rounded-full shadow-inner" style={{ backgroundColor: c.hex }} />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-dark text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {c.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  <p className="text-[10px] font-accent uppercase tracking-widest text-brand-dark/40 mb-4">Efecto Final</p>
                  <div className="flex flex-wrap gap-2">
                    {EFFECTS.map(e => (
                      <button 
                        key={e}
                        onClick={() => setDesign({ ...design, effect: e })}
                        className={`px-4 py-2 rounded-full text-xs font-accent border transition-all ${
                          design.effect === e ? 'bg-brand-dark text-white' : 'bg-white border-brand-dark/5'
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h4 className="text-lg font-accent font-medium mb-6">Arte Manual</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {ART_STYLES.map(art => (
                      <button 
                        key={art.id}
                        onClick={() => setDesign({...design, art: art.id})}
                        className={`p-5 rounded-2xl border flex items-center justify-between transition-all ${
                          design.art === art.id ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-dark/5 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${design.art === art.id ? 'bg-brand-gold text-brand-dark' : 'bg-stone-50 text-stone-300'}`}>
                            <art.icon className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-accent uppercase tracking-widest font-bold">{art.name}</span>
                        </div>
                        {design.art === art.id && <Check className="w-4 h-4 text-brand-gold" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h4 className="text-lg font-accent font-medium mb-6">Accesorios & Pedrería</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {ACCESSORIES.map(acc => (
                      <button 
                        key={acc.id}
                        onClick={() => setDesign({...design, accessory: acc.id})}
                        className={`p-5 rounded-2xl border flex items-center justify-between transition-all ${
                          design.accessory === acc.id ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-dark/5 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${design.accessory === acc.id ? 'bg-brand-gold text-brand-dark' : 'bg-stone-50 text-stone-300'}`}>
                            <acc.icon className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-accent uppercase tracking-widest font-bold">{acc.name}</span>
                        </div>
                        {design.accessory === acc.id && <Check className="w-4 h-4 text-brand-gold" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 6 && (
                <motion.div key="step6-final" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <button 
                    onClick={handleSave}
                    className="w-full p-4 rounded-2xl bg-white border border-brand-border/20 flex items-center justify-between hover:bg-brand-rose/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-brand-rose" />
                      <span className="text-xs font-accent uppercase font-bold tracking-widest">Guardar en Favoritos</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: 'Mi diseño en Lupe Nails',
                            text: `He creado ${aiResult?.name || 'un diseño'} increíble.`,
                            url: window.location.href
                          });
                        }
                      }}
                      className="p-4 rounded-2xl bg-white border border-brand-border/20 flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors"
                    >
                      <Share2 className="w-4 h-4 text-brand-dark/40" />
                      <span className="text-[10px] font-accent uppercase font-bold tracking-widest">Compartir</span>
                    </button>
                    <button className="p-4 rounded-2xl bg-white border border-brand-border/20 flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors">
                      <Download className="w-4 h-4 text-brand-dark/40" />
                      <span className="text-[10px] font-accent uppercase font-bold tracking-widest">Descargar</span>
                    </button>
                  </div>

                  <button className="w-full p-4 rounded-2xl bg-brand-dark text-white flex items-center justify-between hover:bg-brand-gold transition-colors">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5" />
                      <span className="text-xs font-accent uppercase font-bold tracking-widest">Reservar con este diseño</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  
                  <button 
                    onClick={() => { setStep(1); setAiResult(null); }}
                    className="w-full text-[10px] uppercase tracking-widest font-bold text-stone-400 hover:text-brand-dark"
                  >
                    Crear otro diseño
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {step < 5 && (
              <div className="mt-auto pt-8 flex gap-4">
                {step > 1 && (
                  <button 
                    onClick={() => setStep(s => s - 1)}
                    className="p-4 rounded-xl border border-brand-dark/5 bg-white hover:bg-brand-rose/20 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>
                )}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={step < 4 ? handleNext : handleGenerate}
                  className="flex-1 premium-button bg-brand-dark text-brand-nude flex items-center justify-center gap-2"
                >
                   {step === 4 ? 'Generar Diseño con IA' : 'Siguiente Paso'} 
                   {step < 4 && <ChevronRight className="w-4 h-4" />}
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.2);
        }
      `}</style>
    </AnimatePresence>
  );
};

const Badge = ({ text, icon: Icon }: any) => (
  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-brand-dark/5 shadow-sm">
    <Icon className="w-3 h-3 text-brand-gold" />
    <span className="text-[10px] font-accent uppercase tracking-widest">{text}</span>
  </div>
);

const SummaryRow = ({ label, value }: any) => (
  <div className="flex justify-between items-center text-xs font-accent">
    <span className="text-brand-dark/40 uppercase tracking-widest">{label}</span>
    <span className="font-semibold text-brand-dark uppercase tracking-wider">{value}</span>
  </div>
);
