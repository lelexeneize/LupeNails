import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, X, ArrowRight, Camera, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { geminiService } from '../../services/geminiService';

export const AIInspiration = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!query) return;
    setIsSearching(true);
    setResults([]);
    
    try {
      const recommendations = await geminiService.getDesignRecommendations(query);
      if (recommendations) {
        setResults(recommendations);
      } else {
        // Fallback mock if key missing
        setResults([
          { title: 'Rose Gold Glaze', description: 'Un acabado perlado con matices rosados cálidos.' },
          { title: 'Pearl French', description: 'La clásica francesa con un toque de polvo de perlas.' },
          { title: 'Minimalist Nude', description: 'Base traslúcida con puntos de luz sutíles.' },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-32 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="bg-brand-dark text-brand-nude p-4 rounded-full shadow-xl flex items-center gap-2 group"
        >
          <Sparkles className="w-6 h-6 text-brand-gold animate-pulse" />
          <span className="hidden group-hover:block text-xs font-accent uppercase tracking-widest px-2">AI Inspiration</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-brand-nude/95 backdrop-blur-3xl p-6 flex items-center justify-center"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 p-4 hover:bg-white/50 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-w-2xl w-full text-center">
              <div className="flex justify-center mb-8">
                <div className="p-4 bg-brand-dark rounded-3xl">
                  <Sparkles className="w-12 h-12 text-brand-gold" />
                </div>
              </div>
              
              <h2 className="text-4xl md:text-5xl mb-4">Inspiración con IA</h2>
              <p className="text-brand-dark/50 mb-12 font-accent uppercase tracking-widest text-xs">
                Describe tus uñas ideales y nuestra IA buscará entre miles de diseños virales.
              </p>

              <div className="relative mb-12">
                <input 
                  type="text"
                  placeholder="Ej: Uñas almendradas con efecto perla y flores minimal..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-white border border-brand-dark/5 rounded-full px-8 py-6 text-xl font-display focus:outline-none focus:border-brand-gold transition-colors shadow-2xl"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button 
                  onClick={handleSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-brand-dark text-brand-nude p-4 rounded-full"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {isSearching ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={`ai-loader-${i}`} className="aspect-[4/5] bg-brand-dark/5 rounded-3xl flex flex-col items-center justify-center gap-4">
                      <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
                      <p className="text-[10px] font-accent uppercase tracking-widest text-brand-dark/30">Consultando estilista IA...</p>
                    </div>
                  ))
                ) : results.length > 0 && (
                  results.map((res, i) => (
                    <motion.div
                      key={`ai-result-${i}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-panel p-8 rounded-3xl text-left flex flex-col justify-between group hover:border-brand-gold transition-colors"
                    >
                      <div>
                        <div className="w-12 h-12 bg-brand-dark rounded-2xl flex items-center justify-center mb-6 text-brand-gold">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <h4 className="text-2xl mb-4 italic truncate">{res.title}</h4>
                        <p className="text-sm text-brand-dark/60 leading-relaxed mb-6">{res.description}</p>
                        
                        {res.elements && (
                          <div className="flex flex-wrap gap-2 mb-8">
                            {res.elements.map((el: string, idx: number) => (
                              <span key={`el-${el}-${idx}`} className="text-[10px] font-accent uppercase tracking-widest bg-brand-rose/30 px-2 py-1 rounded-md">
                                {el}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <button className="w-full py-3 rounded-xl border border-brand-dark/5 text-[10px] font-accent uppercase tracking-widest group-hover:bg-brand-dark group-hover:text-brand-nude transition-all">
                        Elegir Estilo
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              {!query && (
                <div className="flex flex-wrap justify-center gap-3">
                  {['Clean Girl', 'Aura Nails', 'Coquette Style', 'Efecto Perla'].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-4 py-2 bg-white/50 border border-brand-dark/5 rounded-full text-[10px] font-accent uppercase tracking-widest hover:border-brand-gold transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
