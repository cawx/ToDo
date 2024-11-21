const removeSpaces = (str) => str.replace(/\s+/g, " ");

const taskRoutes = async (fastify, options) => {
  const taskSchema = {
    schema: {
      body: {
        type: "object",
        properties: {
          title: { type: "string" },
        },
        required: ["title"],
        additionalProperties: false,
      },
      response: {
        201: {
          type: "object",
          properties: {
            message: { type: "string" },
            id: { type: "number" },
          },
        },
      },
    },
  };

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
  fastify.post("/", taskSchema, async (request, reply) => {
    let { title } = request.body;
    title = removeSpaces(title.trim());

    if (title.length === 0) {
      return reply.status(400).send({ error: "title cant be empty." });
    }

    try {
      const [result] = await fastify.mysql.query(
        "insert into task (title) values (?)",
        [title]
      );
      return reply.status(201).send({ message: "new task created" });
    } catch (err) {
      if (err.code === "ER_BAD_NULL_ERROR") {
        return reply.status(400).send({ error: "title cant be null." });
      } else {
        fastify.log.error(err);
        return reply.status(500).send({ error: "smth went wrong." });
      }
    }
  });

  // update an existing task
  fastify.put("/", async (request, reply) => {
    const { id, title } = request.body;
    const [result] = await fastify.mysql.query(
      "update task set title = ? where id = ?",
      [title, id]
    );
    return reply.status(200).send({ message: "task updated" });
  });

  // delete a specific task
  fastify.delete("/:id", async (request, reply) => {
    const { id } = request.params;
    const [result] = await fastify.mysql.query(
      "delete from task where id = ?",
      [id]
    );
    return reply.status(204).send({ message: "task deleted" });
  });

  // nuke all tasks
  fastify.delete("/nuke", async (request, reply) => {
    const [result] = await fastify.mysql.query("truncate task");
    return reply.status(204).send({ message: "your tasks have been nuked." });
  });
};

export default taskRoutes;
