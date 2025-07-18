import type { Xp } from './xp'
import type { Fav } from './fav'

export interface User {
    id?: number,
    role?: string,
    usuario: string,
    email: string,
    senha?: string,
    data: string,
    logado: boolean,
    like: number[],
    favoritos?: Fav[],
    xp?: Xp[],
}