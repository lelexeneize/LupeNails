import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Clock, User, X, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

const PROFESSIONALS = [
  { id: 1, name: 'Sofia', role: 'Senior Artist', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' },
  { id: 2, name: 'Elena', role: 'Nail Designer', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200' },
  { id: 3, name: 'Mia', role: 'Gel Specialist', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
];

const TIME_SLOTS = ['09:00', '10:30', '12:00', '14:30', '16:00', '17:30', '19:00'];

export const BookingModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] bg-brand-dark/95 backdrop-blur-xl flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-brand-nude w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl relative"
        >
          <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-black/5 rounded-full transition-colors z-10">
            <X className="w-5 h-5 text-brand-dark" />
          </button>

          <div className="p-12">
            <div className="flex items-center gap-4 mb-8">
              {[1, 2, 3].map(i => (
                <div key={`booking-step-${i}`} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-brand-dark' : 'bg-brand-dark/10'}`} />
              ))}
            </div>

            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-3xl mb-2 italic">Elige a tu artista</h3>
                <p className="text-sm font-accent text-brand-dark/50 mb-8 tracking-widest uppercase">Selecciona tu profesional</p>
                <div className="flex flex-col gap-4">
                  {PROFESSIONALS.map(pro => (
                    <button 
                      key={pro.id}
                      onClick={() => { setSelectedProfessional(pro); handleNext(); }}
                      className="group flex items-center gap-6 p-4 rounded-3xl border border-brand-dark/5 bg-white hover:border-brand-gold transition-all text-left"
                    >
                      <div className="w-16 h-16 rounded-2xl overflow-hidden">
                        <img src={pro.image} alt={pro.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-accent font-semibold">{pro.name}</h4>
                        <p className="text-xs text-brand-dark/40 italic">{pro.role}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-brand-dark/20 group-hover:text-brand-gold group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={handleBack} className="p-2 bg-white rounded-full"><ChevronLeft className="w-4 h-4" /></button>
                  <div>
                    <h3 className="text-3xl mb-1 italic text-brand-dark">Mayo 2026</h3>
                    <p className="text-[10px] font-accent text-brand-dark/40 uppercase tracking-[0.2em]">Selecciona fecha y hora</p>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-8">
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                    <div key={`day-name-${d}-${i}`} className="text-center text-[10px] font-accent text-brand-dark/30 mb-2">{d}</div>
                  ))}
                  {Array.from({ length: 31 }).map((_, i) => (
                    <button 
                      key={`calendar-day-${i}`}
                      disabled={i < 15}
                      onClick={() => setSelectedDate(i + 1)}
                      className={`h-10 rounded-xl text-xs font-accent transition-all ${
                        selectedDate === i + 1 
                          ? 'bg-brand-dark text-white' 
                          : i < 15 ? 'opacity-20 cursor-not-allowed' : 'bg-white hover:border-brand-gold border border-brand-dark/5'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {TIME_SLOTS.map(t => (
                    <button 
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`px-4 py-2 rounded-xl text-xs font-accent border transition-all ${
                        selectedTime === t 
                        ? 'bg-brand-gold border-brand-gold text-white' 
                        : 'border-brand-dark/5 bg-white hover:border-brand-gold'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <button 
                  disabled={!selectedDate || !selectedTime}
                  onClick={handleNext}
                  className="w-full mt-12 premium-button bg-brand-dark text-brand-nude disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Confirmar Selección
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="flex justify-center mb-8">
                  <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </div>
                </div>
                <h3 className="text-4xl mb-4 italic">¡Reserva Enviada!</h3>
                <p className="text-brand-dark/60 mb-12">
                  Tu turno con <span className="text-brand-dark font-semibold">{selectedProfessional.name}</span> el día <span className="text-brand-dark font-semibold">{selectedDate} de Mayo</span> a las <span className="text-brand-dark font-semibold">{selectedTime}hs</span> está pendiente de confirmación.
                </p>
                
                <div className="glass-panel p-6 rounded-3xl text-left mb-8">
                  <p className="text-[10px] font-accent uppercase tracking-widest text-brand-dark/40 mb-4">Siguientes pasos</p>
                  <ul className="text-xs font-accent flex flex-col gap-4">
                    <li className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-gold text-white flex items-center justify-center text-[10px]">1</div>
                      <span>Te contactaremos por WhatsApp en menos de 15 min.</span>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-gold text-white flex items-center justify-center text-[10px]">2</div>
                      <span>Recibirás un link de pago para la seña.</span>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-gold text-white flex items-center justify-center text-[10px]">3</div>
                      <span>¡Listo! Te esperamos en el estudio.</span>
                    </li>
                  </ul>
                </div>

                <button 
                  onClick={onClose}
                  className="w-full premium-button border border-brand-dark/10 hover:bg-white"
                >
                  Volver al inicio
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
