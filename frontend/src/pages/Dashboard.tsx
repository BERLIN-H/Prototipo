import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Heart, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { citasApi, Cita } from '../api/citas';
import { notificationsApi, Notification } from '../api/notifications';

const statusColors: Record<string, string> = {
  PENDIENTE: 'bg-yellow-100 text-yellow-800',
  CONFIRMADA: 'bg-green-100 text-green-800',
  CANCELADA: 'bg-red-100 text-red-800',
  COMPLETADA: 'bg-blue-100 text-blue-800',
};

const statusLabels: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  CONFIRMADA: 'Confirmada',
  CANCELADA: 'Cancelada',
  COMPLETADA: 'Completada',
};

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [nextCita, setNextCita] = useState<Cita | null>(null);
  const [recentCitas, setRecentCitas] = useState<Cita[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      citasApi.getNext().catch(() => null),
      citasApi.getAll().catch(() => []),
      notificationsApi.getAll().catch(() => []),
    ]).then(([next, all, notifs]) => {
      setNextCita(next);
      setRecentCitas((all as Cita[]).slice(0, 4));
      setNotifications((notifs as Notification[]).filter(n => !n.read).slice(0, 3));
      setLoading(false);
    });
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-black text-on-surface">
          {greeting}, {user?.name?.split(' ')[0] ?? 'Usuario'} 👋
        </h1>
        <p className="text-on-surface-variant mt-1">Aquí tienes un resumen de tu bienestar.</p>
      </motion.div>

      {/* Próxima cita */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {nextCita ? (
          <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-2xl text-white shadow-lg">
            <div className="flex items-center gap-2 mb-3 opacity-80 text-sm font-bold uppercase tracking-wider">
              <Calendar size={16} /> Próxima cita
            </div>
            <h2 className="text-2xl font-display font-black mb-1">
              {new Date(nextCita.date).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h2>
            <p className="opacity-90 mb-1">
              {new Date(nextCita.date).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })} · {nextCita.mode}
            </p>
            <p className="opacity-80 text-sm">Con {nextCita.professional.name}</p>
            <span className={`mt-3 inline-block px-3 py-1 rounded-full text-xs font-bold ${statusColors[nextCita.status]} text-on-surface`}>
              {statusLabels[nextCita.status]}
            </span>
          </div>
        ) : (
          <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/20 flex items-center justify-between">
            <div>
              <p className="font-bold text-on-surface">No tienes citas próximas</p>
              <p className="text-sm text-on-surface-variant mt-1">Agenda una sesión con un psicólogo.</p>
            </div>
            <button
              onClick={() => navigate('/appointments')}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary/90"
            >
              Agendar <ArrowRight size={16} />
            </button>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Citas recientes */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-on-surface flex items-center gap-2">
              <Clock size={18} className="text-primary" /> Citas recientes
            </h3>
            <button onClick={() => navigate('/appointments')} className="text-sm text-primary font-bold hover:underline">
              Ver todas
            </button>
          </div>
          {recentCitas.length === 0 ? (
            <p className="text-sm text-on-surface-variant text-center py-6">Sin citas registradas aún.</p>
          ) : (
            <div className="space-y-3">
              {recentCitas.map(c => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0">
                  <div>
                    <p className="text-sm font-bold text-on-surface">{c.type}</p>
                    <p className="text-xs text-outline">
                      {new Date(c.date).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })} · {c.professional.name}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${statusColors[c.status]}`}>
                    {statusLabels[c.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Notificaciones no leídas */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-on-surface flex items-center gap-2">
              <AlertCircle size={18} className="text-secondary" /> Notificaciones
            </h3>
            <button onClick={() => navigate('/notifications')} className="text-sm text-primary font-bold hover:underline">
              Ver todas
            </button>
          </div>
          {notifications.length === 0 ? (
            <div className="text-center py-6">
              <Heart size={32} className="text-outline mx-auto mb-2" />
              <p className="text-sm text-on-surface-variant">Todo al día, sin notificaciones nuevas.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map(n => (
                <div key={n.id} className="p-3 bg-surface-container rounded-xl">
                  <p className="text-sm font-bold text-on-surface">{n.title}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{n.message}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
