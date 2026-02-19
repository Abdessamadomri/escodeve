import { createDbClient } from '../shared/db.client';
import { Env, MarkAttendanceDto } from '../shared/types';

export async function markAttendance(env: Env, data: MarkAttendanceDto, schoolId: string) {
  const client = createDbClient(env);
  await client.connect();
  const res = await client.query(
    `INSERT INTO "Attendance" (id, "studentId", "lessonId", status, date, "schoolId", "createdAt")
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW()) RETURNING *`,
    [data.studentId, data.lessonId, data.status, data.date, schoolId]
  );
  await client.end();
  return res.rows[0];
}

export async function updateAttendance(env: Env, id: string, status: string) {
  const client = createDbClient(env);
  await client.connect();
  const res = await client.query(
    'UPDATE "Attendance" SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  await client.end();
  return res.rows[0];
}

export async function getAttendanceByLesson(env: Env, lessonId: string) {
  const client = createDbClient(env);
  await client.connect();
  const res = await client.query(
    `SELECT a.*, sp.matricule, u.email as student_email
     FROM "Attendance" a
     INNER JOIN "StudentProfile" sp ON a."studentId" = sp.id
     INNER JOIN "User" u ON sp."userId" = u.id
     WHERE a."lessonId" = $1
     ORDER BY a.date DESC`,
    [lessonId]
  );
  await client.end();
  return res.rows;
}
