import { createDbClient } from '../shared/db.client';

type Env = {
  DATABASE_URL: string;
};

export async function createSchool(env: Env, data: any) {
  const client = createDbClient(env);
  try {
    const { name, address } = data;
    await client.connect();
    const res = await client.query(
      `INSERT INTO "School" (name, address) VALUES ($1, $2) RETURNING *`,
      [name, address]
    );
    return res.rows[0];
  } finally {
    await client.end();
  }
}
