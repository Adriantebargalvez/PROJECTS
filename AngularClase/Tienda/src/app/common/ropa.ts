
export type Root = Root2[]

export interface Root2 {
  rating: number
  _id: string
  name: string
  price: number
  tallasDisponibles: string[]
  tallasDisponiblesZapato: string[]
  favorite: boolean
  oferta: number
  category: string
  imagen: string
  __v: number
  descripcion:String;
  
}
