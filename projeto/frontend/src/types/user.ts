import type { Xp } from './xp'

export interface User {
    id: number,
    usuario: string,
    email: string,
    senha: string,
    data: string,
    logado: boolean,
    like: number[],
    favoritos: Xp[]
}