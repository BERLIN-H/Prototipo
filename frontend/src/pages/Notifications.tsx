import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { notificationsApi, Notification } from '../api/notifications';

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  INFO:    { icon: Info,          color: 'text-blue-600',  bg: 'bg-blue-50'  },
  SUCCESS: { icon: CheckCircle,   color: 'text-green-600', bg: 'bg-green-50' },
  WARNING: { icon: AlertTriangle, color: 'text-yellow-600',bg: 'bg-yellow-50'},
  ERROR:   { icon: XCircle,       color: 'text-red-600',   bg: 'bg-red-50'   },
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const data = await notificationsApi.getAll().catch(() => []);
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleMarkAllRead = async () => {
    await notificationsApi.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleMarkOne = async (id: number) => {
    await notificationsApi.markOneRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-black text-on-surface">Notificaciones</h1>
          <p className="text-on-surface-variant mt-1">
            {unread > 0 ? `${unread} sin leer` : 'Todo al día'}
          </p>
        </div>
        {unread > 0 && (
          <button onClick={handleMarkAllRead}
            className="flex items-center gap-2 text-sm font-bold text-primary hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors">
            <CheckCheck size={18} /> Marcar todas
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell size={48} className="mx-auto mb-3 text-outline opacity-30" />
          <p className="font-bold text-on-surface-variant">Sin notificaciones aún</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => {
            const cfg = typeConfig[n.type] ?? typeConfig.INFO;
            const Icon = cfg.icon;
            return (
              <motion.div key={n.id} layout
                className={`p-4 rounded-2xl border transition-all cursor-pointer
                  ${n.read ? 'bg-white border-outline-variant/20' : `${cfg.bg} border-transparent shadow-sm`}`}
                onClick={() => !n.read && handleMarkOne(n.id)}>
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-xl ${cfg.bg} shrink-0`}>
                    <Icon size={20} className={cfg.color} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`font-bold text-sm ${n.read ? 'text-on-surface-variant' : 'text-on-surface'}`}>{n.title}</p>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                    </div>
                    <p className="text-sm text-on-surface-variant mt-0.5">{n.message}</p>
                    <p className="text-xs text-outline mt-1">
                      {new Date(n.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
