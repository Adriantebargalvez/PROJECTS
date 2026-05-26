export interface equipamentApi {
  data: equipament[]
}

export interface equipament {
  category: string
  common_locations?: string[]
  description: string
  dlc: boolean
  id: number
  image: string
  name: string
  properties: Properties
}

export interface Properties {
  attack?: number
  defense?: number
}
