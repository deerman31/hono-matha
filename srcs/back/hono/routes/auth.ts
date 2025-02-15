import { Pool } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import { Hono } from "hono";
import { newAuthHandler } from "../handlers/auth/factory.ts";
import { PostgresUserRepository } from "../repositories/user/postgres.ts";

import { newAuthService } from "../services/auth/factory.ts";

const authRouter = (pool: Pool): Hono => {
  const auth = new Hono();

  //repositoryを作成
  const userRepository = new PostgresUserRepository(pool);

  //repositoryを渡して、serviceを作成

  const service = newAuthService(userRepository);
  const handler = newAuthHandler(service);

  auth.post("/register", (c) => handler.register(c));

  return auth;
};

export default authRouter;
