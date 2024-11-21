// server.js
import Fastify from "fastify";
import db from "./db.js";
import taskRoutes from "./routes.js";

const fastify = Fastify({
  logger: true,
  ajv: {
    customOptions: {
      coerceTypes: false,
      removeAdditional: "all",
    },
  },
});

fastify.register(db);
fastify.register(taskRoutes);

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

export default fastify;
