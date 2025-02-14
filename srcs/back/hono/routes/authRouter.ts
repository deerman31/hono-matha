import { Pool } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import { Hono } from "hono";

const authRouter = (pool: Pool): Hono => {
  const auth = new Hono();
//   api.route("/auth", auth);
  return auth;
};

export default authRouter;