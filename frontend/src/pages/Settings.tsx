import React from 'react';
import { Settings as SettingsIcon, Bell, Lock, Eye, Globe, Moon } from 'lucide-react';

const Settings = () => {
  const sections = [
    { title: 'Notificaciones', icon: Bell, description: 'Gestiona cómo recibes las alertas de tus citas.' },
    { title: 'Privacidad y Seguridad', icon: Lock, description: 'Controla tu contraseña y la visibilidad de tu perfil.' },
    { title: 'Apariencia', icon: Moon, description: 'Personaliza el tema y los colores de la plataforma.' },
    { title: 'Idioma', icon: Globe, description: 'Selecciona tu idioma de preferencia.' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-on-surface">Configuración</h2>
        <p className="text-on-surface-variant">Personaliza tu experiencia en Equilibria.</p>
      </div>

      <div className="bg-white rounded-2xl border border-outline-variant/30 card-elevation overflow-hidden divide-y divide-outline-variant/20">
        {sections.map((section) => (
          <div key={section.title} className="p-6 hover:bg-surface-container-low/30 transition-colors cursor-pointer flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-surface-container-low rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <section.icon size={20} />
              </div>
              <div>
                <h3 className="font-bold text-on-surface">{section.title}</h3>
                <p className="text-sm text-outline font-medium">{section.description}</p>
              </div>
            </div>
            <button className="p-2 text-outline hover:text-primary">
               <SettingsIcon size={18} />
            </button>
          </div>
        ))}
      </div>

      <section className="bg-surface-container-low/50 p-8 rounded-2xl border border-dashed border-outline-variant/50 space-y-4">
        <h3 className="font-bold text-on-surface flex items-center gap-2">
            <Eye size={18} className="text-primary" />
            Accesibilidad
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-outline-variant/20">
                <span className="text-sm font-semibold">Modo de alto contraste</span>
                <div className="w-10 h-5 bg-outline-variant rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-outline-variant/20">
                <span className="text-sm font-semibold">Texto enriquecido</span>
                <div className="w-10 h-5 bg-secondary rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;
