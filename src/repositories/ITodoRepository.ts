import { Todo } from "../entities/Todo";
import { ICreateTodoDTO } from "../dtos/ICreateTodoDTO";

export interface ITodoRepository {
  create(data: ICreateTodoDTO): Promise<Todo>;
  listByUser(user_id: string): Promise<Todo[]>;
}
