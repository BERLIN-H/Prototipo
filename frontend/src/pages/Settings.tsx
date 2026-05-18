import React, { useState } from 'react';
import { Lock, Save } from 'lucide-react';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const handlePasswordChange = async () => {
    if (passwords.next !== passwords.confirm) {
      setMsg({ type: 'err', text: 'Las contraseñas nuevas no coinciden' });
      return;
    }
    if (passwords.next.length < 6) {
      setMsg({ type: 'err', text: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      await api.patch('/users/me/password', { currentPassword: passwords.current, newPassword: passwords.next });
      setMsg({ type: 'ok', text: 'Contraseña actualizada. Por seguridad, vuelve a iniciar sesión.' });
      setPasswords({ current: '', next: '', confirm: '' });
      setTimeout(() => { logout(); navigate('/'); }, 2500);
    } catch (e: any) {
      setMsg({ type: 'err', text: e.response?.data?.error || 'Error al cambiar la contraseña' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-display font-black text-on-surface">Configuración</h1>
        <p className="text-on-surface-variant mt-1">Ajustes de seguridad de tu cuenta.</p>
      </div>

      <div className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-on-surface flex items-center gap-2"><Lock size={18} /> Cambiar contraseña</h3>

        {msg && (
          <p className={`text-sm font-bold px-4 py-2 rounded-lg ${msg.type === 'ok' ? 'bg-green-50 text-green-700' : 'bg-error/10 text-error'}`}>
            {msg.text}
          </p>
        )}

        <div className="space-y-3">
          {[
            { label: 'Contraseña actual', key: 'current' },
            { label: 'Nueva contraseña', key: 'next' },
            { label: 'Confirmar nueva contraseña', key: 'confirm' },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="text-sm font-bold text-on-surface-variant block mb-1">{label}</label>
              <input type="password" value={passwords[key as keyof typeof passwords]}
                onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                className="w-full bg-surface-container border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
            </div>
          ))}
        </div>

        <button onClick={handlePasswordChange} disabled={saving}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 disabled:opacity-60 transition-colors">
          <Save size={18} /> {saving ? 'Guardando...' : 'Actualizar contraseña'}
        </button>
      </div>
    </div>
  );
};

export default Settings;
