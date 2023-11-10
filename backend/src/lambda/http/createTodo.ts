import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createToDo } from '../../businessLogic/todos'



export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ', event)
    // TODO: Implement creating a new TODO item
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]
    
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const todoItem = await createToDo(newTodo, jwtToken)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        "item": todoItem
      })
    }
  }


