import type { Fav } from "../types/fav";
import api from "./api";

// Chama o serviço de adicionar likes
export const like = async (userId: number, cardId: number) => {
    return await api.post(`/interact/like/${userId}/${cardId}`);
}

// Chama o serviço de remover likes
export const deslike = async (userId: number, cardId: number, like: number[]) => {
    return await api.post(`/interact/deslike/${userId}/${cardId}`, like);
}

// Chama o serviço de favoritar
export const favoritar = async (dto: Fav) => {
    return await api.post('/interact/fav', dto);
}

// Chama o serviço de desfavoritar
export const desfavoritar = async (id: number) => {
    return await api.delete(`/interact/fav/${id}`);
}