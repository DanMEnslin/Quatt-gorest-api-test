import * as supertest from "supertest";
import ENV from "../utils/env";
import { faker } from "@faker-js/faker";

const baseUrl: string = ENV.BASE_URL;
const bearerToken: string = ENV.BEARER_TOKEN;
const request = supertest(baseUrl);

describe("Tests for the querying of existing users", () => {
  it("Should return list of users, default (10 per page) pagination", async () => {
    const response = await request
      .get("/users")
      .auth(bearerToken, { type: "bearer" });
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body.length).toEqual(10);
    expect(response.body).toContainEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        gender: expect.any(String),
        status: expect.any(String),
      })
    );
  });
  it("Should return list of users, custom (20 per page) pagination", async () => {
    const paginationParam = "?per_page=20";
    const response = await request
      .get(`/users${paginationParam}`)
      .auth(bearerToken, { type: "bearer" });
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body.length).toEqual(20);
    expect(response.body).toContainEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        gender: expect.any(String),
        status: expect.any(String),
      })
    );
  });
  it("Should return a filter list of 4 users, based on filtering by name", async () => {
    const paramFilter: string = "?name=kumar";
    const response = await request
      .get(`/users${paramFilter}`)
      .auth(bearerToken, { type: "bearer" });
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body.length).toEqual(4);
  });
  it("Should return a filter list of 1 users, based on filtering by email", async () => {
    const paramFilter: string = "?email=angel_west@angel-west.example";
    const response = await request
      .get(`/users${paramFilter}`)
      .auth(bearerToken, { type: "bearer" });
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body.length).toEqual(1);
  });
  it("Should fail due to invalid bearer token", async () => {
    const fakeBearerToken = faker.internet.jwt();
    const response = await request
      .get("/users")
      .auth(fakeBearerToken, { type: "bearer" });
    expect(response.status).toBe(401);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Invalid token",
      })
    );
  });
});
