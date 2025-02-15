// services/auth/factory.ts

import { UserRepository } from "../../interfaces/repositories/user.ts";
import { AuthServiceImpl } from "./index.ts";


export const newAuthService = (
  userRepository: UserRepository,
): AuthServiceImpl => {
  return new AuthServiceImpl(userRepository);
};
