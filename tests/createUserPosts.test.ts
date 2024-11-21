import * as supertest from "supertest";
import ENV from "../utils/env";
//import { faker } from "@faker-js/faker";
import { createUser } from "../data/createUserDto";
import { createUserPost } from "../data/createUserPostDto";
import { createUserComment } from "../data/createUserPostCommentDto";

const baseUrl: string = ENV.BASE_URL;
const bearerToken: string = ENV.BEARER_TOKEN;
const request = supertest(baseUrl);

describe("Tests for the creation of user posts & comments", () => {
  it("should create a user post for the created user", async () => {
    const user = createUser();
    const createUserResponse = await request
      .post(`/users`)
      .auth(bearerToken, { type: "bearer" })
      .send(user);
    expect(createUserResponse.status).toBe(201);

    const userId = createUserResponse.body.id;
    const userPost = createUserPost(userId);

    const createUserPostResponse = await request
      .post(`/users/${userId}/posts`)
      .auth(bearerToken, { type: "bearer" })
      .send(userPost);
    expect(createUserResponse.status).toBe(201);
    expect(createUserPostResponse.headers["content-type"]).toMatch(/json/);
    expect(createUserPostResponse.body).toMatchObject({
      user_id: userId,
      title: userPost.title,
      body: userPost.body,
    });
  });
  it("should create a user comment for the created user comment", async () => {
    //should this fail? there is no data to return
    const user = createUser();
    const createUserResponse = await request
      .post(`/users`)
      .auth(bearerToken, { type: "bearer" })
      .send(user);
    expect(createUserResponse.status).toBe(201);

    const userId = createUserResponse.body.id;
    const userPost = createUserPost(userId);

    const createUserPostResponse = await request
      .post(`/users/${userId}/posts`)
      .auth(bearerToken, { type: "bearer" })
      .send(userPost);
    expect(createUserPostResponse.status).toBe(201);
    expect(createUserPostResponse.headers["content-type"]).toMatch(/json/);
    expect(createUserPostResponse.body).toMatchObject({
      user_id: userId,
      title: userPost.title,
      body: userPost.body,
    });

    const postId = createUserPostResponse.body.id;
    const userComment = createUserComment();
    const createUserCommentResponse = await request
      .post(`/posts/${postId}/comments`)
      .auth(bearerToken, { type: "bearer" })
      .send(userComment);
    expect(createUserCommentResponse.status).toBe(201);
    expect(createUserCommentResponse.headers["content-type"]).toMatch(/json/);
    expect(createUserCommentResponse.body).toMatchObject({
      post_id: postId,
      name: userComment.name,
      email: userComment.email,
      body: userComment.body,
    });
  });
});
