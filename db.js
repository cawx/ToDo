import mysql from "@fastify/mysql";
import fastifyPlugin from "fastify-plugin";

async function db(fastify, options) {
  fastify.register(mysql, {
    promise: true,
    connectionString: "mysql://root:root@localhost/tasks",
  });
}
export default fastifyPlugin(db);
