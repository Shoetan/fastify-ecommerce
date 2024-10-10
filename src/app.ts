import fastify, { FastifyReply } from "fastify";
import { config } from "dotenv";
import { appConfig, connectDB, loggerConfig } from "./config";
import authRoutes from "./module/user/auth.route";
import productRoutes from "./module/product/product.route";
config();

const server = fastify({
  logger:
    appConfig.node_env === "production"
      ? loggerConfig.production
      : loggerConfig.development,
});

async function bootstrap() {
  server.register(require("@fastify/jwt"), {
    secret: appConfig.jwt_secret,
  });

  server.decorate(
    "authenticate",
    async function (request: any, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }
  );


  server.register(authRoutes, { prefix: "api/v1/auth" });
  server.register(productRoutes, { prefix: "api/v1/admin/product" });

  try {
    server.listen({ port: +appConfig.port }, (err, address) => {
      if (err) {
        process.exit(1);
      }
      console.log(`server listening at ${address}`);
    });
    connectDB();
  } catch (error) {}
}

bootstrap();
