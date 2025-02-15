import { Pool } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import { RegisterRequest } from "../http/request/auth.ts";

export interface AuthService {
  pool: Pool;
  register(req: RegisterRequest): Promise<number>;
  // constructor(pool: Pool) {
  //   this.pool = pool;
  // }

  // register(req: RegisterRequest): Promise<void>;
  /*
  register
  login
  等の関数を定義する。
  実装は別ファイルでいい。

   */
}
