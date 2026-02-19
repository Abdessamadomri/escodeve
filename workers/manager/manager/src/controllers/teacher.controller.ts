import { createDbClient } from "../shared/db.client";
import { Env, CreateTeacherDto, UpdateTeacherDto } from "../shared/types";
import * as bcrypt from "bcryptjs";

export async function getAllTeachers(env: Env) {
  const client = createDbClient(env);
  try {
    await client.connect();
    const res = await client.query(`
      SELECT u.id, u.name, u.email, tp.specialty, tp."salaryFixe", tp."hourlyRate", tp."schoolId"
      FROM "User" u
      JOIN "TeacherProfile" tp ON u.id = tp."userId"
      WHERE u.role = 'PROF'
    `);
    return res.rows;
  } finally {
    await client.end();
  }
}

export async function createTeacher(env: Env, data: CreateTeacherDto) {
  const client = createDbClient(env);
  try {
    const { name, email, password, specialty, salaryType, salaryAmount, schoolId } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await client.connect();
    await client.query('BEGIN');
    
    const userRes = await client.query(
      `INSERT INTO "User" (id, name, email, password, role, "schoolId") 
       VALUES (gen_random_uuid(), $1, $2, $3, 'PROF', $4) RETURNING id`,
      [name, email, hashedPassword, schoolId]
    );
    
    const userId = userRes.rows[0].id;
    const salaryFixe = salaryType === 'fixed' ? salaryAmount : null;
    const hourlyRate = salaryType === 'hourly' ? salaryAmount : null;
    
    const profileRes = await client.query(
      `INSERT INTO "TeacherProfile" (id, "userId", specialty, "salaryFixe", "hourlyRate", "schoolId") 
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5) RETURNING *`,
      [userId, specialty, salaryFixe, hourlyRate, schoolId]
    );
    
    await client.query('COMMIT');
    
    return { ...userRes.rows[0], ...profileRes.rows[0] };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    await client.end();
  }
}

export async function updateTeacher(env: Env, id: string, data: UpdateTeacherDto) {
  const client = createDbClient(env);
  try {
    const { specialty, salaryType, salaryAmount } = data;
    await client.connect();
    
    const salaryFixe = salaryType === 'fixed' ? salaryAmount : null;
    const hourlyRate = salaryType === 'hourly' ? salaryAmount : null;
    
    const res = await client.query(
      `UPDATE "TeacherProfile" 
       SET specialty = COALESCE($1, specialty), 
           "salaryFixe" = COALESCE($2, "salaryFixe"), 
           "hourlyRate" = COALESCE($3, "hourlyRate")
       WHERE "userId" = $4 RETURNING *`,
      [specialty, salaryFixe, hourlyRate, id]
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
    await client.query('BEGIN');
    
    await client.query(`DELETE FROM "TeacherProfile" WHERE "userId" = $1`, [id]);
    const res = await client.query(`DELETE FROM "User" WHERE id = $1 RETURNING *`, [id]);
    
    await client.query('COMMIT');
    return res.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    await client.end();
  }
}
