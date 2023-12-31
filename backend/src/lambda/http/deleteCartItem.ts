import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { deleteCartItem } from '../../businessLogic/cartItems'

  export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Processing Event ", event);
    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];
    
    const itemId = event.pathParameters.itemId
    const deleteData = await deleteCartItem(itemId, jwtToken);
    
    return {
      statusCode: 200,
      headers: {
          "Access-Control-Allow-Origin": "*",
          'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        deleteData
      })
  }
  }


