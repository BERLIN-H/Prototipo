import React from 'react';
import { Bell, Check, Info, AlertTriangle } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    { id: 1, title: 'Cita Confirmada', message: 'Tú cita con la Dra. Elena Rodríguez ha sido confirmada para hoy.', time: 'Hace 30 min', type: 'success', icon: Check },
    { id: 2, title: 'Recordatorio', message: 'No olvides completar tu registro semanal de bienestar.', time: 'Hace 2 horas', type: 'info', icon: Info },
    { id: 3, title: 'Urgente', message: 'Se ha detectado un cambio en tu agenda administrativa.', time: 'Ayer', type: 'warning', icon: AlertTriangle },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Notificaciones</h2>
          <p className="text-on-surface-variant">Mantente al tanto de tus citas y actividades.</p>
        </div>
        <button className="text-primary text-sm font-bold hover:underline">Marcar todas como leídas</button>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="bg-white p-6 rounded-2xl border border-outline-variant/30 card-elevation flex gap-4 transition-all hover:scale-[1.01]">
            <div className={`p-3 rounded-xl h-fit ${
              notification.type === 'success' ? 'bg-secondary/10 text-secondary' :
              notification.type === 'warning' ? 'bg-error/10 text-error' :
              'bg-primary/10 text-primary'
            }`}>
              <notification.icon size={20} />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-on-surface">{notification.title}</h3>
                <span className="text-xs text-outline font-semibold">{notification.time}</span>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">{notification.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
