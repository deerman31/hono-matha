import { RegisterRequest } from "../../interfaces/dto/auth.ts";
import { HTTPException } from "hono/http-exception";
import { hashPassword } from "./utils/password.ts";
import { UserRepository } from "../../interfaces/repositories/user.ts";

const registerService = async (
  repository: UserRepository,
  req: RegisterRequest,
): Promise<number> => {
    return await repository.withTransaction(async (repo) => {
    // 1. パスワード一致確認
    if (req.password !== req.repassword) {
      throw new HTTPException(400, { message: "Passwords do not match" });
    }
    // 2. 重複チェック
    const duplicateCheck = await repo.checkDuplicateCredentials(
      req.username,
      req.email,
    );
    if (duplicateCheck.usernameExists && duplicateCheck.emailExists) {
      throw new HTTPException(409, {
        message: "Username and email already taken",
      });
    }
    if (duplicateCheck.usernameExists) {
      throw new HTTPException(409, { message: "Username already taken" });
    }
    if (duplicateCheck.emailExists) {
      throw new HTTPException(409, { message: "Email already taken" });
    }
    // 3. パスワードハッシュ化
    const hashedPassword = await hashPassword(req.password);
    // 4. ユーザー作成
    return await repo.create({
      username: req.username,
      email: req.email,
      passwordHash: hashedPassword,
    });
  });
};

export default registerService;
