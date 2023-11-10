import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { CartItem } from '../models/CartItem'
import { CartUpdate } from '../models/CartUpdate'
import { Types } from 'aws-sdk/clients/s3'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

export class cartItemAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly s3Client: Types = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly cartTable = process.env.CART_ITEMS_TABLE,
    private readonly s3BucketName = process.env.S3_BUCKET_NAME
  ) {}

  async getAllCartItems(userId: string): Promise<CartItem[]> {
    console.log('Getting all cart item')

    const params = {
      TableName: this.cartTable,
      KeyConditionExpression: '#userId = :userId',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }
    const result = await this.docClient.query(params).promise()
    console.log(result)
    const items: CartItem[] = result.Items as CartItem[];
    items.forEach((item) => {
      const url = this.s3Client.getSignedUrl('getObject', {
        Bucket: this.s3BucketName,
        Key: item.itemId,
        Expires: 1000
      })
      item.imageUrl = url
    })

    return items;
  }
  async createCartItem(cartItem: CartItem): Promise<CartItem> {
    console.log('Creating new cart item')

    const params = {
      TableName: this.cartTable,
      Item: cartItem
    }
    const result = await this.docClient.put(params).promise()
    console.log(result)

    return cartItem as CartItem
  }

  async updateCartItem(
    cartUpdate: CartUpdate,
    cartId: string,
    userId: string
  ): Promise<CartUpdate> {
    console.log('Updating cart item')

    const params = {
      TableName: this.cartTable,
      Key: {
        userId: userId,
        itemId: cartId
      },
      UpdateExpression: 'set #a = :a, #b = :b, #c = :c, #d = :d',
      ExpressionAttributeNames: {
        '#a': 'name',
        '#b': 'description',
        '#c': 'price',
        '#d': 'done'
      },
      ExpressionAttributeValues: {
        ':a': cartUpdate['name'],
        ':b': cartUpdate['description'],
        ':c': cartUpdate['price'],
        ':d': cartUpdate['done']
      },
      ReturnValues: 'ALL_NEW'
    }
    const result = await this.docClient.update(params).promise()
    console.log(result)
    const attributes = result.Attributes

    return attributes as CartUpdate
  }

  async deleteCartItem(cartId: string, userId: string): Promise<string> {
    console.log('Deleting cart item')

    const params = {
      TableName: this.cartTable,
      Key: {
        userId: userId,
        itemId: cartId
      }
    }
    const result = await this.docClient.delete(params).promise()
    console.log(result)

    return '' as string
  }
  async generateUploadUrl(cartId: string): Promise<string> {
    console.log('Generating URL')

    const url = this.s3Client.getSignedUrl('putObject', {
      Bucket: this.s3BucketName,
      Key: cartId,
      Expires: 1000
    })
    console.log(url)

    return url as string
  }
}
