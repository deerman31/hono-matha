import { Pool } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import { Hono } from "hono";
import { newAuthHandler } from "../handlers/auth/index.ts";
import { newAuthService } from "../services/auth/index.ts";

const authRouter = (pool: Pool): Hono => {
  const auth = new Hono();

  const handler = newAuthHandler(newAuthService(pool));

  auth.post("/register", (c) => handler.register(c));

  return auth;
};

export default authRouter;
