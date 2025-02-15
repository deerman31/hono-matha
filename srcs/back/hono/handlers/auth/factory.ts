import { AuthServiceImpl } from "../../services/auth/index.ts";
import { AuthHandlerImpl } from "./index.ts";

export const newAuthHandler = (service: AuthServiceImpl): AuthHandlerImpl => {
  return new AuthHandlerImpl(service);
};