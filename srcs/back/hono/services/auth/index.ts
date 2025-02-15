import { Pool } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import { AuthService } from "../../interfaces/services/auth.ts";
import { RegisterRequest } from "../../interfaces/http/request/auth.ts";
import { register } from "./register.ts";

export class AuthServiceImpl implements AuthService {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }
  // registerメソッドを委譲
  async register(req: RegisterRequest): Promise<number> {
    return await register(this.pool, req);
  }
}

export const newAuthService = (pool: Pool): AuthServiceImpl => {
  return new AuthServiceImpl(pool);
};
