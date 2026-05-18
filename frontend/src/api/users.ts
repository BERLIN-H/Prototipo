import api from './axios';

export interface UserProfile {
  id: number;
  email: string;
  name: string | null;
  role: string;
  phone?: string;
  address?: string;
  faculty?: string;
  semester?: number;
  createdAt: string;
}

export const usersApi = {
  getMe: () => api.get<UserProfile>('/users/me').then(r => r.data),
  updateMe: (data: Partial<UserProfile>) => api.patch<UserProfile>('/users/me', data).then(r => r.data),
};
