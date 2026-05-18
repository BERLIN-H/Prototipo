import api from './axios';

export interface Cita {
  id: number;
  date: string;
  type: string;
  mode: string;
  location?: string;
  status: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA';
  notes?: string;
  student: { id: number; name: string; email: string; faculty?: string; semester?: number };
  professional: { id: number; name: string; email: string };
}

export interface Professional {
  id: number;
  name: string;
  email: string;
}

export const citasApi = {
  getAll: (params?: Record<string, string>) =>
    api.get<Cita[]>('/citas', { params }).then(r => r.data),

  getNext: () =>
    api.get<Cita | null>('/citas/next').then(r => r.data),

  getProfessionals: () =>
    api.get<Professional[]>('/citas/professionals').then(r => r.data),

  create: (data: {
    professionalId: number;
    date: string;
    type?: string;
    mode?: string;
    location?: string;
    notes?: string;
  }) => api.post<Cita>('/citas', data).then(r => r.data),

  update: (id: number, data: Partial<Cita & { status: string }>) =>
    api.patch<Cita>(`/citas/${id}`, data).then(r => r.data),

  delete: (id: number) =>
    api.delete(`/citas/${id}`),
};
