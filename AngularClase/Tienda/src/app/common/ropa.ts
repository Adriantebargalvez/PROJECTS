
export type Root = Root2[]

export interface Root2 {
  
  _id: string
  name: string
  price: number
  tallasDisponibles: string[]
  tallasDisponiblesZapato: string[]
  favorite: boolean
  oferta: number
  category: string
  imagen: string
  imagenLado: string
  imagenDetras: string
  __v: number
  descripcion:string
  rating: number
  isHot: boolean; // Nueva propiedad para indicar si es "Hot"
}
