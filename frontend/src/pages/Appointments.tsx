import React from 'react';
import { Calendar as CalendarIcon, Clock, User, Filter, Search, PlusCircle } from 'lucide-react';

const Appointments = () => {
  const appointments = [
    { id: 1, professional: 'Dra. Elena Rodríguez', date: 'Hoy, 15 May', time: '14:30 PM', status: 'Confirmada', type: 'Seguimiento' },
    { id: 2, professional: 'Psic. Carlos Méndez', date: 'Mié, 22 May', time: '10:00 AM', status: 'Pendiente', type: 'Evaluación' },
    { id: 3, professional: 'Dra. Elena Rodríguez', date: 'Lun, 29 May', time: '16:00 PM', status: 'Confirmada', type: 'Seguimiento' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Mis Citas</h2>
          <p className="text-on-surface-variant">Gestiona tus sesiones y consultas psicológicas.</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2">
          <PlusCircle size={20} />
          <span>Agendar Nueva</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-outline-variant/30 card-elevation overflow-hidden">
        <div className="p-4 border-b border-outline-variant/20 flex flex-col md:flex-row gap-4 justify-between bg-surface-container-low/30">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-outline-variant/30 flex-grow max-w-md">
            <Search size={18} className="text-outline" />
            <input type="text" placeholder="Buscar por profesional o fecha..." className="bg-transparent border-none focus:ring-0 text-sm w-full" />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant/30 text-sm font-semibold hover:bg-surface-container-low transition-colors">
              <Filter size={18} />
              <span>Filtrar</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50 text-outline text-[12px] uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Profesional</th>
                <th className="px-6 py-4">Servicio</th>
                <th className="px-6 py-4">Fecha y Hora</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {appointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-surface-container-low/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
                        <User size={16} />
                      </div>
                      <span className="font-semibold text-on-surface">{appt.professional}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant font-medium">{appt.type}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-primary flex items-center gap-1">
                        <CalendarIcon size={14} />
                        {appt.date}
                      </span>
                      <span className="text-xs text-outline flex items-center gap-1 font-semibold">
                        <Clock size={14} />
                        {appt.time}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full ${
                      appt.status === 'Confirmada' 
                        ? 'bg-secondary/10 text-secondary' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-primary font-bold text-sm hover:underline">Ver Detalles</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
