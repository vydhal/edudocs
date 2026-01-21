import api from './api';

export interface Link {
  id: number;
  name: string;
  url: string;
  createdAt: string;
}

export const linkService = {
  getAll: async (params?: any) => {
    const response = await api.get('/links', { params });
    return response.data;
  },

  create: async (name: string, url: string) => {
    const response = await api.post<Link>('/links', { name, url });
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/links/${id}`);
  }
};
