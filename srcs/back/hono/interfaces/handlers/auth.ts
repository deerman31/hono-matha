import { Context } from "hono";
import { AuthService } from "../services/auth.ts";

export interface AuthHandler {
  service: AuthService;
  register(c: Context): Promise<Response>;
}
