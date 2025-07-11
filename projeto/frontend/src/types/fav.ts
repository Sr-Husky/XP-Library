export interface Fav {
    id?: number,
    id_user: number,
    autor: string,
    autorId: number,
    texto: string,
    contexto: string,
    tags: string[],
    dataFav?: string,
    data: string,
    likes: number
}