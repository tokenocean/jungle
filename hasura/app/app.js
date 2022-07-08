import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";

export const app = fastify();

app.register(fastifyStatic, {
  root: path.join("/export"),
  prefix: "/public/", // optional: default '/'
});
