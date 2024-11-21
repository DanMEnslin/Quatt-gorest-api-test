import { faker } from "@faker-js/faker";

export interface CreateUserPostCommentDto {
  name: string;
  email: string;
  body: string;
}

export const createUserComment = (): CreateUserPostCommentDto => {
  const gender = faker.person.sexType();
  const firstName = faker.person.firstName(gender);
  const lastName = faker.person.lastName();
  const fullName = faker.person.fullName({
    firstName: firstName,
    lastName: lastName,
  });
  const email = faker.internet
    .email({
      firstName: firstName,
      lastName: lastName,
      provider: `${firstName}-${lastName}.example`,
    })
    .toLowerCase();
  const body = faker.lorem.sentence(3);

  return {
    name: fullName,
    email: email,
    body: body,
  };
};
