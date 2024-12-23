import * as supertest from "supertest";
import ENV from "../utils/env";
import { faker } from "@faker-js/faker";
import { createUser, CreateUserDto } from "../data/createUserDto";

const baseUrl: string = ENV.BASE_URL;
const bearerToken: string = ENV.BEARER_TOKEN;
const request = supertest(baseUrl);
const userIdArray: number[] = [];
let user: CreateUserDto;

describe("Tests for the creation and amending of Users, with", () => {
  beforeEach(() => {
    user = createUser();
  });
  it("Create user request should create a new user", async () => {
    const response = await request
      .post(`/users`)
      .auth(bearerToken, { type: "bearer" })
      .send(user);
    expect(response.status).toBe(201);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({
      name: user.name,
      email: user.email,
      gender: user.gender,
      status: user.status,
    });
    userIdArray.push(response.body.id);
  });
  it("requesting a specific user should return expected user details", async () => {
    const createUserResponse = await request
      .post(`/users`)
      .auth(bearerToken, { type: "bearer" })
      .send(user);
    expect(createUserResponse.status).toBe(201);
    expect(createUserResponse.headers["content-type"]).toMatch(/json/);
    expect(createUserResponse.body).toMatchObject({
      name: user.name,
      email: user.email,
      gender: user.gender,
      status: user.status,
    });

    const userId = createUserResponse.body.id;
    userIdArray.push(userId);

    const getUserResponse = await request
      .get(`/users/${userId}`)
      .auth(bearerToken, { type: "bearer" });
    expect(getUserResponse.status).toBe(200);
    expect(getUserResponse.headers["content-type"]).toMatch(/json/);
    expect(getUserResponse.body).toMatchObject({
      name: user.name,
      email: user.email,
      gender: user.gender,
      status: user.status,
    });
  });
  it("Create user request should fail if the email address has been used previously", async () => {
    const initialCreateUserResponse = await request
      .post(`/users`)
      .auth(bearerToken, { type: "bearer" })
      .send(user);
    expect(initialCreateUserResponse.status).toBe(201);

    const repeatedCreateUserResponse = await request
      .post(`/users`)
      .auth(bearerToken, { type: "bearer" })
      .send(user);

    expect(repeatedCreateUserResponse.status).toBe(422);
    expect(repeatedCreateUserResponse.headers["content-type"]).toMatch(/json/);
    expect(repeatedCreateUserResponse.body).toContainEqual(
      expect.objectContaining({
        field: "email",
        message: "has already been taken",
      })
    );
  });
  it("Updating a user's name should return the updated user details", async () => {
    const createUserResponse = await request
      .post(`/users`)
      .auth(bearerToken, { type: "bearer" })
      .send(user);
    expect(createUserResponse.status).toBe(201);

    const userId = createUserResponse.body.id;
    user.name = faker.person.fullName();

    const amendUserResponse = await request
      .put(`/users/${userId}`)
      .auth(bearerToken, { type: "bearer" })
      .send(user);
    expect(amendUserResponse.status).toBe(200);
    expect(amendUserResponse.headers["content-type"]).toMatch(/json/);
    expect(amendUserResponse.body).toMatchObject({
      name: user.name,
      email: user.email,
      gender: user.gender,
      status: user.status,
    });
  });
  it("Create user request should fail due to invalid bearer token", async () => {
    const fakeBearerToken = faker.internet.jwt();
    const response = await request
      .post(`/users`)
      .auth(fakeBearerToken, { type: "bearer" })
      .send(user);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Invalid token",
      })
    );
  });
  it("Deleting the user should remove the created user", async () => {
    const createUserResponse = await request
      .post(`/users`)
      .auth(bearerToken, { type: "bearer" })
      .send(user);
    expect(createUserResponse.status).toBe(201);

    const userId = createUserResponse.body.id;

    const deleteUserResponse = await request
      .delete(`/users/${userId}`)
      .auth(bearerToken, { type: "bearer" });
    expect(deleteUserResponse.status).toBe(204);

    const confirmUserDeletedResponse = await request
      .get(`/users/${userId}`)
      .auth(bearerToken, { type: "bearer" });
    expect(confirmUserDeletedResponse.status).toBe(404);
    expect(confirmUserDeletedResponse.body).toMatchObject({
      message: "Resource not found",
    });
  });
  it("Deleting the user should fail if invalid auth token", async () => {
    const createUserResponse = await request
      .post(`/users`)
      .auth(bearerToken, { type: "bearer" })
      .send(user);
    expect(createUserResponse.status).toBe(201);

    const userId = createUserResponse.body.id;

    const deleteUserResponse = await request
      .delete(`/users/${userId}`)
      .auth(bearerToken, { type: "bearer" });
    expect(deleteUserResponse.status).toBe(204);

    const fakeBearerToken = faker.internet.jwt();
    const confirmUserDeletedResponse = await request
      .get(`/users/${userId}`)
      .auth(fakeBearerToken, { type: "bearer" });
    expect(confirmUserDeletedResponse.status).toBe(401);
    expect(confirmUserDeletedResponse.body).toEqual(
      expect.objectContaining({
        message: "Invalid token",
      })
    );
  });
});
