import { Hono } from "hono";
import { Pool } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import dbTest from "./dbTest.ts";
import authRouter from "./auth.ts";

const createRouter = (pool: Pool) => {
  const app = new Hono();
  const api = new Hono();

  // データベース接続のテスト用エンドポイント
  api.get("/db-test", dbTest(pool));

  api.get("/", (c) => {
    console.log("hello----------");
    return c.text("Hello Hono!");
  });

  api.route("/auth", authRouter(pool));

  // メインアプリケーションに/apiプレフィックスでAPIルートをマウント
  app.route("/api", api);

  return app;
};

export default createRouter;
