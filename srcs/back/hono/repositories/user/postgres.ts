// repositories/user/postgres.ts
import {
  CreateUserDTO,
  DuplicateCheckResult,
  UserRepository,
} from "../../interfaces/repositories/user.ts";
import { Pool, PoolClient } from "https://deno.land/x/postgres@v0.19.3/mod.ts";

export class PostgresUserRepository implements UserRepository {
  private client: PoolClient | null = null;

  constructor(private readonly poolOrClient: Pool | PoolClient) {
    if (poolOrClient instanceof PoolClient) {
      this.client = poolOrClient;
    }
  }

  private async getClient(): Promise<PoolClient> {
    if (this.client) {
      return this.client;
    }
    return await (this.poolOrClient as Pool).connect();
  }

  async create(user: CreateUserDTO): Promise<number> {
    const client = await this.getClient();
    try {
      const query = `
        INSERT INTO users (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id
      `;
      const result = await client.queryArray<[number]>(
        query,
        [user.username, user.email, user.passwordHash],
      );
      return result.rows[0][0];
    } finally {
      client.release();
    }
  }

  async checkDuplicateCredentials(
    username: string,
    email: string,
  ): Promise<DuplicateCheckResult> {
    const client = await this.getClient();
    try {
      const query = `
        SELECT 
          EXISTS(SELECT 1 FROM users WHERE username = $1) as username_exists,
          EXISTS(SELECT 1 FROM users WHERE email = $2) as email_exists
      `;
      const result = await client.queryObject<{
        username_exists: boolean;
        email_exists: boolean;
      }>(query, [username, email]);

      return {
        usernameExists: result.rows[0].username_exists,
        emailExists: result.rows[0].email_exists,
      };
    } finally {
      client.release();
    }
  }

  async withTransaction<T>(
    operation: (repository: UserRepository) => Promise<T>,
  ): Promise<T> {
    if (this.client) {
      // すでにトランザクション内の場合は、現在のインスタンスを使用
      return await operation(this);
    }

    const client = await (this.poolOrClient as Pool).connect();
    try {
      await client.queryArray("BEGIN");
      const transactionRepository = new PostgresUserRepository(client);
      const result = await operation(transactionRepository);
      await client.queryArray("COMMIT");
      return result;
    } catch (error) {
      await client.queryArray("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
