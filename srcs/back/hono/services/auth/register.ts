import { Pool, PoolClient } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import { RegisterRequest } from "../../interfaces/http/request/auth.ts";
import { HTTPException } from "hono/http-exception";

enum DuplicateError {
  Username = "username already taken",
  Email = "email already taken",
  UsernameEmail = "username and email already taken",
  None = "",
}

const registerService = async (pool: Pool, req: RegisterRequest) => {
  const client = await pool.connect();

  try {
    await client.queryArray("BEGIN");

    if (req.password !== req.repassword) {
      throw new HTTPException(400, { message: "Passwords do not match" });
    }

    const check = await checkDuplicateUserCredentials(
      client,
      req.username,
      req.email,
    );
    switch (check) {
      case DuplicateError.UsernameEmail:
      case DuplicateError.Username:
      case DuplicateError.Email:
        throw new HTTPException(409, { message: check });
    }
    const hashed = await hashPassword(req.password);
    // Create user
    const userId = await createUser(client, req.username, req.email, hashed);

    await client.queryArray("COMMIT");

    return userId;
  } catch (error) {
    await client.queryArray("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const createUser = async (
  client: PoolClient,
  username: string,
  email: string,
  hashed: string,
): Promise<number> => {
  const insertNewUserQuery = `
        INSERT INTO users (
            username, 
            email, 
            password_hash
        ) VALUES ($1, $2, $3)
		 RETURNING id
    `;

  // queryArrayでRETURNINGの結果を取得
  const result = await client.queryArray<[number]>(
    insertNewUserQuery,
    [username, email, hashed],
  );

  // rowsから最初の結果を取得
  const [id] = result.rows[0];
  return id;
};

const hashPassword = async (password: string): Promise<string> => {
  // パスワードをUint8Arrayに変換
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  // SHA-256でハッシュ化
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // ArrayBufferを16進数文字列に変換
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(
    "",
  );

  return hashHex;
};

const checkDuplicateUserCredentials = async (
  client: PoolClient,
  username: string,
  email: string,
): Promise<DuplicateError> => {
  const checkDuplicateCredentialsQuery = `
        SELECT 
            EXISTS(SELECT 1 FROM users WHERE username = $1) as username_exists,
            EXISTS(SELECT 1 FROM users WHERE email = $2) as email_exists
    `;
  const result = await client.queryObject<
    { username_exists: boolean; email_exists: boolean }
  >(checkDuplicateCredentialsQuery, [
    username,
    email,
  ]);
  const usernameExists = Boolean(result.rows[0]?.username_exists);
  const emailExists = Boolean(result.rows[0]?.email_exists);
  if (usernameExists && emailExists) {
    return DuplicateError.UsernameEmail;
  } else if (usernameExists) {
    return DuplicateError.Username;
  } else if (emailExists) {
    return DuplicateError.Email;
  } else {
    return DuplicateError.None;
  }
};

export default registerService;
