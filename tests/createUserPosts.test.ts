import * as supertest from "supertest";
import ENV from "../utils/env";
import { createUser, CreateUserDto } from "../data/createUserDto";
import { createUserPost } from "../data/createUserPostDto";
import { createUserComment } from "../data/createUserPostCommentDto";

const baseUrl: string = ENV.BASE_URL;
const bearerToken: string = ENV.BEARER_TOKEN;
const request = supertest(baseUrl);
let user: CreateUserDto;

describe("Tests for the creation of user posts & comments", () => {
  beforeEach(() => {
    user = createUser();
  });

  it("Create user post request should create a post for the specified user", async () => {
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
  it("Create user post comment request should create a user comment on the specified user post", async () => {
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
