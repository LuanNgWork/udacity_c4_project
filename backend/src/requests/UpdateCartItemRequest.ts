/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateCartItemRequest {
  name: string
  description: string
  price: number
  done: boolean
}