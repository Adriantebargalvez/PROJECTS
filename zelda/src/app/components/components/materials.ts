export interface materialsApi {
  data: materials[]
}

export interface materials {
  category: string
  common_locations: string[]
  cooking_effect: string
  description: string
  dlc: boolean
  hearts_recovered: number
  id: number
  image: string
  name: string
}
