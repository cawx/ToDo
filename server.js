import Fastify from "fastify";
import db from "./db.js";

const fastify = Fastify({
  logger: true,
});

fastify.register(db);

fastify.get("/tasks", async (request, reply) => {
  try {
    const [rows] = await fastify.mysql.query("select * from task");
    return rows;
  } catch (err) {
    fastify.log.error(err);
    return reply.status(500).send({ err: "smth went terribly wrong" });
  }
});

fastify.post("/tasks", async (request, reply) => {
  const { title } = request.body;
  const [result] = await fastify.mysql.query(
    "insert into task (title) values (?)",
    [title]
  );
  return reply
    .status(201)
    .send({ message: "ze task haz been created-uh succesfoullay" });
});

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
