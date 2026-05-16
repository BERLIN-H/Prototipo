import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const Agenda = () => {
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Agenda Semanal</h2>
          <p className="text-on-surface-variant">Visualiza y organiza tus sesiones.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-outline-variant/30 shadow-sm">
          <button className="p-2 hover:bg-surface-container-low rounded-lg transition-colors">
            <ChevronLeft size={20} />
          </button>
          <span className="font-bold text-on-surface min-w-[120px] text-center">Mayo 2026</span>
          <button className="p-2 hover:bg-surface-container-low rounded-lg transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-outline-variant/30 card-elevation overflow-hidden min-h-[600px] flex flex-col">
        <div className="grid grid-cols-7 border-b border-outline-variant/20 bg-surface-container-low/30">
          {days.map(day => (
            <div key={day} className="py-4 text-center text-xs font-bold text-outline uppercase tracking-widest">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 flex-grow divide-x divide-y divide-outline-variant/20 border-l border-t border-outline-variant/10">
          {dates.map(date => (
            <div key={date} className={`p-4 min-h-[120px] hover:bg-surface-container-low/20 transition-colors relative group ${date === 15 ? 'bg-secondary/5' : ''}`}>
              <span className={`text-sm font-bold ${date === 15 ? 'text-secondary bg-secondary/10 w-7 h-7 flex items-center justify-center rounded-full' : 'text-on-surface-variant'}`}>
                {date}
              </span>
              
              {date === 15 && (
                <div className="mt-2 p-2 bg-primary text-white rounded-lg text-[10px] font-bold shadow-md shadow-primary/20">
                  <p>14:30 PM - Cita</p>
                  <p className="opacity-80">Dra. Elena R.</p>
                </div>
              )}

              <button className="absolute bottom-2 right-2 p-1 bg-surface-container rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                <Plus size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Agenda;
