import { AuthService } from "../../interfaces/services/auth.ts";
import { RegisterRequest } from "../../interfaces/dto/auth.ts";
import { UserRepository } from "../../interfaces/repositories/user.ts";
import registerService from "./register.ts";

export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}


  async register(req: RegisterRequest): Promise<number> {
    return await registerService(this.userRepository, req);
  }
}
