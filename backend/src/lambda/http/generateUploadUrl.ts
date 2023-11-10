import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import {generateUploadUrl} from "../../businessLogic/cartItems";


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("Processing Event ", event)
  const itemId = event.pathParameters.itemId

  const URL = await generateUploadUrl(itemId);
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    

    return {
      statusCode: 202,
      headers: {
          "Access-Control-Allow-Origin": "*",
          'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        uploadUrl:  URL
      })
  }
  }
