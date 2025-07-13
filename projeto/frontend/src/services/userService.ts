import api from './api';
import type { User } from '../types/user';
import { isAxiosError } from 'axios';

// Chama serviço para coletar usuário pelo id
export const getUser = async (id: number): Promise<User> => {
  const resposta = await api.get(`/user/${id}`);
  return resposta.data;
};

// Chama serviço para logar 
export const userLogin = async (email: string, senha: string) => {
  try{
    const res = await api.post('/user/login', {email,senha});
    return res.data; // Retorna o objeto do usuário
  } catch(err){
    if(isAxiosError(err)) return err.response?.status; // Retorna o número do erro
    return null; // retorna null para outros erros
  }
}

// Chama serviço para deslogar
export const deslogar = async (id: number) => {
  return api.post(`/user/logout/${id}`);
}

// Chama serviço para cadastrar usuário
export const userCad = async (dto: User) => {
  try {
    return await api.post('/user/cadastro', dto);
  } catch(err){
    if(isAxiosError(err)) return err.response?.status; // Retorna o número do erro
    else return null; // retorna null para outros erros
  }
}