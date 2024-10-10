import { FastifyReply, FastifyRequest } from "fastify";
import { ICreateUser, ILogin } from "./auth.schema";
import { AuthRepository } from "./auth.repository";

const authRepo = new AuthRepository();

export class AuthService {
  async registerUserHandler(
    request: FastifyRequest<{
      Body: ICreateUser;
    }>,
    reply: FastifyReply
  ) {
    try {
      const user = await authRepo.createUser(request.body);

      if (!user) {
        return reply
          .code(409)
          .send({ message: `user with details already exists` });
      }

      return reply.code(201).send(user);
    } catch (e) {
      console.log(e);
      return reply.code(500).send(e);
    }
  }

  async loginHandler(
    request: FastifyRequest<{ Body: ILogin }>,
    reply: FastifyReply
  ) {
    try {
      const access = await authRepo.login(request.body);

      if (!access) {
        return reply
          .code(404)
          .send({ message: `user with this credentials not found` });
      }

      if (access && access.status) {
        return reply.code(403).send({ message: `invalid login credentials` });
      }

      return reply
        .code(200)
        .send({ message: `user logged in successfully`, ...access });
    } catch (e) {
      console.log(e);
      return reply.code(500).send(e);
    }
  }
}
