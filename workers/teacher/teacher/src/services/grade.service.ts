import { createDbClient } from '../shared/db.client';
import { Env } from '../shared/types';

export async function calculateStudentAverage(env: Env, studentId: string) {
  const client = createDbClient(env);
  await client.connect();
  
  const res = await client.query(
    `SELECT AVG(value / "maxValue" * 20) as average 
     FROM "Grade" 
     WHERE "studentId" = $1`,
    [studentId]
  );
  
  await client.end();
  return parseFloat(res.rows[0]?.average || 0);
}

export async function getGroupStatistics(env: Env, groupId: string) {
  const client = createDbClient(env);
  await client.connect();
  
  const res = await client.query(
    `SELECT 
       AVG(g.value / g."maxValue" * 20) as average,
       MIN(g.value / g."maxValue" * 20) as min,
       MAX(g.value / g."maxValue" * 20) as max,
       COUNT(*) as total_grades
     FROM "Grade" g
     INNER JOIN "StudentProfile" sp ON g."studentId" = sp.id
     WHERE sp."groupId" = $1`,
    [groupId]
  );
  
  await client.end();
  return res.rows[0];
}
