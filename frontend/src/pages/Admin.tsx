import React, { useEffect, useState } from 'react';
import { Users, Calendar, CheckCircle, Clock, Search, ChevronLeft, ChevronRight, Plus, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { adminApi, AdminStats } from '../api/admin';
import { citasApi } from '../api/citas';

interface UserData {
  id: number; name: string; email: string; role: string;
  faculty?: string; createdAt: string; _count?: { citas: number };
}

interface SlotConfig {
  id: number; professionalId: number; dayOfWeek: number;
  startHour: number; endHour: number; durationMin: number; active: boolean;
}

const roleColors: Record<string, string> = {
  USER: 'bg-blue-100 text-blue-800',
  PSYCHOLOGIST: 'bg-purple-100 text-purple-800',
  ADMIN: 'bg-red-100 text-red-800',
};
const roleLabels: Record<string, string> = {
  USER: 'Estudiante', PSYCHOLOGIST: 'Psicólogo/a', ADMIN: 'Admin',
};
const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// Convierte "HH:MM" → minutos desde medianoche
const timeToMinutes = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};
// Convierte minutos → "HH:MM"
const minutesToTime = (m: number) => {
  const hh = String(Math.floor(m / 60)).padStart(2, '0');
  const mm = String(m % 60).padStart(2, '0');
  return `${hh}:${mm}`;
};

