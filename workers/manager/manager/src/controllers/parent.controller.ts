import { createDbClient } from "../shared/db.client";

type Env = {
  DATABASE_URL: string;
};

export async function getAllParents(env: Env) {
  const client = createDbClient(env);
  try {
    await client.connect();
    const res = await client.query(`
      SELECT p.id as parent_id, p.name as parent_name, p.email as parent_email, p.phone,
             s.id as student_id, s.name as student_name, s.email as student_email
      FROM "Parent" p
      LEFT JOIN "Student" s ON s."parentId" = p.id
    `);

    const parentsMap: Record<string, any> = {};
    res.rows.forEach((row) => {
      if (!parentsMap[row.parent_id]) {
        parentsMap[row.parent_id] = {
          id: row.parent_id,
          name: row.parent_name,
          email: row.parent_email,
          phone: row.phone,
          students: [],
        };
      }
      if (row.student_id) {
        parentsMap[row.parent_id].students.push({
          id: row.student_id,
          name: row.student_name,
          email: row.student_email,
        });
      }
    });

    return Object.values(parentsMap);
  } finally {
    await client.end();
  }
}

export async function createParent(env: Env, data: any) {
  const client = createDbClient(env);
  try {
    const { name, email, phone } = data;
    await client.connect();
    const res = await client.query(
      `INSERT INTO "Parent" (name, email, phone) VALUES ($1, $2, $3) RETURNING *`,
      [name, email, phone || null],
    );
    return res.rows[0];
  } finally {
    await client.end();
  }
}

export async function updateParent(env: Env, id: string, data: any) {
  const client = createDbClient(env);
  try {
    const { name, email, phone } = data;
    await client.connect();
    const res = await client.query(
      `UPDATE "Parent" SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *`,
      [name, email, phone || null, id],
    );
    return res.rows[0];
  } finally {
    await client.end();
  }
}

export async function deleteParent(env: Env, id: string) {
  const client = createDbClient(env);
  try {
    await client.connect();
    const res = await client.query(
      `DELETE FROM "Parent" WHERE id = $1 RETURNING *`,
      [id],
    );
    return res.rows[0];
  } finally {
    await client.end();
  }
}
