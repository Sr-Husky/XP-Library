import type { Fav } from "../types/fav";
import api from "./api";

export const like = async (userId: number, cardId: number) => {
    return await api.post(`/interact/like/${userId}/${cardId}`);
}

export const deslike = async (userId: number, cardId: number, like: number[]) => {
    return await api.post(`/interact/deslike/${userId}/${cardId}`, like);
}

export const favoritar = async (dto: Fav) => {
    return await api.post('/interact/fav', dto);
}

export const desfavoritar = async (id: number) => {
    return await api.delete(`/interact/fav/${id}`);
}