const Admin: React.FC = () => {
  const [stats, setStats]         = useState<AdminStats | null>(null);
  const [users, setUsers]         = useState<UserData[]>([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch]       = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState<'stats' | 'users' | 'availability'>('stats');

  // Slots de disponibilidad
  const [slots, setSlots]                   = useState<SlotConfig[]>([]);
  const [loadingSlots, setLoadingSlots]     = useState(false);
  const [showSlotForm, setShowSlotForm]     = useState(false);
  const [savingSlot, setSavingSlot]         = useState(false);
  const [slotForm, setSlotForm]             = useState({
    dayOfWeek: '1', startTime: '08:00', endTime: '11:00', durationMin: '50',
  });

  useEffect(() => { adminApi.getStats().then(setStats).catch(() => {}); }, []);

  const loadUsers = async () => {
    setLoading(true);
    const params: Record<string, string> = { page: String(page), limit: '10' };
    if (search)     params.search = search;
    if (roleFilter) params.role   = roleFilter;
    const data = await adminApi.getUsers(params).catch(() => ({ data: [], total: 0, totalPages: 1 }));
    setUsers(data.data ?? []);
    setTotal(data.total ?? 0);
    setTotalPages(data.totalPages ?? 1);
    setLoading(false);
  };

  const loadSlots = async () => {
    setLoadingSlots(true);
    try {
      const data = await citasApi.getSlotConfig();
      setSlots(data);
    } catch { setSlots([]); }
    finally { setLoadingSlots(false); }
  };

  useEffect(() => { if (tab === 'users') loadUsers(); }, [tab, page, roleFilter]);
  useEffect(() => { if (tab === 'availability') loadSlots(); }, [tab]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); loadUsers(); };

  const handleAddSlot = async () => {
    setSavingSlot(true);
    try {
      await citasApi.createSlot({
        dayOfWeek:   parseInt(slotForm.dayOfWeek),
        startHour:   timeToMinutes(slotForm.startTime),
        endHour:     timeToMinutes(slotForm.endTime),
        durationMin: parseInt(slotForm.durationMin),
      });
      setShowSlotForm(false);
      setSlotForm({ dayOfWeek: '1', startTime: '08:00', endTime: '11:00', durationMin: '50' });
      await loadSlots();
    } catch { /* silencioso */ }
    finally { setSavingSlot(false); }
  };

  const handleDeleteSlot = async (id: number) => {
    await citasApi.deleteSlot(id).catch(() => {});
    setSlots(prev => prev.filter(s => s.id !== id));
  };

  const StatCard = ({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) => (
    <div className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-display font-black text-on-surface">{value}</p>
        <p className="text-sm text-on-surface-variant">{label}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-display font-black text-on-surface">Panel de Administración</h1>
        <p className="text-on-surface-variant mt-1">Gestión centralizada de Equilibria.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['stats', 'users', 'availability'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl font-bold text-sm transition-colors
              ${tab === t ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-highest'}`}>
            {t === 'stats' ? 'Estadísticas' : t === 'users' ? 'Usuarios' : 'Disponibilidad'}
          </button>
        ))}
      </div>

      {/* ── STATS ─────────────────────────────────────────────────────────────── */}
      {tab === 'stats' && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Estudiantes registrados" value={stats.totalUsers}          icon={Users}        color="bg-primary" />
          <StatCard label="Total de citas"           value={stats.totalCitas}          icon={Calendar}     color="bg-secondary" />
          <StatCard label="Citas completadas"        value={stats.citasCompletadas}    icon={CheckCircle}  color="bg-green-500" />
          <StatCard label="Citas pendientes"         value={stats.citasPendientes}     icon={Clock}        color="bg-yellow-500" />
          <StatCard label="Citas este mes"           value={stats.citasThisMonth}      icon={Calendar}     color="bg-blue-500" />
          <StatCard label="Alertas SOS"              value={stats.sosAlerts ?? 0}      icon={Users}        color="bg-red-500" />
        </div>
      )}

      {/* ── USERS ─────────────────────────────────────────────────────────────── */}
      {tab === 'users' && (
        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-0">
              <div className="flex-1 relative min-w-0">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar por nombre o email..."
                  className="w-full bg-white border border-outline-variant/30 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <button type="submit" className="bg-primary text-white px-4 py-2.5 rounded-xl font-bold text-sm">
                Buscar
              </button>
            </form>
            <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
              className="bg-white border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none">
              <option value="">Todos los roles</option>
              <option value="USER">Estudiantes</option>
              <option value="PSYCHOLOGIST">Psicólogos</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>

          <p className="text-sm text-on-surface-variant">{total} usuarios encontrados</p>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-surface-container">
                    <tr>
                      {['Nombre', 'Email', 'Rol', 'Facultad', 'Citas', 'Registro'].map(h => (
                        <th key={h} className="text-left px-4 py-3 font-bold text-on-surface-variant text-xs uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-surface-container/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-on-surface">{u.name}</td>
                        <td className="px-4 py-3 text-on-surface-variant">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-bold ${roleColors[u.role]}`}>
                            {roleLabels[u.role]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-on-surface-variant">{u.faculty || '—'}</td>
                        <td className="px-4 py-3 text-on-surface-variant">{u._count?.citas ?? 0}</td>
                        <td className="px-4 py-3 text-on-surface-variant">
                          {new Date(u.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 hover:bg-surface-container rounded-lg disabled:opacity-40"><ChevronLeft size={20} /></button>
              <span className="text-sm font-bold text-on-surface-variant">Página {page} de {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-2 hover:bg-surface-container rounded-lg disabled:opacity-40"><ChevronRight size={20} /></button>
            </div>
          )}
        </div>
      )}

      {/* ── DISPONIBILIDAD ────────────────────────────────────────────────────── */}
      {tab === 'availability' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-on-surface">Horarios de Atención</h2>
              <p className="text-sm text-on-surface-variant">
                Configura los bloques de disponibilidad. Los estudiantes solo verán estos horarios al agendar.
              </p>
            </div>
            <button onClick={() => setShowSlotForm(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors">
              <Plus size={18} /> Agregar horario
            </button>
          </div>

          {loadingSlots ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5].map(day => {
                const daySlots = slots.filter(s => s.dayOfWeek === day && s.active);
                return (
                  <div key={day} className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Settings size={18} className="text-primary" />
                      <h3 className="font-bold text-on-surface">{DAY_NAMES[day]}</h3>
                    </div>
                    {daySlots.length === 0 ? (
                      <p className="text-sm text-on-surface-variant">Sin horarios configurados</p>
                    ) : (
                      <div className="space-y-2">
                        {daySlots.map(slot => (
                          <div key={slot.id} className="flex items-center justify-between p-2 bg-surface-container rounded-lg">
                            <div>
                              <span className="text-sm font-medium text-on-surface">
                                {minutesToTime(slot.startHour)} – {minutesToTime(slot.endHour)}
                              </span>
                              <span className="text-xs text-outline ml-2">({slot.durationMin} min/sesión)</span>
                            </div>
                            <button onClick={() => handleDeleteSlot(slot.id)}
                              className="text-xs text-error hover:underline">
                              Eliminar
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Modal agregar slot */}
          <AnimatePresence>
            {showSlotForm && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
                  <h2 className="font-display font-bold text-xl text-on-surface">Agregar Horario de Atención</h2>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-bold text-on-surface-variant block mb-1">Día de la semana</label>
                      <select value={slotForm.dayOfWeek} onChange={e => setSlotForm(f => ({ ...f, dayOfWeek: e.target.value }))}
                        className="w-full bg-surface-container border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none">
                        {[1, 2, 3, 4, 5].map(d => <option key={d} value={d}>{DAY_NAMES[d]}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-bold text-on-surface-variant block mb-1">Hora inicio</label>
                        <input type="time" value={slotForm.startTime}
                          onChange={e => setSlotForm(f => ({ ...f, startTime: e.target.value }))}
                          className="w-full bg-surface-container border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-on-surface-variant block mb-1">Hora fin</label>
                        <input type="time" value={slotForm.endTime}
                          onChange={e => setSlotForm(f => ({ ...f, endTime: e.target.value }))}
                          className="w-full bg-surface-container border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-on-surface-variant block mb-1">Duración por sesión (min)</label>
                      <select value={slotForm.durationMin} onChange={e => setSlotForm(f => ({ ...f, durationMin: e.target.value }))}
                        className="w-full bg-surface-container border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none">
                        <option value="30">30 minutos</option>
                        <option value="45">45 minutos</option>
                        <option value="50">50 minutos</option>
                        <option value="60">60 minutos</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setShowSlotForm(false)}
                      className="flex-1 py-3 border border-outline-variant rounded-xl font-bold text-on-surface-variant hover:bg-surface-container">
                      Cancelar
                    </button>
                    <button onClick={handleAddSlot} disabled={savingSlot}
                      className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 disabled:opacity-60">
                      {savingSlot ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Admin;
