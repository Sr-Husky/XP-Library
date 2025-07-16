import type { Fav } from "../types/fav";
import api from "./api";

// Chama o serviço de adicionar likes
export const like = async (cardId: number) => {
    const token = localStorage.getItem('token');
    return await api.post(`/interact/like/${cardId}`, null, {
        headers: {Authorization: `Bearer ${token}`}
    });
}

// Chama o serviço de remover likes
export const deslike = async (cardId: number, like: number[]) => {
    const token = localStorage.getItem('token');
    return await api.post(`/interact/deslike/${cardId}`, like, {
        headers: {Authorization: `Bearer ${token}`}
    });
}

// Chama o serviço de favoritar
export const favoritar = async (dto: Fav) => {
    const token = localStorage.getItem('token');
    return await api.post('/interact/fav', dto, {
        headers: {Authorization: `Bearer ${token}`}
    });
}

// Chama o serviço de desfavoritar
export const desfavoritar = async (dto: Fav) => {
    const token = localStorage.getItem('token');
    return await api.post(`/interact/desfav`, dto, {
        headers: {Authorization: `Bearer ${token}`}
    });
}