import 'source-map-support/register'
import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {UpdateCartItemRequest} from '../../requests/UpdateCartItemRequest'
import {updateCartItem} from "../../businessLogic/cartItems"


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Processing Event ", event)
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]
  
    const itemId = event.pathParameters.itemId
    const updatedCartItem: UpdateCartItemRequest = JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedCartItem" object
    const cartItemItem = await updateCartItem(updatedCartItem, itemId, jwtToken)

    return {
      statusCode: 200,
      headers: {
          "Access-Control-Allow-Origin": "*",
          'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
      'item':  cartItemItem
      }),
  }

}