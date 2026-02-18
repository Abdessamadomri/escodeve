import { createDbClient } from "../shared/db.client";

type Env = {
  DATABASE_URL: string;
};

export async function getAllStudents(env: Env) {
  const client = createDbClient(env);
  try {
    await client.connect();
    const res = await client.query(`
      SELECT s.*, p.name as parent_name, c.name as class_name, sc.name as school_name
      FROM "Student" s
      LEFT JOIN "Parent" p ON s."parentId" = p.id
      LEFT JOIN "Class" c ON s."classId" = c.id
      LEFT JOIN "School" sc ON s."schoolId" = sc.id
    `);
    return res.rows;
  } finally {
    await client.end();
  }
}

export async function createStudent(env: Env, data: any) {
  const client = createDbClient(env);
  try {
    const { name, email, schoolId, parentId, classId } = data;
    await client.connect();
    const res = await client.query(
      `INSERT INTO "Student" (name, email, "schoolId", "parentId", "classId") 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, schoolId, parentId || null, classId || null],
    );
    return res.rows[0];
  } finally {
    await client.end();
  }
}

export async function updateStudent(env: Env, id: string, data: any) {
  const client = createDbClient(env);
  try {
    const { name, email, parentId, classId } = data;
    await client.connect();
    const res = await client.query(
      `UPDATE "Student" 
       SET name = $1, email = $2, "parentId" = $3, "classId" = $4
       WHERE id = $5 RETURNING *`,
      [name, email, parentId || null, classId || null, id],
    );
    return res.rows[0];
  } finally {
    await client.end();
  }
}

export async function deleteStudent(env: Env, id: string) {
  const client = createDbClient(env);
  try {
    await client.connect();
    const res = await client.query(
      `DELETE FROM "Student" WHERE id = $1 RETURNING *`,
      [id],
    );
    return res.rows[0];
  } finally {
    await client.end();
  }
}
