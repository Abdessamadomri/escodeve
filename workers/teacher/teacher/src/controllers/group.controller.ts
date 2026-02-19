import { createDbClient } from '../shared/db.client';
import { Env } from '../shared/types';

export async function getTeacherGroups(env: Env, teacherId: string) {
  const client = createDbClient(env);
  await client.connect();
  const res = await client.query(
    `SELECT DISTINCT g.* FROM "Group" g
     INNER JOIN "Lesson" l ON g.id = l."groupId"
     WHERE l."teacherId" = $1`,
    [teacherId]
  );
  await client.end();
  return res.rows;
}

export async function getGroupStudents(env: Env, groupId: string) {
  const client = createDbClient(env);
  await client.connect();
  const res = await client.query(
    `SELECT sp.*, u.email FROM "StudentProfile" sp
     INNER JOIN "User" u ON sp."userId" = u.id
     WHERE sp."groupId" = $1`,
    [groupId]
  );
  await client.end();
  return res.rows;
}
