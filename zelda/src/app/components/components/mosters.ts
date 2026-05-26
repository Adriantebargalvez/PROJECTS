export interface monsterApi {
  data: monster[]
}

export interface monster {
  category: string
  common_locations?: string[]
  description: string
  dlc: boolean
  drops?: string[]
  id: number
  image: string
  name: string
}
