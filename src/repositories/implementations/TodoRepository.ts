import dayjs from "dayjs";

import { Todo } from "../../entities/Todo";
import { uuidv4 } from "../../utils/idGenerator";
import { ITodoRepository } from "../ITodoRepository";
import { document } from "../../utils/dynamodbClient";
import { ICreateTodoDTO } from "../../dtos/ICreateTodoDTO";

export class TodoRepository implements ITodoRepository {
  private TableName = "todos";

  async create(data: ICreateTodoDTO): Promise<Todo> {
    const { title, user_id, deadline } = data;
    const id = uuidv4();
    const done = false;
    const updatedAt = dayjs();

    await document
      .put({
        TableName: this.TableName,
        Item: {
          id,
          title,
          user_id,
          deadline,
          updated_at: updatedAt,
          done,
        },
      })
      .promise();

    const todo: Todo = {
      id,
      title,
      user_id,
      deadline,
      updated_at: dayjs(updatedAt).toDate(),
      done,
    };

    return todo;
  }

  async listByUser(user_id: string): Promise<Todo[]> {
    const todos: Todo[] = [];

    const response = await document
      .scan({
        TableName: this.TableName,
        FilterExpression: "#user_id = :user_id",
        ExpressionAttributeNames: {
          "#user_id": "user_id",
        },
        ExpressionAttributeValues: {
          ":user_id": user_id,
        },
      })
      .promise();

    response.Items.map((todo) =>
      todos.push({
        id: todo.id,
        title: todo.title,
        user_id: todo.user_id,
        deadline: todo.deadline,
        updated_at: dayjs(todo.updated_at).toDate(),
        done: todo.done,
      })
    );

    return todos;
  }
}
