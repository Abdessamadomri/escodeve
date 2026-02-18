import { createDbClient } from '../shared/db.client';
import { Env, CreateSchoolDto, UpdateSchoolDto } from '../shared/types';

export async function getAllSchools(env: Env) {
  const client = createDbClient(env);
  try {
    await client.connect();
    const res = await client.query('SELECT * FROM "School"');
    return res.rows;
  } finally {
    await client.end();
  }
}

export async function createSchool(env: Env, data: CreateSchoolDto) {
  const client = createDbClient(env);
  try {
    await client.connect();
    const res = await client.query(
      'INSERT INTO "School" (id, name, logo, plan) VALUES (gen_random_uuid(), $1, $2, $3) RETURNING *',
      [data.name, data.logo || null, data.plan || 'BASIC']
    );
    return res.rows[0];
  } finally {
    await client.end();
  }
}

export async function updateSchool(env: Env, id: string, data: UpdateSchoolDto) {
  const client = createDbClient(env);
  try {
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
    return res.rows[0];
  } finally {
    await client.end();
  }
}

export async function deleteSchool(env: Env, id: string) {
  const client = createDbClient(env);
  try {
    await client.connect();
    await client.query('DELETE FROM "School" WHERE id = $1', [id]);
  } finally {
    await client.end();
  }
}
