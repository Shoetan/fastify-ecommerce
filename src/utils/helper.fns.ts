import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { appConfig } from "../config";

export class HelperFns {
  static async createPasswordHash(password: string) {
    try {
      return await argon2.hash(password);
    } catch (err) {
      throw err;
    }
  }

  static async verifyPassword(data: {
    passwordHash: string;
    password: string;
  }) {
    try {
      return await argon2.verify(data.passwordHash, data.password);
    } catch (err) {
      throw err;
    }
  }

  static signJwtToken(payload: Record<string, string>) {
    return jwt.sign(payload, appConfig.jwt_secret, {
      expiresIn: "24hr",
    });
  }
}
