import React from 'react';
import { Phone, MessageCircle, ShieldAlert, Heart, ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

const UrgentHelp = () => {
  const navigate = useNavigate();

  const resources = [
    { 
      title: 'Línea de Vida Nacional', 
      phone: '106', 
      description: 'Atención psicológica gratuita las 24 horas del día.',
      icon: Phone,
      color: 'bg-primary'
    },
    { 
      title: 'Chat de Apoyo Institucional', 
      phone: '+57 300 000 0000', 
      description: 'Chatea con un orientador de Bienestar Universitario.',
      icon: MessageCircle,
      color: 'bg-secondary'
    },
    { 
      title: 'Emergencias Generales', 
      phone: '123', 
      description: 'Línea única de atención de emergencias en Colombia.',
      icon: ShieldAlert,
      color: 'bg-error'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-outline hover:text-primary transition-colors mb-8 font-bold text-sm"
      >
        <ArrowLeft size={18} />
        Regresar al panel
      </motion.button>

      <header className="text-center mb-12 space-y-4">
        <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <ShieldAlert size={48} />
        </div>
        <h1 className="text-4xl font-display font-black text-on-surface tracking-tight">Centro de Ayuda Urgente</h1>
        <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
          Si te encuentras en una situación de crisis o necesitas apoyo emocional inmediato, no estás solo. Utiliza cualquiera de los siguientes recursos.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <Phone size={20} className="text-error" />
            Líneas de Atención Directa
          </h2>
          <div className="space-y-4">
            {resources.map((resource) => (
              <motion.div 
                key={resource.title}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-xl flex items-center gap-6"
              >
                <div className={`p-4 rounded-xl text-white ${resource.color}`}>
                  <resource.icon size={24} />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-on-surface">{resource.title}</h3>
                  <p className="text-2xl font-black text-primary mt-1 tracking-tight">{resource.phone}</p>
                  <p className="text-xs text-outline mt-1 font-medium">{resource.description}</p>
                </div>
                <button className="p-3 bg-surface-container-low rounded-full text-primary hover:bg-primary hover:text-white transition-all">
                  <ExternalLink size={20} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <Heart size={20} className="text-secondary" />
            Guía de Primeros Auxilios Psicológicos
          </h2>
          <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-8 space-y-6">
            <p className="text-sm font-semibold text-secondary-container bg-secondary px-4 py-1 rounded-full w-fit">¿Qué hacer ahora?</p>
            <ol className="space-y-6">
              {[
                { step: '1', text: 'Respira profundo', desc: 'Inhala por 4 segundos, mantén 4 y exhala por 4.' },
                { step: '2', text: 'Busca un lugar seguro', desc: 'Aléjate de situaciones estresantes si es posible.' },
                { step: '3', text: 'Contacta a alguien de confianza', desc: 'No pases por esto solo, llama a un amigo o familiar.' },
                { step: '4', text: 'Espera la ayuda profesional', desc: 'Ya has dado el primer paso al entrar aquí.' }
              ].map((item) => (
                <li key={item.step} className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold shrink-0">{item.step}</span>
                  <div>
                    <h4 className="font-bold text-on-surface">{item.text}</h4>
                    <p className="text-sm text-on-surface-variant">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <footer className="mt-16 text-center pt-8 border-t border-outline-variant/30">
        <p className="text-sm font-bold text-outline uppercase tracking-widest">Equilibria • Servicio Institucional de Bienestar</p>
      </footer>
    </div>
  );
};

export default UrgentHelp;
