import { Hono } from "hono";
import { Pool } from "https://deno.land/x/postgres/mod.ts";

const dbConfig = {
  user: Deno.env.get("POSTGRES_USER") || "ykusano",
  password: Deno.env.get("POSTGRES_PASSWORD") || "ykusano",
  database: Deno.env.get("POSTGRES_DB") || "matcha-db",
  hostname: Deno.env.get("POSTGRES_HOST") || "db",
  port: 5432,
};

const pool = new Pool(dbConfig, 20);

const app = new Hono();
const api = new Hono(); // APIルート用の新しいHonoインスタン


// データベース接続のテスト用エンドポイント
api.get("/db-test", async (c) => {
  const client = await pool.connect();
  try {
    const result = await client.queryArray("SELECT * FROM users;");
    return c.json({
      status: "success",
      data: result.rows,
    });
  } catch (error) {
    if (error instanceof Error) {
      return c.json({
        status: "error",
        message: error.message,
      }, 500);
    } else {
      return c.json({
        status: "error",
        message: "An unknown error occurred",
      }, 500);
    }
  } finally {
    client.release();
  }
});

api.get("/", (c) => {
  return c.text("Hello Hono!");
});

// メインアプリケーションに/apiプレフィックスでAPIルートをマウント
app.route("/api", api);


Deno.serve(app.fetch);
