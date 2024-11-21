import * as supertest from "supertest";
import ENV from "../utils/env";
import { createUser } from "../data/createUserDto";
import { createUserTodo } from "../data/createUserTodoDto";

const baseUrl: string = ENV.BASE_URL;
const bearerToken: string = ENV.BEARER_TOKEN;
const request = supertest(baseUrl);

describe("Tests for the creation and requesting user Todos", () => {
  it("Should create a user todo for the specified user", async () => {
    const user = createUser();
    const createUserResponse = await request
      .post(`/users`)
      .auth(bearerToken, { type: "bearer" })
      .send(user);
    expect(createUserResponse.status).toBe(201);

    const userId = createUserResponse.body.id;
    const userTodo = createUserTodo(userId);
    console.log(userTodo);

    const createUserTodoResponse = await request
      .post(`/users/${userId}/todos`)
      .auth(bearerToken, { type: "bearer" })
      .send(userTodo);
    expect(createUserTodoResponse.status).toBe(201);
    expect(createUserTodoResponse.headers["content-type"]).toMatch(/json/);
    expect(createUserTodoResponse.body).toMatchObject({
      user_id: userId,
      title: userTodo.title,
      status: userTodo.status,
    });
  });
  it("should request a created user todo ", async () => {});
});
