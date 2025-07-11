import type { User } from "./user";

export interface Xp {
    id?: number,
    id_user: number,
    user?: User,
    texto: string,
    contexto: string,
    tags: string[],
    data: string,
    mod: string,
    pub: boolean,
    likes: number
}