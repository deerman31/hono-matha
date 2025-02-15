import { RegisterRequest } from "../dto/auth.ts";

export interface AuthService {
  //pool: Pool;
  register(req: RegisterRequest): Promise<number>;
}
