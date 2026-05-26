export interface treasureApi {
  data: treasure[]
}

export interface treasure {
  category: string
  common_locations: string[]
  description: string
  dlc: boolean
  drops: string[]
  id: number
  image: string
  name: string
}
