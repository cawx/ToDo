import Fastify from "fastify";
import db from "./db.js";
import taskRoutes from "./routes.js";
import supertest from "supertest";
import { describe, it, beforeAll, afterAll, expect } from "vitest";

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
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return 400 for empty title on POST /", async () => {
    const response = await supertest(app.server).post("/").send({ title: "" });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "title cant be empty." });
  });
  it("should return 201 for valid input on POST /", async () => {
    const response = await supertest(app.server)
      .post("/")
      .send({ title: "walk the dawg" });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "new task created",
    });
  });
});
