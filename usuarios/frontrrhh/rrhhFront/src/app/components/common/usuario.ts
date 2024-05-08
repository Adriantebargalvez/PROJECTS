export class Usuario{
    id: number | undefined;
    nombre: string;
    apellidos: string;
    email: string;
    rol: string;
    accion?: string;
    
  constructor(
    id: number | undefined, 
    nombre: string, 
    apellidos: string, 
    email: string, 
    rol: string, 
    accion?: string
) {
    this.id = id
    this.nombre = nombre
    this.apellidos = apellidos
    this.email = email
    this.rol = rol
    this.accion = accion
  }}