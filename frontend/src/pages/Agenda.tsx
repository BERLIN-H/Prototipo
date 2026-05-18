import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { citasApi, Cita } from '../api/citas';

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

const statusColors: Record<string, string> = {
  PENDIENTE: 'bg-yellow-400',
  CONFIRMADA: 'bg-green-500',
  CANCELADA: 'bg-red-400',
  COMPLETADA: 'bg-blue-400',
};

const Agenda = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [today] = useState(new Date());
  const [current, setCurrent] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    citasApi.getAll().then(setCitas).catch(() => {});
  }, []);

  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const citasForDay = (day: number) => {
    return citas.filter(c => {
      const d = new Date(c.date);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  };

  const selectedCitas = selectedDay ? citasForDay(selectedDay) : [];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-display font-black text-on-surface">Agenda</h1>
        <p className="text-on-surface-variant mt-1">Vista de calendario de tus citas.</p>
      </div>

      <div className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm p-6">
        {/* Header del calendario */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setCurrent(new Date(year, month - 1, 1))}
            className="p-2 hover:bg-surface-container rounded-lg transition-colors">
            <ChevronLeft size={20} />
          </button>
          <h2 className="font-display font-bold text-xl text-on-surface">
            {MONTHS[month]} {year}
          </h2>
          <button onClick={() => setCurrent(new Date(year, month + 1, 1))}
            className="p-2 hover:bg-surface-container rounded-lg transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Cabecera días */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs font-bold text-outline py-2">{d}</div>
          ))}
        </div>

        {/* Grilla */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const daysCitas = citasForDay(day);
            const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
            const isSelected = selectedDay === day;

            return (
              <button key={day} onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                className={`relative aspect-square flex flex-col items-center justify-start pt-1.5 rounded-xl text-sm font-bold transition-all
                  ${isSelected ? 'bg-primary text-white' : isToday ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container text-on-surface'}`}>
                {day}
                {daysCitas.length > 0 && (
                  <div className="flex gap-0.5 mt-1">
                    {daysCitas.slice(0, 3).map(c => (
                      <span key={c.id} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : statusColors[c.status]}`} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Leyenda */}
        <div className="flex gap-4 mt-4 flex-wrap">
          {Object.entries(statusColors).map(([s, color]) => (
            <div key={s} className="flex items-center gap-1.5 text-xs text-on-surface-variant">
              <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </div>
          ))}
        </div>
      </div>

      {/* Citas del día seleccionado */}
      {selectedDay && (
        <div className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm p-6">
          <h3 className="font-display font-bold text-lg text-on-surface mb-4">
            Citas del {selectedDay} de {MONTHS[month]}
          </h3>
          {selectedCitas.length === 0 ? (
            <p className="text-sm text-on-surface-variant text-center py-4">Sin citas para este día.</p>
          ) : (
            <div className="space-y-3">
              {selectedCitas.map(c => (
                <div key={c.id} className="flex items-center gap-4 p-4 bg-surface-container rounded-xl">
                  <span className={`w-3 h-3 rounded-full shrink-0 ${statusColors[c.status]}`} />
                  <div className="flex-grow">
                    <p className="font-bold text-on-surface text-sm">{c.type}</p>
                    <p className="text-xs text-outline">
                      {new Date(c.date).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })} · {c.mode} · {c.professional.name}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold
                    ${c.status === 'CONFIRMADA' ? 'bg-green-100 text-green-800' :
                      c.status === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                      c.status === 'CANCELADA' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                    {c.status.charAt(0) + c.status.slice(1).toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Agenda;
