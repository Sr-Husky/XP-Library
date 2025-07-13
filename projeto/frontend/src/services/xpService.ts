import api from './api';
import type { Xp } from '../types/xp';

// Chama o serviço de pegar experiências publicas
export const getPublicXp = async (busca?: string, tags?: string): Promise<Xp[]> => {
  const params: any = {};
  if (busca) params.busca = busca;
  if (tags) params.tag = tags;

  return (await api.get('/xp/publicas', { params })).data;
}

// Chama o serviço de pegar experiências de um usuário
export const getXpUser = async (id: number, busca?: string, tags?: string): Promise<Xp[]> => {
  const params: any = {};
  if (busca) params.busca = busca;
  if (tags) params.tag = tags;

  return (await api.get(`/xp/usuario/${id}`, { params })).data;
}

// Chama o serviço de criar experiências
export const criarXp = async (data: Xp) => {
  return await api.post('/xp/criar', data);
}

// Chama o serviço de pegar experiências por id
export const getXp = async (id: number): Promise<Xp> => {
  return (await api.get(`/xp/${id}`)).data;
}

// Chama o serviço de atualizar experiência
export const atualizaXp = async (dto: {id: number, texto: string, contexto: string, tags: string[], pub: boolean, likes: number}) => {
  return await api.put('/xp/atualizar', dto);
}

// Chama o serviço de remover experiência
export const removeXp = async(id: number) => {
  return await api.delete(`/xp/remover/${id}`);
}
