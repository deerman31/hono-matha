export interface DbConfig {
  user: string;
  password: string;
  database: string;
  hostname: string;
  port: number;
}

export const dbConfig: DbConfig = {
  user: Deno.env.get("POSTGRES_USER") || "ykusano",
  password: Deno.env.get("POSTGRES_PASSWORD") || "ykusano",
  database: Deno.env.get("POSTGRES_DB") || "matcha-db",
  hostname: Deno.env.get("POSTGRES_HOST") || "db",
  port: 5432,
};
