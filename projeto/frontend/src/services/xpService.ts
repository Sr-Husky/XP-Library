import api from './api';
import type { Xp } from '../types/xp';

export const getXp = async (): Promise<Xp[]> => {
  const resposta = await api.get('/mock/xp.json');
  return resposta.data;
};
