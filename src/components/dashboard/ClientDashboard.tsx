import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Heart, User, LogOut, ChevronRight, Clock, MapPin, Tag, Sparkles, Copy, Check } from 'lucide-react';
import { useAuth } from '../../services/authContext';
import { collection, query, where, getDocs, orderBy, limit, getDocs as getDocsAll } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

export const ClientDashboard = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [designs, setDesigns] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const bq = query(
          collection(db, 'bookings'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const bSnapshot = await getDocs(bq);
        setBookings(bSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const dq = query(
          collection(db, 'designs'),
          where('creatorId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(4)
        );
        const dSnapshot = await getDocs(dq);
        setDesigns(dSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const cSnapshot = await getDocsAll(collection(db, 'coupons'));
        setCoupons(cSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/20 backdrop-blur-xl"
    >
      <div className="bg-[#FAF7F2] w-full max-w-4xl max-h-[90vh] rounded-[4rem] overflow-hidden flex flex-col shadow-2xl relative border border-brand-border/20">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-20 p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="p-12 md:p-16">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
              <div className="relative">
                <img 
                  src={user?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200"} 
                  className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                />
                <div className="absolute bottom-1 right-1 w-8 h-8 bg-brand-gold rounded-full border-4 border-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-4xl italic font-display mb-2">{user?.displayName || 'Clienta'}</h1>
                <p className="text-stone-400 font-accent uppercase tracking-widest text-xs">{user?.email}</p>
                <div className="flex gap-4 mt-6">
                  <button className="text-[10px] uppercase underline tracking-widest hover:text-brand-gold transition-colors">Editar Perfil</button>
                  <button onClick={logout} className="text-[10px] uppercase underline tracking-widest text-red-400 hover:text-red-500 transition-colors flex items-center gap-2">
                    <LogOut className="w-3 h-3" /> Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl italic font-display">Mis Turnos</h3>
                  <button className="text-[10px] uppercase tracking-widest text-brand-gold hover:underline">Ver todos</button>
                </div>

                <div className="space-y-4">
                  {loading ? (
                    <div key="booking-loader" className="p-6 bg-white rounded-3xl animate-pulse h-24"></div>
                  ) : bookings.length > 0 ? (
                    bookings.map(booking => (
                      <div key={`booking-item-${booking.id}`} className="p-6 bg-white rounded-3xl border border-brand-border/10 flex items-center justify-between hover:scale-[1.02] transition-transform cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-brand-rose/10 rounded-2xl">
                            <Calendar className="w-5 h-5 text-brand-rose" />
                          </div>
                          <div>
                            <div className="font-bold text-sm tracking-wide uppercase">{booking.service || 'Consulta'}</div>
                            <div className="text-xs text-stone-400">{booking.date} • {booking.time}</div>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[8px] uppercase font-bold tracking-widest ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-stone-100 text-stone-400'
                        }`}>
                          {booking.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center bg-white rounded-3xl border border-brand-border/10">
                      <Calendar className="w-10 h-10 text-stone-200 mx-auto mb-4" />
                      <p className="text-stone-400 text-sm">No tenés turnos programados.</p>
                      <button className="mt-4 text-[10px] uppercase tracking-widest font-bold text-brand-gold">Reservar ahora</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-12">
                <div>
                  <h3 className="text-2xl italic font-display mb-8">Mis Diseños</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {loading ? (
                      [1, 2].map(i => <div key={`design-loader-${i}`} className="aspect-square bg-stone-100 rounded-3xl animate-pulse" />)
                    ) : designs.length > 0 ? (
                      designs.map(design => (
                        <div key={`design-item-${design.id}`} className="aspect-square bg-white rounded-3xl overflow-hidden relative group cursor-pointer shadow-sm border border-brand-border/10">
                          <img 
                            src={design.imageUrl || "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=200"} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                            alt={design.name} 
                          />
                          <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                            <p className="text-white text-[10px] font-accent uppercase tracking-widest">{design.name}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 aspect-[2/1] bg-stone-100 rounded-3xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center p-8 text-center">
                        <Heart className="w-6 h-6 text-stone-200 mb-2" />
                        <p className="text-[10px] uppercase tracking-widest text-stone-400">No guardaste diseños aún</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl italic font-display mb-8">Cupones & Regalos</h3>
                  {loading ? (
                    <div className="p-6 bg-stone-100 rounded-3xl animate-pulse h-32" />
                  ) : coupons.length > 0 ? (
                    <div className="space-y-4">
                      {coupons.map(coupon => (
                        <div key={`coupon-${coupon.id}`} className="p-6 bg-brand-dark rounded-3xl text-white relative overflow-hidden">
                          <div className="absolute -right-8 -top-8 w-32 h-32 bg-brand-gold/20 blur-3xl rounded-full" />
                          <div className="flex gap-4 items-center mb-4">
                            <Tag className="w-5 h-5 text-brand-gold" />
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                              {coupon.type === 'percentage' ? `${coupon.discount}% OFF` : `$${coupon.discount} OFF`}
                            </span>
                          </div>
                          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-4">
                            {coupon.code === 'BIENVENIDA20' ? 'Promo Bienvenida' : 'Cupón disponible'}
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <code className="text-brand-gold font-mono tracking-widest font-bold text-lg">{coupon.code}</code>
                            <button
                              onClick={() => handleCopyCode(coupon.code)}
                              className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                            >
                              {copiedCode === coupon.code ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 bg-brand-dark rounded-3xl text-white relative overflow-hidden">
                      <div className="absolute -right-8 -top-8 w-32 h-32 bg-brand-gold/20 blur-3xl rounded-full" />
                      <div className="flex gap-4 items-center mb-4">
                        <Tag className="w-5 h-5 text-brand-gold" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Promo Bienvenida</span>
                      </div>
                      <div className="text-3xl font-display mb-2">20% OFF</div>
                      <p className="text-white/40 text-[10px] uppercase tracking-widest mb-6">Válido para tu primer turno</p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <code className="text-brand-gold font-mono tracking-widest font-bold text-lg">LUPE20</code>
                        <button
                          onClick={() => handleCopyCode('LUPE20')}
                          className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                        >
                          {copiedCode === 'LUPE20' ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
