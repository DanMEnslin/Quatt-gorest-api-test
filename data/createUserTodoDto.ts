import { faker } from "@faker-js/faker";

export interface CreateUserTodoDto {
  user_id: number;
  title: string;
  due_on: Date;
  status: string;
}

export const createUserTodo = (userId: number): CreateUserTodoDto => {
  const title = faker.lorem.words(10);
  const dueOn = faker.date.soon({ days: 10 });
  const statusOptions = ["pending", "completed"];
  const status: string =
    statusOptions[Math.floor(Math.random() * statusOptions.length)];

  return {
    user_id: userId,
    title: title,
    due_on: dueOn,
    status: status,
  };
};
