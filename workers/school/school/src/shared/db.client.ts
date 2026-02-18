import { Client } from '@neondatabase/serverless';

type Env = {
  DATABASE_URL: string;
};

export function createDbClient(env: Env) {
  return new Client({
    connectionString: env.DATABASE_URL,
  });
}
