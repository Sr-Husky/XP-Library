import api from './api';
import type { User } from '../types/user';
import { isAxiosError } from 'axios';

export const getUser = async (id: number): Promise<User> => {
  const resposta = await api.get(`/user/${id}`);
  return resposta.data;
};

export const userLogin = async (email: string, senha: string) => {
  try{
    const res = await api.post('/user/login', {email,senha});
    return res.data;
  } catch(err){
    if(isAxiosError(err)) return err.response?.status;
    return null;
  }
}
