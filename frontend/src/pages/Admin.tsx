import React from 'react';
import { Users, FileText, BarChart3, ShieldCheck, Mail, Search, MoreVertical } from 'lucide-react';

const Admin = () => {
  const stats = [
    { label: 'Usuarios Activos', value: '1,280', delta: '+12%', icon: Users, color: 'bg-primary' },
    { label: 'Citas Realizadas', value: '450', delta: '+5%', icon: CalendarIcon, color: 'bg-secondary' },
    { label: 'Alertas SOS', value: '12', delta: '-2', icon: ShieldCheck, color: 'bg-error' },
    { label: 'Informes Pendientes', value: '28', delta: '+8', icon: FileText, color: 'bg-tertiary' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Panel de Administración</h2>
          <p className="text-on-surface-variant">Gestión global de la plataforma Equilibria.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-outline-variant/30 px-4 py-2 rounded-xl font-bold text-sm hover:bg-surface-container-low transition-colors">Exportar Datos</button>
          <button className="bg-primary text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-primary/20">Configuración Global</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-outline-variant/30 card-elevation space-y-4">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl text-white ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-xs font-bold ${stat.delta.startsWith('+') ? 'text-secondary' : 'text-error'}`}>
                {stat.delta}
              </span>
            </div>
            <div>
              <p className="text-3xl font-black text-on-surface tracking-tight">{stat.value}</p>
              <p className="text-xs text-outline font-bold uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-outline-variant/30 card-elevation overflow-hidden">
             <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2">
                    <Users size={18} className="text-primary" />
                    Gestión de Estudiantes
                </h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={16} />
                    <input type="text" placeholder="Buscar ID o nombre..." className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-sm w-64 focus:ring-1 focus:ring-primary" />
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-surface-container-low/50 text-[10px] uppercase font-bold text-outline tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Usuario</th>
                            <th className="px-6 py-4">Facultad</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                        {[
                            { name: 'Andrés Morales', id: '202201', faculty: 'Ingeniería', status: 'Activo' },
                            { name: 'Sofía Castro', id: '202302', faculty: 'Derecho', status: 'En espera' },
                            { name: 'Juan Ruiz', id: '202105', faculty: 'Medicina', status: 'Activo' }
                        ].map(user => (
                            <tr key={user.id} className="hover:bg-surface-container-low/20 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm">{user.name}</span>
                                        <span className="text-xs text-outline font-semibold">ID: {user.id}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">{user.faculty}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${user.status === 'Activo' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="p-2 hover:bg-surface-container-low rounded-lg transition-colors">
                                        <MoreVertical size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 card-elevation space-y-6">
            <h3 className="font-bold flex items-center gap-2">
                <BarChart3 size={18} className="text-primary" />
                Distribución de Casos
            </h3>
            <div className="space-y-4">
                 {[
                    { label: 'Ansiedad', color: 'bg-primary', width: '65%' },
                    { label: 'Depresión', color: 'bg-secondary', width: '40%' },
                    { label: 'Estrés Académico', color: 'bg-tertiary', width: '85%' },
                    { label: 'Otros', color: 'bg-outline', width: '20%' }
                 ].map(item => (
                    <div key={item.label} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-outline">
                            <span>{item.label}</span>
                            <span>{item.width}</span>
                        </div>
                        <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                            <div className={`h-full ${item.color} rounded-full`} style={{ width: item.width }}></div>
                        </div>
                    </div>
                 ))}
            </div>
            <div className="pt-4 border-t border-outline-variant/20">
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-surface-container-low hover:bg-surface-container-high transition-colors rounded-xl font-bold text-sm text-primary">
                    <Mail size={16} />
                    Enviar Informe Semanal
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

// Need to import Calendar from lucide-react if not locally imported correctly or use CalendarIcon alias
import { Calendar as CalendarIcon } from 'lucide-react';

export default Admin;
