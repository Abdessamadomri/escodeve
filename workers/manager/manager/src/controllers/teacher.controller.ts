import { createDbClient } from "../shared/db.client";
import { Env, CreateTeacherDto, UpdateTeacherDto } from "../shared/types";

export async function getAllTeachers(env: Env) {
  const client = createDbClient(env);
  try {
    await client.connect();
    const res = await client.query(`
      SELECT t.*, s.name as school_name
      FROM "Teacher" t
      LEFT JOIN "School" s ON t."schoolId" = s.id
    `);
    return res.rows;
  } finally {
    await client.end();
  }
}

export async function createTeacher(env: Env, data: CreateTeacherDto) {
  const client = createDbClient(env);
  try {
    const { name, email, subject, salaryType, salaryAmount, schoolId } = data;
    await client.connect();
    const res = await client.query(
      `INSERT INTO "Teacher" (name, email, subject, "salaryType", "salaryAmount", "schoolId") 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, email, subject, salaryType, salaryAmount, schoolId],
    );
    return res.rows[0];
  } finally {
    await client.end();
  }
}

export async function updateTeacher(
  env: Env,
  id: string,
  data: UpdateTeacherDto,
) {
  const client = createDbClient(env);
  try {
    const { name, email, subject, salaryType, salaryAmount } = data;
    await client.connect();
    const res = await client.query(
      `UPDATE "Teacher" 
       SET name = $1, email = $2, subject = $3, "salaryType" = $4, "salaryAmount" = $5
       WHERE id = $6 RETURNING *`,
      [name, email, subject, salaryType, salaryAmount, id],
    );
    return res.rows[0];
  } finally {
    await client.end();
  }
}

export async function deleteTeacher(env: Env, id: string) {
  const client = createDbClient(env);
  try {
    await client.connect();
    const res = await client.query(
      `DELETE FROM "Teacher" WHERE id = $1 RETURNING *`,
      [id],
    );
    return res.rows[0];
  } finally {
    await client.end();
  }
}
