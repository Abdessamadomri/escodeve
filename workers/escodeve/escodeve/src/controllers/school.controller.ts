import { createDbClient } from '../shared/db.client';
import { Env } from '../shared/types';

export async function getAllSchools(env: Env) {
  const client = createDbClient(env);
  await client.connect();
  const res = await client.query('SELECT * FROM "School"');
  await client.end();
  return res.rows;
}

export async function createSchool(env: Env, data: { name: string; logo?: string; plan?: string }) {
  const client = createDbClient(env);
  await client.connect();
  const res = await client.query(
    'INSERT INTO "School" (id, name, logo, plan) VALUES (gen_random_uuid(), $1, $2, $3) RETURNING *',
    [data.name, data.logo || null, data.plan || 'BASIC']
  );
  await client.end();
  return res.rows[0];
}

export async function updateSchool(env: Env, id: string, data: any) {
  const client = createDbClient(env);
  await client.connect();
  
  const fields = [];
  const values = [];
  let idx = 1;

  if (data.name) { fields.push(`name = $${idx++}`); values.push(data.name); }
  if (data.logo !== undefined) { fields.push(`logo = $${idx++}`); values.push(data.logo); }
  if (data.plan) { fields.push(`plan = $${idx++}`); values.push(data.plan); }
  if (data.isActive !== undefined) { fields.push(`"isActive" = $${idx++}`); values.push(data.isActive); }

  values.push(id);
  const res = await client.query(
    `UPDATE "School" SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  await client.end();
  return res.rows[0];
}

export async function deleteSchool(env: Env, id: string) {
  const client = createDbClient(env);
  await client.connect();
  await client.query('DELETE FROM "School" WHERE id = $1', [id]);
  await client.end();
}
