import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Bell, TrendingUp, ArrowRight, Brain, Heart, Sparkles, AlertCircle } from 'lucide-react';
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

const quickTips = [
  { icon: Brain, title: 'Respiración consciente', description: '5 minutos de ejercicios de respiración pueden reducir la ansiedad significativamente.' },
  { icon: Heart, title: 'Autocuidado', description: 'Reserva tiempo cada día para actividades que disfrutes y te recarguen.' },
  { icon: Sparkles, title: 'Metas pequeñas', description: 'Divide tus objetivos en pasos manejables. Cada logro cuenta.' },
];

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
        <p className="text-on-surface-variant mt-1">Tu bienestar es nuestra prioridad.</p>
      </motion.div>

      {/* Próxima cita */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {nextCita ? (
          <div className="bg-gradient-to-br from-primary to-primary/80 p-6 rounded-2xl text-white shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">Próxima cita</p>
                <h2 className="text-xl font-bold mt-1">{nextCita.type}</h2>
                <p className="text-sm opacity-80 mt-1">con {nextCita.professional.name}</p>
              </div>
              <Calendar size={40} className="opacity-50" />
            </div>
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span className="text-sm">
                  {new Date(nextCita.date).toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span className="text-sm">
                  {new Date(nextCita.date).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${statusColors[nextCita.status]}`}>
                {statusLabels[nextCita.status]}
              </span>
            </div>
            <button
              onClick={() => navigate('/appointments')}
              className="inline-flex items-center gap-2 mt-4 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              Ver detalles <ArrowRight size={16} />
            </button>
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-on-surface-variant">Sesiones completadas</p>
              <p className="text-3xl font-bold text-on-surface mt-1">
                {recentCitas.filter(c => c.status === 'COMPLETADA').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <TrendingUp size={24} className="text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-on-surface-variant">Citas programadas</p>
              <p className="text-3xl font-bold text-on-surface mt-1">
                {recentCitas.filter(c => c.status === 'PENDIENTE' || c.status === 'CONFIRMADA').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar size={24} className="text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-on-surface-variant">Notificaciones</p>
              <p className="text-3xl font-bold text-on-surface mt-1">{notifications.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Bell size={24} className="text-yellow-600" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Citas recientes */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
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

      {/* Consejos de bienestar */}
      <div>
        <h2 className="text-xl font-display font-bold text-on-surface mb-4">Consejos de bienestar</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickTips.map((tip, index) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm p-5"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <tip.icon size={20} className="text-primary" />
              </div>
              <h3 className="font-bold text-on-surface">{tip.title}</h3>
              <p className="text-sm text-on-surface-variant mt-1">{tip.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/appointments')}
          className="bg-primary text-white rounded-2xl p-6 hover:bg-primary/90 transition-colors group text-left"
        >
          <Calendar size={24} className="mb-3" />
          <h3 className="font-bold">Agendar cita</h3>
          <p className="text-sm opacity-80 mt-1">Reserva una sesión con un profesional</p>
          <ArrowRight size={20} className="mt-3 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => navigate('/urgent-help')}
          className="bg-red-500 text-white rounded-2xl p-6 hover:bg-red-600 transition-colors group text-left"
        >
          <Bell size={24} className="mb-3" />
          <h3 className="font-bold">Ayuda urgente</h3>
          <p className="text-sm opacity-80 mt-1">Acceso inmediato a recursos de crisis</p>
          <ArrowRight size={20} className="mt-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
