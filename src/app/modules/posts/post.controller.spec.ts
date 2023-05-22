import { disconnect } from "mongoose";
import request from "supertest";
import { DB } from "../../../configs/DB";
import app from "../../app";
import { IPost } from "./post.types";

describe("Posts controller tests", () => {
  const token: string =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDY5ZTM4M2NiODYzOGJkZmVjOTgxNTMiLCJlbWFpbCI6ImdoYWxpYkBlbWFpbC5jb20iLCJpYXQiOjE2ODQ2NjEyNjZ9.-miq7WHyXscDZfp3ahOpxvNoLm49Ypxir2mmqg6vbUM";

  const header = { authorization: token };

  beforeAll(async () => {
    await DB();
  });

  afterAll(async () => {
    await disconnect();
  });

  describe("/api/v1/post/", () => {
    describe("get all post (GET)", () => {
      it("get all post (GET) 200 ", async () => {
        const result = await request(app).get("/api/v1/post/").set(header);

        expect(result.status).toBe(200);
        expect(result.body.status).toBe(true);
        expect(result.body).toHaveProperty("data");
        expect(result.body).toHaveProperty("page");
        expect(result.body).toHaveProperty("status");
        expect(result.body).toHaveProperty("message");
        expect(result.body.data).toBeInstanceOf(Array);
      });

      it("get all post (GET) 401", async () => {
        const result = await request(app).get("/api/v1/post/");

        expect(result.status).toBe(401);
        expect(result.body.status).toBe(false);
        expect(result.body).toHaveProperty("data");
        expect(result.body).toHaveProperty("message");
      });
    });

    describe("single post (GET)", () => {
      let id: string;
      it("create post (POST) 200", async () => {
        const data: Partial<IPost> = {
          title: "test",
          text: "test",
        };
        const result = await request(app)
          .post("/api/v1/post/")
          .set(header)
          .send(data);

        expect(result.status).toBe(200);
        expect(result.body.status).toBe(true);
        expect(result.body).toHaveProperty("data");
        expect(result.body).toHaveProperty("message");
        id = result.body.data._id;
      });

      it("update post (PUT) 200", async () => {
        const data: Partial<IPost> = {
          title: "test",
          text: "test",
        };
        const result = await request(app)
          .put(`/api/v1/post/${data._id}`)
          .set(header)
          .send({ title: "test2", text: "test2" });

        expect(result.status).toBe(400);
        expect(result.body.status).toBe(false);
        expect(result.body).toHaveProperty("data");
        expect(result.body).toHaveProperty("message");
      });
    });
  });
});
