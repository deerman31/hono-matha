import { Pool } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import { DbConfig } from "../config/dbConfig.ts";

const createPool = (config: DbConfig, poolNum: number): Pool => {
  const pool = new Pool(config, poolNum);
  return pool;
};

export default createPool;
