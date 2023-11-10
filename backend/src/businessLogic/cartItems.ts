import { cartItemAccess } from '../dataLayer/cartItemAccess'
import { CartItem } from '../models/CartItem'
import { CreateCartItemRequest } from '../requests/CreateCartItemRequest'
import { UpdateCartItemRequest } from '../requests/UpdateCartItemRequest'
import {CartUpdate} from "../models/CartUpdate";
import {parseUserId} from "../auth/utils";
import * as uuid from 'uuid'

const cartAccess = new cartItemAccess();

export async function getAllCartItems(jwtToken: string): Promise<CartItem[]> {
    const userId = parseUserId(jwtToken);
    return cartAccess.getAllCartItems(userId);
}

export function createCartItem(createCartItemRequest: CreateCartItemRequest, jwtToken: string): Promise<CartItem> {
    const userId = parseUserId(jwtToken);
    const itemId =  uuid.v4();
    const s3BucketName = process.env.S3_BUCKET_NAME;
    
    return cartAccess.createCartItem({
        userId: userId,
        itemId: itemId,
        imageUrl:  `https://${s3BucketName}.s3.amazonaws.com/${itemId}`, 
        createdAt: new Date().getTime().toString(),
        done: false,
        ...createCartItemRequest,
    } as CartItem);
}

export function updateCartItem(updateCartItemRequest: UpdateCartItemRequest, itemId: string, jwtToken: string): Promise<CartUpdate> {
    const userId = parseUserId(jwtToken);
    return cartAccess.updateCartItem(updateCartItemRequest, itemId, userId);
}

export function deleteCartItem(itemId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    return cartAccess.deleteCartItem(itemId, userId);
}

export function generateUploadUrl(itemId: string): Promise<string> {
    return cartAccess.generateUploadUrl(itemId);
}