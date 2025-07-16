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
export const getXpUser = async (busca?: string, tags?: string): Promise<Xp[]> => {
  const token = localStorage.getItem('token');

  const params: any = {};
  if (busca) params.busca = busca;
  if (tags) params.tag = tags;

  const res = await api.get(`/xp/usuario`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


// Chama o serviço de criar experiências
export const criarXp = async (data: Xp) => {
  const token = localStorage.getItem('token');

  return await api.post('/xp/criar', data, {
    headers: {Authorization: `Bearer ${token}`}
  });
}

// Chama o serviço de pegar experiências por id
export const getXp = async (id: number): Promise<Xp | null> => {
  const token = localStorage.getItem('token');

  try {
    const res = await api.get(`/xp/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    return res.data;
  } catch (err) {
    // Pode dar 403 se não for autorizado, retorna null
    return null;
  }
};


// Chama o serviço de atualizar experiência
export const atualizaXp = async (dto: {id: number, texto: string, contexto: string, tags: string[], pub: boolean, likes: number}) => {
  const token = localStorage.getItem('token');

  const res = await api.put('/xp/atualizar', dto, {
    headers: {Authorization: `Bearer ${token}`}
  });

}

// Chama o serviço de remover experiência
export const removeXp = async(id: number) => {
  const token = localStorage.getItem('token');

  return await api.delete(`/xp/remover/${id}`, {
    headers: {Authorization: `Bearer ${token}`}
  });
}
