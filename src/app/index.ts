import Fastify from "fastify";
const port = parseInt(process.env.PORT || "3000");

const server = Fastify({
  logger: true,
});

server.get("/test", async (req, res) => {
  return "Working";
});

try {
  server.listen({ port });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}

export default server;
