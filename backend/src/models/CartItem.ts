export interface CartItem {
  userId: string
  itemId: string
  createdAt: string
  name: string
  description: string
  price: number
  done: boolean
  imageUrl?: string
}
