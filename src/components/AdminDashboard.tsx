import { Calendar, Users, TrendingUp, DollarSign, Plus, Edit3, Trash2, Tag, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const AdminDashboard = () => {
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: 20, type: 'percentage' });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCoupon = async () => {
    try {
      await addDoc(collection(db, 'coupons'), {
        ...newCoupon,
        isActive: true,
        createdAt: new Date().toISOString()
      });
      setIsCreating(false);
      setNewCoupon({ code: '', discount: 20, type: 'percentage' });
      alert('Cupón creado con éxito');
    } catch (error) {
      alert('Error al crear cupón');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl mb-2 font-display italic">Panel de Control</h1>
            <p className="text-sm font-accent text-brand-dark/40 uppercase tracking-widest">Gestión de Lupe Nails Studio</p>
          </div>
          <div className="flex gap-4">
            <button className="premium-button bg-brand-rose text-white flex items-center gap-2">
              <Plus className="w-4 h-4" /> Nuevo Turno
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard icon={Calendar} label="Reservas Hoy" value="24" delta="+12%" />
          <StatCard icon={Users} label="Nuevas Clientas" value="156" delta="+5%" />
          <StatCard icon={DollarSign} label="Ingresos" value="$12.4K" delta="+18%" />
          <StatCard icon={TrendingUp} label="Alcance Viral" value="2.4M" delta="+42%" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-panel p-8 rounded-[2rem]">
              <h3 className="text-2xl mb-6 italic">Próximos Turnos</h3>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={`booking-${i}`} className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-brand-border/10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-rose" />
                      <div>
                        <p className="font-accent font-semibold text-sm">Luciana Gomez</p>
                        <p className="text-[10px] text-brand-dark/40 uppercase tracking-widest">Soft Gel • 14:30hs</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:text-brand-gold transition-colors"><Edit3 className="w-4 h-4" /></button>
                      <button className="p-2 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-8 rounded-[2rem]">
              <h3 className="text-2xl mb-6 italic">Galería Viral</h3>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                  <div key={`gallery-item-${i}`} className="aspect-square bg-white/50 rounded-xl overflow-hidden relative group">
                    <img src={`https://images.unsplash.com/photo-1604243708230-058f96791986?auto=format&fit=crop&q=80&w=150&sig=${i}`} className="w-full h-full object-cover" alt="design" />
                    <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Edit3 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ))}
                <button className="aspect-square border-2 border-dashed border-brand-dark/10 rounded-xl flex items-center justify-center text-brand-dark/20 hover:border-brand-gold hover:text-brand-gold transition-all">
                  <Plus className="w-8 h-8" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass-panel p-8 rounded-[2rem] bg-brand-dark text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 blur-3xl rounded-full" />
              <div className="flex items-center gap-3 mb-6">
                <Tag className="w-5 h-5 text-brand-gold" />
                <h3 className="text-2xl italic">Generar Cupón</h3>
              </div>
              
              <div className="space-y-4 relative z-10">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">Código</label>
                  <input 
                    type="text" 
                    value={newCoupon.code}
                    onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                    placeholder="E.G. LUPE2026"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">Descuento</label>
                    <input 
                      type="number" 
                      value={newCoupon.discount}
                      onChange={e => setNewCoupon({...newCoupon, discount: parseInt(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">Tipo</label>
                    <select 
                      value={newCoupon.type}
                      onChange={e => setNewCoupon({...newCoupon, type: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold"
                    >
                      <option value="percentage">%</option>
                      <option value="fixed">$</option>
                    </select>
                  </div>
                </div>
                <button 
                  onClick={handleCreateCoupon}
                  className="w-full bg-brand-gold text-brand-dark font-accent font-bold uppercase tracking-widest text-xs py-4 rounded-xl mt-4 hover:bg-white transition-colors"
                >
                  Crear Cupón
                </button>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-[2rem]">
              <h3 className="text-xl mb-6 italic">Cupones Activos</h3>
              <div className="space-y-4">
                {['BIENVENIDA20', 'NAILSART10'].map(code => (
                  <div key={code} className="flex items-center justify-between p-4 bg-brand-nude rounded-2xl border border-brand-border/10">
                    <span className="font-mono text-sm tracking-widest font-bold">{code}</span>
                    <button className="p-2 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, delta }: any) => (
  <div className="glass-panel p-6 rounded-3xl">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-brand-dark rounded-xl text-brand-gold">
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-[10px] font-accent text-green-600 bg-green-50 px-2 py-1 rounded-full">{delta}</span>
    </div>
    <p className="text-[10px] font-accent text-brand-dark/40 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-display">{value}</p>
  </div>
);
