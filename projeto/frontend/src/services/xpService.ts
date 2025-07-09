import api from './api';
import type { Xp } from '../types/xp';

export const getXp = async (): Promise<Xp[]> => {
  //const resposta = await api.get('/mock/xp.json');
  const resposta = await api.get('/xp/publicas');
  return resposta.data;
};
