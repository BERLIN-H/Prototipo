import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, BookOpen, Save } from 'lucide-react';
import { usersApi, UserProfile } from '../api/users';
import { useAuthStore } from '../store/authStore';

const roleLabels: Record<string, string> = {
  USER: 'Estudiante',
  PSYCHOLOGIST: 'Psicólogo/a',
  ADMIN: 'Administrador',
};

const Profile = () => {
  const { user: authUser, setAuth, token } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '', faculty: '', semester: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    usersApi.getMe().then(p => {
      setProfile(p);
      setForm({
        name: p.name ?? '',
        phone: p.phone ?? '',
        address: p.address ?? '',
        faculty: p.faculty ?? '',
        semester: p.semester ? String(p.semester) : '',
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const updated = await usersApi.updateMe({
        name: form.name || undefined,
        phone: form.phone || undefined,
        address: form.address || undefined,
        faculty: form.faculty || undefined,
        semester: form.semester ? parseInt(form.semester) : undefined,
      });
      setProfile(updated as any);
      // Actualizar el nombre en el store
      if (token) setAuth({ ...authUser!, name: updated.name ?? authUser!.name }, token);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const initials = (profile?.name ?? authUser?.name ?? '?')
    .split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-display font-black text-on-surface">Mi Perfil</h1>
        <p className="text-on-surface-variant mt-1">Administra tu información personal.</p>
      </div>

      {/* Avatar */}
      <div className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm p-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-2xl shrink-0">
          {initials}
        </div>
        <div>
          <h2 className="text-xl font-display font-black text-on-surface">{profile?.name ?? 'Usuario'}</h2>
          <p className="text-on-surface-variant text-sm">{profile?.email}</p>
          <span className="inline-block mt-2 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
            {roleLabels[profile?.role ?? 'USER']}
          </span>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-on-surface">Información personal</h3>

        {error && <p className="text-sm text-error font-bold bg-error/10 px-4 py-2 rounded-lg">{error}</p>}
        {saved && <p className="text-sm text-green-700 font-bold bg-green-50 px-4 py-2 rounded-lg">✅ Cambios guardados correctamente</p>}

        <div className="space-y-3">
          <div>
            <label className="text-sm font-bold text-on-surface-variant flex items-center gap-1.5 mb-1">
              <User size={14} /> Nombre completo
            </label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-surface-container border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
          </div>

          <div>
            <label className="text-sm font-bold text-on-surface-variant flex items-center gap-1.5 mb-1">
              <Mail size={14} /> Correo electrónico
            </label>
            <input value={profile?.email ?? ''} disabled
              className="w-full bg-surface-container/50 border-none rounded-lg px-4 py-3 text-sm text-outline cursor-not-allowed" />
          </div>

          <div>
            <label className="text-sm font-bold text-on-surface-variant flex items-center gap-1.5 mb-1">
              <Phone size={14} /> Teléfono
            </label>
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="+57 300 000 0000"
              className="w-full bg-surface-container border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
          </div>

          <div>
            <label className="text-sm font-bold text-on-surface-variant flex items-center gap-1.5 mb-1">
              <MapPin size={14} /> Dirección
            </label>
            <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              placeholder="Calle 123 # 45-67"
              className="w-full bg-surface-container border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
          </div>

          {authUser?.role === 'USER' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-bold text-on-surface-variant flex items-center gap-1.5 mb-1">
                  <BookOpen size={14} /> Facultad
                </label>
                <input value={form.faculty} onChange={e => setForm(f => ({ ...f, faculty: e.target.value }))}
                  placeholder="Ingeniería de Sistemas"
                  className="w-full bg-surface-container border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="text-sm font-bold text-on-surface-variant block mb-1">Semestre</label>
                <input type="number" min="1" max="12" value={form.semester}
                  onChange={e => setForm(f => ({ ...f, semester: e.target.value }))}
                  className="w-full bg-surface-container border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
              </div>
            </div>
          )}
        </div>

        <div className="pt-2">
          <p className="text-xs text-outline mb-3">
            Miembro desde {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
          </p>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 disabled:opacity-60 transition-colors">
            <Save size={18} /> {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
