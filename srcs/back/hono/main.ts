import { dbConfig } from "./config/dbConfig.ts";
import createPool from "./db/poolCreate.ts";
import createRouter from "./routes/createRouter.ts";

const config = dbConfig;

const pool = createPool(config, 20);

const app = createRouter(pool);

Deno.serve(app.fetch);
