import Fastify from "fastify";
import db from "./db.js";
import taskRoutes from "./routes.js";
import supertest from "supertest";
import { describe, it, beforeAll, afterAll, expect, vi } from "vitest";
import utils from "./utils.js";

const buildApp = () => {
  const fastify = Fastify();
  fastify.register(db);
  fastify.register(taskRoutes);
  return fastify;
};

describe("Task Routes", () => {
  let app;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();
    await utils.clearTestData(app);
  });

  afterAll(async () => {
    await utils.clearTestData(app);
    await app.close();
  });

  describe("GET /", () => {
    it("should return an empty array since database is clean", async () => {
      const response = await supertest(app.server).get("/").expect(200);
      expect(response.body).toEqual([]);
    });
    it("should return 200 with all tasks", async () => {
      await utils.seedTask(app, "test task 1");
      await utils.seedTask(app, "test task 2");
      const response = await supertest(app.server).get("/").expect(200);

      expect(response.body).toContainEqual({
        id: expect.any(Number),
        title: "test task 1",
      });
      expect(response.body).toContainEqual({
        id: expect.any(Number),
        title: "test task 2",
      });
    });
  });

  it("should return 400 for empty title on POST /", async () => {
    const response = await supertest(app.server).post("/").send({ title: "" });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "title cant be empty." });
  });
  it("should return 201 for valid input on POST /", async () => {
    const response = await supertest(app.server)
      .post("/")
      .send({ title: "test task" });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "new task created",
    });
  });
});
