import React from 'react';
import { Search, Bell, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  title: string;
}

const TopBar: React.FC<TopBarProps> = ({ title }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <header className="fixed top-0 right-0 w-full md:left-64 md:w-[calc(100%-16rem)] h-16 bg-white/80 backdrop-blur-md flex justify-between items-center px-6 z-40 border-b border-outline-variant/20">
      <div className="flex flex-col">
        <h1 className="font-display text-xl font-bold text-primary">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center bg-surface-container px-4 py-2 rounded-full gap-2">
          <Search size={18} className="text-outline" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent border-none focus:ring-0 text-sm w-48 outline-none"
          />
        </div>
        <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm border-2 border-primary/20">
            {initials}
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-bold text-on-surface leading-tight">{user?.name ?? 'Usuario'}</span>
            <span className="text-[11px] text-outline capitalize">{user?.role?.toLowerCase() ?? ''}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
