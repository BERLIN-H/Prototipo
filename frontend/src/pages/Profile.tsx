import React from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, Shield } from 'lucide-react';

const Profile = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="relative">
        <div className="h-48 w-full bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-lg"></div>
        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl border-4 border-white overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-2 right-2 p-2 bg-white rounded-lg shadow-md text-primary hover:bg-surface-container-low transition-colors">
              <Camera size={18} />
            </button>
          </div>
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-on-surface">Mariana Giraldo</h2>
            <p className="text-on-surface-variant font-medium flex items-center gap-2">
              Estudiante de Ingeniería de Sistemas
              <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
              ID: 202305142
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white p-8 rounded-2xl border border-outline-variant/30 card-elevation space-y-6">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
              <h3 className="text-lg font-bold">Información Personal</h3>
              <button className="text-primary font-bold text-sm flex items-center gap-2 hover:underline">
                <Save size={16} />
                Guardar Cambios
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-outline uppercase tracking-wider">Correo Institucional</label>
                <div className="flex items-center gap-3 bg-surface-container-low p-3 rounded-xl">
                  <Mail size={20} className="text-outline" />
                  <span className="text-sm font-semibold">mariana.g@institucion.edu.co</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-outline uppercase tracking-wider">Teléfono / WhatsApp</label>
                <div className="flex items-center gap-3 bg-surface-container-low p-3 rounded-xl">
                  <Phone size={20} className="text-outline" />
                  <span className="text-sm font-semibold">+57 321 456 7890</span>
                </div>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold text-outline uppercase tracking-wider">Dirección de Residencia</label>
                <div className="flex items-center gap-3 bg-surface-container-low p-3 rounded-xl">
                  <MapPin size={20} className="text-outline" />
                  <span className="text-sm font-semibold">Calle 45 # 12 - 34, Torre 2, Apto 501</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-2xl border border-outline-variant/30 card-elevation space-y-6">
            <h3 className="text-lg font-bold border-b border-outline-variant/20 pb-4">Historial Académico Relevante</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-outline-variant/20 flex justify-between items-center group hover:bg-surface-container-low/30 transition-colors">
                <div>
                  <p className="font-bold">Semestre Actual</p>
                  <p className="text-sm text-on-surface-variant font-medium">5to Semestre</p>
                </div>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">Activa</span>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white p-6 rounded-2xl border border-outline-variant/30 card-elevation space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <Shield size={18} className="text-secondary" />
              Seguridad
            </h3>
            <div className="space-y-4">
              <button className="w-full text-left p-3 rounded-xl hover:bg-surface-container-low transition-colors text-sm font-semibold">Cambiar Contraseña</button>
              <button className="w-full text-left p-3 rounded-xl hover:bg-surface-container-low transition-colors text-sm font-semibold">Autenticación de dos pasos</button>
              <button className="w-full text-left p-3 rounded-xl hover:bg-surface-container-low transition-colors text-sm font-semibold text-error">Eliminar Cuenta</button>
            </div>
          </section>

          <section className="bg-secondary p-6 rounded-2xl shadow-xl space-y-4 text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <h3 className="font-bold">Privacidad del Paciente</h3>
            <p className="text-xs text-white/80 leading-relaxed">Tu información está protegida por la ley de protección de datos personales y secreto profesional médico.</p>
            <button className="text-xs font-bold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
              Leer Consentimiento
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
