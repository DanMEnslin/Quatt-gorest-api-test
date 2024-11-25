import * as supertest from "supertest";
import ENV from "../utils/env";
import { createUser, CreateUserDto } from "../data/createUserDto";
import { createUserTodo } from "../data/createUserTodoDto";

const baseUrl: string = ENV.BASE_URL;
const bearerToken: string = ENV.BEARER_TOKEN;
const request = supertest(baseUrl);
let user: CreateUserDto;

describe("Tests for the creation and requesting of user Todos", () => {
  beforeEach(() => {
    user = createUser();
  });

  it("Should create a user todo for the specified user", async () => {
    const createUserResponse = await request
      .post(`/users`)
      .auth(bearerToken, { type: "bearer" })
      .send(user);
    expect(createUserResponse.status).toBe(201);

    const userId = createUserResponse.body.id;
    const userTodo = createUserTodo(userId);

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
  it("should request a created user todo", async () => {
    const createUserResponse = await request
      .post(`/users`)
      .auth(bearerToken, { type: "bearer" })
      .send(user);
    expect(createUserResponse.status).toBe(201);

    const userId = createUserResponse.body.id;
    const userTodo = createUserTodo(userId);

    const createUserTodoResponse = await request
      .post(`/users/${userId}/todos`)
      .auth(bearerToken, { type: "bearer" })
      .send(userTodo);
    expect(createUserTodoResponse.status).toBe(201);

    const queryUserTodoResponse = await request
      .get(`/users/${userId}/todos`)
      .auth(bearerToken, { type: "bearer" });

    expect(queryUserTodoResponse.status).toBe(200);
    console.log(queryUserTodoResponse.body);
    expect(queryUserTodoResponse.headers["content-type"]).toMatch(/json/);
    expect(queryUserTodoResponse.body).toContainEqual(
      expect.objectContaining({
        user_id: userId,
        title: userTodo.title,
        status: userTodo.status,
      })
    );
  });
});
