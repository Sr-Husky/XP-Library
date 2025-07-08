import api from './api';
import type { User } from '../types/user';

export const getUsers = async (): Promise<User[]> => {
  const resposta = await api.get('/mock/users.json');
  return resposta.data;
};
