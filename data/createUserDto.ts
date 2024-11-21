import { faker } from "@faker-js/faker/.";

export interface CreateUserDto {
  name: string;
  email: string;
  gender: string;
  status: string;
}

export const createUser = (): CreateUserDto => {
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
  const status = "active";

  return {
    name: fullName,
    email: email,
    gender: gender,
    status: status,
  };
};
