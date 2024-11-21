import { faker } from "@faker-js/faker";

export interface CreateUserPostDto {
  user_id: number;
  title: string;
  body: string;
}

export const createUserPost = (userId: number): CreateUserPostDto => {
  const title = faker.lorem.words(10);
  const body = faker.lorem.sentence(5);

  return {
    user_id: userId,
    title: title,
    body: body,
  };
};
