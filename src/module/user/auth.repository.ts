import { types } from "cassandra-driver";
import { cassandraClient } from "../../config";
import { HelperFns } from "../../utils/helper.fns";
import { v4 as uuidv4 } from "uuid";
import { ILogin } from "./auth.schema";

export class AuthRepository {
  async createUser(data: Record<string, any>) {
    const haveUser = await this.findUserByEmail(data.email);

    if (!haveUser) {
      const password_hash = await HelperFns.createPasswordHash(data.password);
      const userId = uuidv4();

      const query = `
        INSERT INTO users (id, first_name, last_name, email, phone_number, password_hash, created_at, role) 
        VALUES (?, ?, ?, ?, ?, ?, toTimestamp(now()), ?)
      `;

      const values = [
        userId,
        data.first_name,
        data.last_name,
        data.email,
        data.phone_number,
        password_hash,
        data.role,
      ];

      try {
        await cassandraClient.execute(query, values, { prepare: true });

        return {
          message: `user created successfully`,
          data: {
            id: userId,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone_number: data.phone_number,
            role: data.role,
            created_at: new Date(),
          },
        };
      } catch (error) {
        console.error("Failed to create user:", error);
        throw error;
      }
    }
    return null;
  }

  async findUserByEmail(email: string) {
    const query = "SELECT * FROM users WHERE email = ? LIMIT 1 ALLOW FILTERING";

    try {
      const result: types.ResultSet = await cassandraClient.execute(
        query,
        [email],
        {
          prepare: true,
        }
      );

      if (result.rowLength === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error("failed to find user by email:", error);
      throw error;
    }
  }

  async login(data: Record<keyof ILogin, string>) {
    const user = await this.findUserByEmail(data.email);

    if (!user) return null;

    if (
      !(await HelperFns.verifyPassword({
        passwordHash: user.password_hash,
        password: data.password,
      }))
    )
      return { status: 403 };

    return { access_token: HelperFns.signJwtToken({ id: user.id }) };
  }
}
