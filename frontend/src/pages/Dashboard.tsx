import React from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  PlusCircle, 
  MessageSquare, 
  TrendingUp, 
  ShieldCheck,
  Video
} from 'lucide-react';
import { motion } from 'motion/react';

const Dashboard = () => {
  const nextAppointment = {
    date: '15 de Mayo, 2026',
    time: '14:30 PM',
    professional: 'Dra. Elena Rodríguez',
    type: 'Sesión de Seguimiento',
    mode: 'Presencial - Consultorio 302'
  };

  const recentActivities = [
    { id: 1, title: 'Prueba de estrés completada', date: 'Ayer', icon: TrendingUp, color: 'text-secondary' },
    { id: 2, title: 'Resumen de sesión disponible', date: '12 May', icon: MessageSquare, color: 'text-primary' },
    { id: 3, title: 'Cita programada', date: '10 May', icon: Calendar, color: 'text-primary' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">¡Hola, Mariana! 👋</h2>
          <p className="text-on-surface-variant">Bienvenida de nuevo a tu espacio de equilibrio y bienestar.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all w-fit">
          <PlusCircle size={20} />
          <span>Nueva Cita</span>
        </button>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Next Appointment Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-gradient-to-br from-primary to-primary-container p-1 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-white/5 backdrop-blur-sm p-8 flex flex-col md:flex-row gap-8">
            <div className="flex-grow space-y-6">
              <div className="flex items-center gap-2">
                <span className="bg-secondary/20 text-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Próxima Cita</span>
              </div>
              
              <div>
                <h3 className="text-3xl font-display font-bold text-white mb-2">{nextAppointment.professional}</h3>
                <p className="text-on-primary-container/80 font-medium">{nextAppointment.type}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-white/90 bg-white/10 p-3 rounded-xl border border-white/10">
                  <Calendar size={20} className="text-secondary-container" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-white/50 tracking-widest">Fecha</p>
                    <p className="font-semibold">{nextAppointment.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white/90 bg-white/10 p-3 rounded-xl border border-white/10">
                  <Clock size={20} className="text-secondary-container" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-white/50 tracking-widest">Hora</p>
                    <p className="font-semibold">{nextAppointment.time}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-white/80 pt-2 font-medium">
                <Video size={18} className="text-secondary-container" />
                <span>{nextAppointment.mode}</span>
              </div>
            </div>

            <div className="flex flex-col justify-between items-center md:items-end gap-6 border-t md:border-t-0 md:border-l border-white/10 md:pl-8 pt-6 md:pt-0">
              <div className="w-24 h-24 rounded-full border-4 border-secondary-container/30 overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1559839734-2b71f153678e?q=80&w=200&h=200&auto=format&fit=crop" 
                  alt="Doctor" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="bg-white text-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-surface-container-low transition-colors w-full md:w-auto justify-center">
                <span>Gestionar</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats / Feedback */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-2xl border border-outline-variant/30 flex flex-col justify-between card-elevation"
        >
          <div>
            <h3 className="text-lg font-bold text-on-surface mb-2">Estado de Salud Mental</h3>
            <p className="text-on-surface-variant text-sm mb-6">Basado en tus registros semanales.</p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span>Progreso General</span>
                  <span className="text-secondary">72%</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-[72%] rounded-full shadow-sm"></div>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-secondary-container/20 p-4 rounded-xl border border-secondary/10">
                <ShieldCheck className="text-secondary shrink-0" size={24} />
                <div>
                  <p className="text-sm font-bold text-secondary">Vas por buen camino</p>
                  <p className="text-xs text-on-surface-variant/80 mt-1 leading-relaxed">Has completado 4 de tus 5 objetivos de bienestar propuestos el lunes.</p>
                </div>
              </div>
            </div>
          </div>

          <button className="mt-8 text-primary font-bold text-sm flex items-center gap-2 hover:underline">
            Ver informes detallados
            <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <section className="bg-white p-6 rounded-2xl border border-outline-variant/30 card-elevation space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <h3 className="font-bold flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" />
              Actividad Reciente
            </h3>
            <span className="text-xs text-outline font-semibold">Ver todo</span>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 group cursor-pointer">
                <div className={`p-2 rounded-lg bg-surface-container-low group-hover:bg-surface-container-high transition-colors ${activity.color}`}>
                  <activity.icon size={18} />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-semibold text-on-surface line-clamp-1">{activity.title}</p>
                  <p className="text-xs text-outline">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-outline-variant/30 card-elevation space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <h3 className="font-bold flex items-center gap-2">
              <MessageSquare size={18} className="text-primary" />
              Recursos de Apoyo
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div className="p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl hover:border-secondary transition-colors cursor-pointer group">
              <p className="text-sm font-bold group-hover:text-secondary transition-colors">Técnicas de Respiración</p>
              <p className="text-xs text-outline mt-1">Video • 5 min</p>
            </div>
            <div className="p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl hover:border-secondary transition-colors cursor-pointer group">
              <p className="text-sm font-bold group-hover:text-secondary transition-colors">Guía de Mindfulness</p>
              <p className="text-xs text-outline mt-1">PDF • 12 pág</p>
            </div>
            <div className="p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl hover:border-secondary transition-colors cursor-pointer group">
              <p className="text-sm font-bold group-hover:text-secondary transition-colors">Podcast: Ansiedad en Exámenes</p>
              <p className="text-xs text-outline mt-1">Audio • 15 min</p>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-outline-variant/30 card-elevation space-y-4 relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-colors"></div>
          <h3 className="font-bold">Noticias Institucionales</h3>
          <div className="bg-surface-container-low p-4 rounded-xl space-y-2 border border-outline-variant/10 relative">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest bg-secondary-container/40 px-2 py-0.5 rounded">Nuevo</span>
            <p className="text-sm font-bold text-on-surface">Semana del Bienestar Estudiantil</p>
            <p className="text-xs text-on-surface-variant leading-relaxed">Únete a los talleres presenciales y virtuales del 20 al 25 de Mayo.</p>
            <button className="text-xs font-bold text-secondary underline pt-2">Registrarse ahora</button>
          </div>
          <div className="pt-2 text-center">
            <p className="text-[10px] text-outline font-medium tracking-wide">Actualizado hace 2 horas</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
