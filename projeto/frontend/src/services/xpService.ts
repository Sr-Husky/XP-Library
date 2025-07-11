import api from './api';
import type { Xp } from '../types/xp';

export const getPublicXp = async (): Promise<Xp[]> => {
  return (await api.get('/xp/publicas')).data;
}

export const criarXp = async (data: Xp) => {
  return await api.post('/xp/criar', data);
}

export const getXp = async (id: number): Promise<Xp> => {
  return (await api.get(`/xp/${id}`)).data;
}

export const atualizaXp = async (dto: {id: number, texto: string, contexto: string, tags: string[], pub: boolean, likes: number}) => {
  return await api.put('/xp/atualizar', dto);
}

export const removeXp = async(id: number) => {
  return await api.delete(`/xp/remover/${id}`);
}
