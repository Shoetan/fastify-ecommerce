import {
  createUserSchema,
  loginResponseSchema,
  loginSchema,
} from "./auth.schema";
import { AuthService } from "./auth.service";

const authService = new AuthService();

async function authRoutes(server: any) {
  server.post(
    "/register",
    {
      schema: {
        body: createUserSchema,
        response: {
          201: createUserSchema.properties,
        },
      },
    },
    authService.registerUserHandler
  );

  server.post(
    "/login",
    {
      schema: {
        body: loginSchema,
        response: {
          200: loginResponseSchema.properties,
        },
      },
    },
    authService.loginHandler
  );
}

export default authRoutes;
