import { APIGatewayProxyHandler } from "aws-lambda";
import { TodoRepository } from "../../repositories/implementations/TodoRepository";

interface IRequest {
  title: string;
  deadline: Date;
}

export const handle: APIGatewayProxyHandler = async (event) => {
  const { userId: user_id } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as IRequest;

  const todoRepository = new TodoRepository();
  const todo = await todoRepository.create({ user_id, title, deadline });

  return {
    statusCode: 201,
    body: JSON.stringify({ todo }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
