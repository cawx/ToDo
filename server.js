import Fastify from "fastify";
import db from "./db.js";

const fastify = Fastify({
  logger: true,
});

fastify.register(db);
// get all tasks
fastify.get("/", async (request, reply) => {
  try {
    const [rows] = await fastify.mysql.query("select * from task");
    return rows;
  } catch (err) {
    fastify.log.error(err);
    return reply.status(500).send({ err: "smth went terribly wrong" });
  }
});
// create new task
fastify.post("/", async (request, reply) => {
  const { title } = request.body;
  const [result] = await fastify.mysql.query(
    "insert into task (title) values (?)",
    [title]
  );
  return reply.status(201).send({ message: "new task created" });
});
// update an existing task
fastify.put("/", async (request, reply) => {
  const { id, title } = request.body;
  const [result] = await fastify.mysql.query(
    "update task set title = ? where id = ?",
    [title, id]
  );
  return reply.status(201).send({ message: "task updated" });
});
// delete a task
fastify.delete("/:id", async (request, reply) => {
  const { id } = request.params;
  const [result] = await fastify.mysql.query("delete from task where id = ?", [
    id,
  ]);
  return reply.status(204).send({ message: "task deleted" });
});

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
