import type { Xp } from './xp'
import type { Fav } from './fav'

export interface User {
    id?: number,
    usuario: string,
    email: string,
    senha?: string,
    data: string,
    logado: boolean,
    like: number[],
    favoritos?: Fav[],
    xp?: Xp[]
}