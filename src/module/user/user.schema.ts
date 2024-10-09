export const createUserSchema = {
  type: "object",
  properties: {
    first_name: { type: "string" },
    last_name: { type: "string" },
    email: { type: "string", format: "email" },
    phone_number: { type: "string" },
    role: { type: "string" },
    password: { type: "string" },
  },
  required: ["first_name", "last_name", "email", "role", "password"],
};

export interface ICreateUser {
  first_name: string;
  last_name: string;
  email: string;
  phone_numner: string;
  role: string;
  password: string;
}

export const loginSchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string" },
  },
  required: ["email", "password"],
};

export const loginResponseSchema = {
  type: "object",
  properties: {
    message: { type: "string" },
    access_token: { type: "string" },
  },
  required: ["message", "access_token"],
};

export interface ILogin {
  email: string;
  password: string;
}
