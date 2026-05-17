import { Calendar, Users, TrendingUp, DollarSign, Plus, Edit3, Trash2, Tag, Copy, Check, Gift, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, setDoc, query, where, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';


export const AdminDashboard = () => {
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: 20, type: 'percentage' });
  const [giftCoupon, setGiftCoupon] = useState({ code: '', discount: 10, type: 'percentage', email: '' });
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [couponCode, setCouponCode] = useState('');
  const [view, setView] = useState<'stats' | 'users' | 'coupons' | 'create-coupon'>('stats');

  const handleCreateCoupon = async () => {
    try {
      const couponData = {
        code: newCoupon.code || `LUPE-${Math.floor(10000 + Math.random() * 90000)}`,
        discount: newCoupon.discount,
        type: newCoupon.type,
        isActive: true,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Expira en 30 días
      };
      await addDoc(collection(db, 'coupons'), couponData);
      setNewCoupon({ code: '', discount: 20, type: 'percentage' });
      alert('Cupón creado con éxito');
    } catch (error) {
      alert('Error al crear cupón');
    }
  };

  // Cargar usuarios registrados
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, 'users'));
        const querySnapshot = await getDocs(q);
        const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(userList);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Crear cupón para usuario específico
  const handleCreateUserCoupon = async () => {
    if (!selectedUser) {
      alert('Seleccioná un usuario');
      return;
    }
    try {
      const couponData = {
        code: `${selectedUser.name.replace(' ', '')}-${Math.floor(1000 + Math.random() * 9000)}`,
        discount: newCoupon.discount,
        type: newCoupon.type,
        isActive: true,
        userId: selectedUser.id,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Expira en 7 días
      };
      await addDoc(collection(db, 'coupons'), couponData);
      alert(`Cupón creado para ${selectedUser.name}: ${couponData.code}`);
      setNewCoupon({ code: '', discount: 20, type: 'percentage' });
      setSelectedUser(null);
    } catch (error) {
      console.error('Error creating coupon:', error);
      alert('Error al crear cupón');
    }
  };

  // Crear cupón para regalar (manual)
  const handleCreateGiftCoupon = async () => {
    try {
      const couponData = {
        code: `LUPE-${Math.floor(10000 + Math.random() * 90000)}`,
        discount: giftCoupon.discount,
        type: giftCoupon.type,
        isActive: true,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Expira en 30 días
        ...(giftCoupon.email && { assignedTo: giftCoupon.email })
      };
      await addDoc(collection(db, 'coupons'), couponData);
      alert(`Cupón de regalo creado: ${couponData.code} ${giftCoupon.email ? `para ${giftCoupon.email}` : ''}`);
      setGiftCoupon({ code: '', discount: 10, type: 'percentage', email: '' });
      setCouponCode(couponData.code);
    } catch (error) {
      console.error('Error creating gift coupon:', error);
      alert('Error al crear cupón de regalo');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('¡Código copiado al portapapeles!');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl mb-2 font-display italic">Panel de Admin</h1>
            <p className="text-sm font-accent text-brand-dark/40 uppercase tracking-widest">Gestión de Lupe Nails</p>
          </div>

          <div className="flex gap-4">
            <div className="flex gap-2">
              <button onClick={() => setView('users')} className={`px-4 py-2 rounded-full ${view === 'users' ? 'bg-brand-dark text-white' : 'bg-white border border-brand-dark/5'}`}>Usuarios</button>
              <button onClick={() => setView('coupons')} className={`px-4 py-2 rounded-full ${view === 'coupons' ? 'bg-brand-dark text-white' : 'bg-white border border-brand-dark/5'}`}>Cupones</button>
              <button onClick={() => setView('stats')} className={`px-4 py-2 rounded-full ${view === 'stats' ? 'bg-brand-dark text-white' : 'bg-white border border-brand-dark/5'}`}>Estadísticas</button>
            </div>
            <button className="premium-button bg-brand-rose text-white flex items-center gap-2">
              <Plus className="w-4 h-4" /> Nuevo Turno
            </button>
          </div>
        </header>

        {view === 'stats' && (
          <>
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
                        <img src={`https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&q=80&w=150&sig=${i}`} className="w-full h-full object-cover" alt="design" />
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
                    <h3 className="text-2xl italic">Generar Cupón Genérico</h3>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">Código (opcional)</label>
                      <input
                        type="text"
                        value={newCoupon.code}
                        onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                        placeholder="Ej: LUPE20"
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
                      Crear Cupón Genérico
                    </button>
                  </div>
                </div>

                <div className="glass-panel p-8 rounded-[2rem]">
                  <h3 className="text-xl mb-6 italic">Cupones Activos</h3>
                  <div className="space-y-4">
                    {['BIENVENIDA20', 'NAILSART10'].map(code => (
                      <div key={code} className="flex items-center justify-between p-4 bg-brand-nude rounded-2xl border border-brand-border/10">
                        <span className="font-mono text-sm tracking-widest font-bold">{code}</span>
                        <button onClick={() => {}} className="p-2 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {view === 'users' && (
          <div className="glass-panel p-8 rounded-[2rem]">
            <h3 className="text-2xl mb-6 italic">Usuarios Registrados ({users.length})</h3>
            <div className="mb-4">
              <div className="relative max-w-xs">
                <input
                  type="text"
                  placeholder="Buscar usuarios..."
                  className="w-full bg-white/50 border border-brand-dark/5 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-brand-dark/10">
                    <th className="text-left p-4 text-xs font-accent uppercase tracking-widest">ID</th>
                    <th className="text-left p-4 text-xs font-accent uppercase tracking-widest">Nombre</th>
                    <th className="text-left p-4 text-xs font-accent uppercase tracking-widest">Email</th>
                    <th className="text-left p-4 text-xs font-accent uppercase tracking-widest">Registrado</th>
                    <th className="text-left p-4 text-xs font-accent uppercase tracking-widest">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingUsers ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-6 h-6 animate-spin" />
                          Cargando usuarios...
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.id} className="border-b border-brand-dark/5 hover:bg-brand-nude/30 transition-colors">
                        <td className="p-4 text-xs font-mono">{user.id?.substring(0, 8)}...</td>
                        <td className="p-4 font-accent font-semibold">{user.name || 'Sin nombre'}</td>
                        <td className="p-4 text-sm">{user.email}</td>
                        <td className="p-4 text-xs text-brand-dark/40">{user.createdAt || 'N/A'}</td>
                        <td className="p-4 flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setView('create-coupon');
                            }}
                            className="p-2 rounded-full bg-brand-gold/20 text-brand-gold hover:bg-brand-gold hover:text-white transition-colors"
                            title="Crear cupón para este usuario"
                          >
                            <Gift className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-full bg-brand-dark/10 text-brand-dark hover:bg-brand-dark hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === 'create-coupon' && selectedUser && (
          <div className="glass-panel p-8 rounded-[2rem] bg-brand-dark text-white">
            <button onClick={() => { setView('users'); setSelectedUser(null); }} className="mb-6 text-brand-gold hover:text-white transition-colors">&larr; Volver a usuarios</button>
            <h3 className="text-2xl mb-6 italic">Crear Cupón para {selectedUser.name}</h3>
            <div className="max-w-md space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">Usuario</label>
                <input
                  type="text"
                  value={selectedUser.email}
                  readOnly
                  className="w-full bg-white/10 border border-white/5 rounded-xl px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">Código Generado</label>
                <p className="text-brand-gold font-mono">{selectedUser.name?.replace(' ', '')}-{Math.floor(1000 + Math.random() * 9000)}</p>
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
                onClick={handleCreateUserCoupon}
                className="w-full bg-brand-gold text-brand-dark font-accent font-bold uppercase tracking-widest text-xs py-4 rounded-xl hover:bg-white transition-colors"
              >
                Generar Cupón para {selectedUser.name}
              </button>
            </div>
          </div>
        )}

        {view === 'coupons' && (
          <div className="space-y-8">
            <div className="glass-panel p-8 rounded-[2rem] bg-brand-nude">
              <h3 className="text-2xl mb-6 italic flex items-center gap-2">
                <Gift className="w-5 h-5 text-brand-gold" /> Cupones de Regalo
              </h3>
              <p className="text-brand-dark/60 mb-6">
                Crea cupones de regalo que los usuarios pueden aplicar desde su perfil.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="text-xs font-accent uppercase tracking-widest block mb-2">Email del Destinatario <span className="text-brand-dark/40">(opcional)</span></label>
                  <input
                    type="email"
                    value={giftCoupon.email}
                    onChange={e => setGiftCoupon({...giftCoupon, email: e.target.value})}
                    placeholder="user@example.com"
                    className="w-full bg-white border border-brand-dark/5 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="text-xs font-accent uppercase tracking-widest block mb-2">Descuento</label>
                  <input
                    type="number"
                    value={giftCoupon.discount}
                    onChange={e => setGiftCoupon({...giftCoupon, discount: parseInt(e.target.value)})}
                    className="w-full bg-white border border-brand-dark/5 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>
              <button
                onClick={handleCreateGiftCoupon}
                className="premium-button bg-brand-dark text-white hover:bg-brand-gold transition-colors"
              >
                Generar Cupón
              </button>

              {couponCode && (
                <div className="mt-6 p-4 bg-brand-dark/5 rounded-xl flex items-center justify-between">
                  <span className="text-brand-dark font-mono font-semibold">{couponCode}</span>
                  <button
                    onClick={() => copyToClipboard(couponCode)}
                    className="p-2 bg-brand-gold rounded-lg text-brand-dark"
                    title="Copiar código"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="glass-panel p-8 rounded-[2rem]">
              <h3 className="text-xl mb-6 italic">Cupones Activos</h3>
              <div className="space-y-4">
                {['LUPE20', 'VIP10', 'NAILSLOVE', 'BIENVENIDA'].map(code => (
                  <div key={code} className="flex items-center justify-between p-4 bg-white/50 rounded-2xl">
                    <span className="font-mono text-sm tracking-widest font-bold">{code}</span>
                    <div className="flex items-center gap-4 text-xs text-brand-dark/40">
                      <span>20% OFF</span>
                      <button onClick={() => {}} className="hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
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
