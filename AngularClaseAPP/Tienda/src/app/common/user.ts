export interface User{
    uid?: string,
    email: string,
    displayName: string,
    photoURL?: string,
    emailVerified:boolean,
    comentarios?: {displayName: string,comentario: string, fecha: string }[];
    clasificaciones?: { articuloId: string; rating: number }[];
}