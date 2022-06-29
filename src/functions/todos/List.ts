import { APIGatewayProxyHandler } from "aws-lambda";
import { TodoRepository } from "../../repositories/implementations/TodoRepository";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { userId: user_id } = event.pathParameters;

  const todoRepository = new TodoRepository();
  const todos = await todoRepository.listByUser(user_id);

  return {
    statusCode: 201,
    body: JSON.stringify({ todos }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
