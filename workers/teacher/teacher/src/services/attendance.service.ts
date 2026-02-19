import { createDbClient } from '../shared/db.client';
import { Env } from '../shared/types';

export async function calculateAttendanceRate(env: Env, studentId: string) {
  const client = createDbClient(env);
  await client.connect();
  
  const res = await client.query(
    `SELECT 
       COUNT(*) as total,
       SUM(CASE WHEN status = 'PRESENT' THEN 1 ELSE 0 END) as present
     FROM "Attendance" 
     WHERE "studentId" = $1`,
    [studentId]
  );
  
  await client.end();
  
  const { total, present } = res.rows[0];
  return total > 0 ? (parseFloat(present) / parseFloat(total)) * 100 : 0;
}

export async function getAbsentStudents(env: Env, lessonId: string) {
  const client = createDbClient(env);
  await client.connect();
  
  const res = await client.query(
    `SELECT sp.*, u.email, pp."userId" as parent_user_id
     FROM "Attendance" a
     INNER JOIN "StudentProfile" sp ON a."studentId" = sp.id
     INNER JOIN "User" u ON sp."userId" = u.id
     INNER JOIN "ParentProfile" pp ON sp."parentId" = pp.id
     WHERE a."lessonId" = $1 AND a.status = 'ABSENT'`,
    [lessonId]
  );
  
  await client.end();
  return res.rows;
}
