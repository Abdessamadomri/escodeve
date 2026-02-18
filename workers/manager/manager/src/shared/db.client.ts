import { Client } from "@neondatabase/serverless";
import { Env } from "./types";

export function createDbClient(env: Env): Client {
  return new Client({
    connectionString: env.DATABASE_URL,
  });
}
