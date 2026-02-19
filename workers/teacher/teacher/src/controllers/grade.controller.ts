import { createDbClient } from '../shared/db.client';
import { Env, CreateGradeDto, UpdateGradeDto } from '../shared/types';

export async function createGrade(env: Env, data: CreateGradeDto, schoolId: string) {
  const client = createDbClient(env);
  await client.connect();
  const res = await client.query(
    `INSERT INTO "Grade" (id, "studentId", "subjectId", value, "maxValue", comment, "schoolId", "createdAt")
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
    [data.studentId, data.subjectId, data.value, data.maxValue, data.comment || null, schoolId]
  );
  await client.end();
  return res.rows[0];
}

export async function updateGrade(env: Env, id: string, data: UpdateGradeDto) {
  const client = createDbClient(env);
  await client.connect();
  
  const fields = [];
  const values = [];
  let idx = 1;

  if (data.value !== undefined) { fields.push(`value = $${idx++}`); values.push(data.value); }
  if (data.maxValue !== undefined) { fields.push(`"maxValue" = $${idx++}`); values.push(data.maxValue); }
  if (data.comment !== undefined) { fields.push(`comment = $${idx++}`); values.push(data.comment); }

  values.push(id);
  const res = await client.query(
    `UPDATE "Grade" SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  await client.end();
  return res.rows[0];
}

export async function deleteGrade(env: Env, id: string) {
  const client = createDbClient(env);
  await client.connect();
  await client.query('DELETE FROM "Grade" WHERE id = $1', [id]);
  await client.end();
}

export async function getGradesByStudent(env: Env, studentId: string) {
  const client = createDbClient(env);
  await client.connect();
  const res = await client.query(
    'SELECT * FROM "Grade" WHERE "studentId" = $1 ORDER BY "createdAt" DESC',
    [studentId]
  );
  await client.end();
  return res.rows;
}

export async function getGradesByGroup(env: Env, groupId: string) {
  const client = createDbClient(env);
  await client.connect();
  const res = await client.query(
    `SELECT g.*, sp.matricule, u.email as student_email
     FROM "Grade" g
     INNER JOIN "StudentProfile" sp ON g."studentId" = sp.id
     INNER JOIN "User" u ON sp."userId" = u.id
     WHERE sp."groupId" = $1
     ORDER BY g."createdAt" DESC`,
    [groupId]
  );
  await client.end();
  return res.rows;
}
