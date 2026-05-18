import React, { useEffect, useState } from 'react';
import { Users, Calendar, CheckCircle, Clock, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminApi, AdminStats } from '../api/admin';

const roleColors: Record<string, string> = {
  USER: 'bg-blue-100 text-blue-800',
  PSYCHOLOGIST: 'bg-purple-100 text-purple-800',
  ADMIN: 'bg-red-100 text-red-800',
};
const roleLabels: Record<string, string> = {
  USER: 'Estudiante', PSYCHOLOGIST: 'Psicólogo/a', ADMIN: 'Admin',
};

const Admin = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'stats' | 'users'>('stats');

  useEffect(() => {
    adminApi.getStats().then(setStats).catch(() => {});
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const params: Record<string, string> = { page: String(page), limit: '10' };
    if (search) params.search = search;
    if (roleFilter) params.role = roleFilter;
    const data = await adminApi.getUsers(params).catch(() => ({ data: [], total: 0, totalPages: 1 }));
    setUsers(data.data ?? []);
    setTotal(data.total ?? 0);
    setTotalPages(data.totalPages ?? 1);
    setLoading(false);
  };

  useEffect(() => { if (tab === 'users') loadUsers(); }, [tab, page, roleFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadUsers();
  };

  const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-display font-black text-on-surface">{value ?? '—'}</p>
        <p className="text-sm text-on-surface-variant">{label}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-display font-black text-on-surface">Panel de Administración</h1>
        <p className="text-on-surface-variant mt-1">Gestión centralizada de Equilibria.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['stats', 'users'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl font-bold text-sm transition-colors
              ${tab === t ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-highest'}`}>
            {t === 'stats' ? 'Estadísticas' : 'Usuarios'}
          </button>
        ))}
      </div>

      {tab === 'stats' && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Estudiantes registrados" value={stats.totalUsers} icon={Users} color="bg-primary" />
          <StatCard label="Total de citas" value={stats.totalCitas} icon={Calendar} color="bg-secondary" />
          <StatCard label="Citas completadas" value={stats.citasCompletadas} icon={CheckCircle} color="bg-green-500" />
          <StatCard label="Citas pendientes" value={stats.citasPendientes} icon={Clock} color="bg-yellow-500" />
          <StatCard label="Citas este mes" value={stats.citasThisMonth} icon={Calendar} color="bg-blue-500" />
          <StatCard label="Alertas SOS" value={stats.sosAlerts} icon={Users} color="bg-red-500" />
        </div>
      )}

      {tab === 'users' && (
        <div className="space-y-4">
          {/* Filtros */}
          <div className="flex gap-3 flex-wrap">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-0">
              <div className="flex-1 relative min-w-0">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar por nombre o email..."
                  className="w-full bg-white border border-outline-variant/30 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <button type="submit" className="bg-primary text-white px-4 py-2.5 rounded-xl font-bold text-sm">Buscar</button>
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
            <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
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
                      <td className="px-4 py-3 font-bold text-on-surface">{u.name ?? '—'}</td>
                      <td className="px-4 py-3 text-on-surface-variant">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${roleColors[u.role]}`}>
                          {roleLabels[u.role]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant">{u.faculty ?? '—'}</td>
                      <td className="px-4 py-3 text-on-surface-variant">{u._count?.citas ?? 0}</td>
                      <td className="px-4 py-3 text-on-surface-variant">
                        {new Date(u.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 hover:bg-surface-container rounded-lg disabled:opacity-40">
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm font-bold text-on-surface-variant">Página {page} de {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-2 hover:bg-surface-container rounded-lg disabled:opacity-40">
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
