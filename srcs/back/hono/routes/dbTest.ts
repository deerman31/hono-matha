import { Pool } from "https://deno.land/x/postgres/mod.ts";
import { Context } from "hono";

const dbTest = (pool: Pool) => async (c: Context) => {
  console.log("dbTest----------");

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
};

export default dbTest;
