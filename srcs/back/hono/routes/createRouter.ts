import { Hono } from "hono";
import { Pool } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import authRouter from "./auth.ts";

const createRouter = (pool: Pool) => {
  const app = new Hono();
  const api = new Hono();

  api.get("/", (c) => {
    return c.text("Hello Hono!");
  });

  api.route("/auth", authRouter(pool));

  // メインアプリケーションに/apiプレフィックスでAPIルートをマウント
  app.route("/api", api);

  return app;
};

export default createRouter;
