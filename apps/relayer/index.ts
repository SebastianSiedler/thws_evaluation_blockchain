import Fastify from "fastify";
import { initServer } from "@ts-rest/fastify";
import { contract } from "./contract";
import cors from "@fastify/cors";

const app = Fastify();

app.register(cors, {
  origin: "*", //TODO: .env only :9000
});

const s = initServer();

export const router = s.router(contract, {
  getPost: async ({ params: { id } }) => {
    return {
      status: 200,
      body: {
        body: "Hello, world!",
        id: "1",
        title: "Hello, world!",
      },
    };
  },
});

app.register(s.plugin(router));

const start = async () => {
  try {
    console.log("Starting server...", { port: 3000 });
    await app.listen({ port: 3000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
