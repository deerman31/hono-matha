import { AuthHandler } from "../../interfaces/handlers/auth.ts";
import { AuthServiceImpl } from "../../services/auth/index.ts";
import registerHandler from "./register.ts";
import { Context } from "hono";

export class AuthHandlerImpl implements AuthHandler {
  service: AuthServiceImpl;

  constructor(service: AuthServiceImpl) {
    this.service = service;
  }

  // このメソッドをインスタンスメソッドとして定義
  register = async (c: Context): Promise<Response> => {
    return await registerHandler(c, this.service);
  };
}
