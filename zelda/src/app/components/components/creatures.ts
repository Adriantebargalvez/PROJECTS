export interface creaturesApi {
  data: creatures[]
}

export interface creatures {
  category: string
  common_locations?: string[]
  cooking_effect?: string
  description: string
  dlc: boolean
  edible: boolean
  hearts_recovered?: number
  id: number
  image: string
  name: string
  drops?: string[]
}

