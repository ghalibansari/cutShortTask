import mongoose, { disconnect } from "mongoose";
import request from "supertest";
import { DB } from "../../../configs/DB";
import app from "../../app";
import { ITodo, TodoStatus } from "./todo.types";

describe("todo controller tests", () => {
  const token: string =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDY5ZTM4M2NiODYzOGJkZmVjOTgxNTMiLCJlbWFpbCI6ImdoYWxpYkBlbWFpbC5jb20iLCJpYXQiOjE2ODQ2NjEyNjZ9.-miq7WHyXscDZfp3ahOpxvNoLm49Ypxir2mmqg6vbUM";

  const header = { authorization: token };

  beforeAll(async () => {
    await DB();
  });

  afterAll(async () => {
    await disconnect();
  });

  describe("/api/v1/todo", () => {
    it("get all todo (POST) 200", async () => {
      const result = await request(app).get("/api/v1/todo").set(header);

      expect(result.status).toBe(200);
      expect(result.body.status).toBe(true);
      expect(result.body).toHaveProperty("data");
      expect(result.body).toHaveProperty("page");
      expect(result.body).toHaveProperty("status");
      expect(result.body).toHaveProperty("message");
      expect(result.body.data).toBeInstanceOf(Array);
    });

    it("get all todo (POST) 401", async () => {
      const result = await request(app).get("/api/v1/todo");

      expect(result.status).toBe(401);
      expect(result.body.status).toBe(false);
      expect(result.body).toHaveProperty("message");
    });
  });

  describe("Single todo /api/v1/todo", () => {
    let id: string;
    const todo: Partial<ITodo> = {
      title: "test",
      description: "test",
    };

    it("create todo (POST) 201", async () => {
      const header = { authorization: token };
      const result = await request(app)
        .post("/api/v1/todo")
        .set(header)
        .send(todo);

      expect(result.status).toBe(200);
      expect(result.body.status).toBe(true);
      expect(result.body).toHaveProperty("data");
      expect(result.body).toHaveProperty("status");
      expect(result.body).toHaveProperty("message");
      expect(result.body.data).toBeInstanceOf(Object);
      expect(result.body.data).toMatchObject(todo);
      id = result.body.data._id;
    });

    describe("Single todo /api/v1/todo", () => {
      it("get todo by id (GET) 200", async () => {
        const header = { authorization: token };
        const result = await request(app).get(`/api/v1/todo/${id}`).set(header);

        expect(result.status).toBe(200);
        expect(result.body.status).toBe(true);
        expect(result.body).toHaveProperty("data");
        expect(result.body).toHaveProperty("status");
        expect(result.body).toHaveProperty("message");
        expect(result.body.data).toBeInstanceOf(Object);
        expect(result.body.data).toMatchObject(todo);
      });

      it("failed to get todo by id (GET) 200", async () => {
        const header = { authorization: token };
        const result = await request(app)
          .get(`/api/v1/todo/${new mongoose.Types.ObjectId()}`)
          .set(header);

        expect(result.status).toBe(200);
        expect(result.body.status).toBe(false);
        expect(result.body).toHaveProperty("data");
        expect(result.body).toHaveProperty("status");
        expect(result.body).toHaveProperty("message");
        expect(result.body.data).toBeNull();
      });
    });

    describe("update todo /api/v1/todo", () => {
      it("update todo (PUT) 200", async () => {
        const header = { authorization: token };
        const result = await request(app)
          .put(`/api/v1/todo/${id}`)
          .set(header)
          .send({ description: "test2", title: "test2" });

        expect(result.status).toBe(200);
        expect(result.body.status).toBe(true);
        expect(result.body).toHaveProperty("data");
        expect(result.body).toHaveProperty("status");
        expect(result.body).toHaveProperty("message");
        expect(result.body.data).toBe(1);
      });

      it("failed to update todo (PUT) 200", async () => {
        const header = { authorization: token };
        const result = await request(app)
          .put(`/api/v1/todo/${new mongoose.Types.ObjectId()}`)
          .set(header)
          .send({ ...todo, title: "test2" });

        expect(result.status).toBe(400);
        expect(result.body.status).toBe(false);
        expect(result.body).toHaveProperty("data");
        expect(result.body).toHaveProperty("status");
        expect(result.body).toHaveProperty("message");
        expect(result.body.data).toBe(0);
      });
    });

    describe("toggle todo status /api/v1/todo", () => {
      it("toggle todo status (PUT) 200", async () => {
        const header = { authorization: token };
        const result = await request(app)
          .put(`/api/v1/todo/${id}/status`)
          .query({ status: TodoStatus.COMPLETED })
          .set(header);

        expect(result.status).toBe(200);
        expect(result.body.status).toBe(true);
        expect(result.body).toHaveProperty("data");
        expect(result.body).toHaveProperty("status");
        expect(result.body).toHaveProperty("message");
        expect(result.body.data).toBe(1);
      });

      it("failed to toggle todo status (PUT) 200", async () => {
        const header = { authorization: token };
        const result = await request(app)
          .put(`/api/v1/todo/${new mongoose.Types.ObjectId()}/status`)
          .query({ status: TodoStatus.COMPLETED })
          .set(header);

        expect(result.status).toBe(400);
        expect(result.body.status).toBe(false);
        expect(result.body).toHaveProperty("data");
        expect(result.body).toHaveProperty("status");
        expect(result.body).toHaveProperty("message");
        expect(result.body.data).toBe(0);
      });
    });

    describe("delete todo /api/v1/todo", () => {
      it("delete todo (DELETE) 200", async () => {
        const header = { authorization: token };
        const result = await request(app)
          .delete(`/api/v1/todo/${id}`)
          .set(header);

        expect(result.status).toBe(200);
        expect(result.body.status).toBe(true);
        expect(result.body).toHaveProperty("data");
        expect(result.body).toHaveProperty("status");
        expect(result.body).toHaveProperty("message");
        expect(result.body.data).toBe(1);
      });

      it("failed to delete todo (DELETE) 200", async () => {
        const header = { authorization: token };
        const result = await request(app)
          .delete(`/api/v1/todo/${new mongoose.Types.ObjectId()}`)
          .set(header);

        expect(result.status).toBe(400);
        expect(result.body.status).toBe(false);
        expect(result.body).toHaveProperty("data");
        expect(result.body).toHaveProperty("status");
        expect(result.body).toHaveProperty("message");
        expect(result.body.data).toBe(0);
      });
    });
  });
});
