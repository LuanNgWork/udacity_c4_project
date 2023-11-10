import { apiEndpoint } from '../config'
import { CartItem } from '../types/CartItem';
import { CreateCartItemRequest } from '../types/CreateCartItemRequest';
import Axios from 'axios'
import { UpdateCartItemRequest } from '../types/UpdateCartItemRequest';

export async function getCartItems(idToken: string): Promise<CartItem[]> {
  console.log('Fetching cartItems')

  const response = await Axios.get(`${apiEndpoint}/cart-items`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('CartItems:', response.data)
  return response.data.items
}

export async function createCartItem(
  idToken: string,
  newCartItem: CreateCartItemRequest
): Promise<CartItem> {
  const response = await Axios.post(`${apiEndpoint}/cart-items`,  JSON.stringify(newCartItem), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchCartItem(
  idToken: string,
  itemId: string,
  updatedCartItem: UpdateCartItemRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/cart-items/${itemId}`, JSON.stringify(updatedCartItem), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteCartItem(
  idToken: string,
  itemId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/cart-items/${itemId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  itemId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/cart-items/${itemId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
