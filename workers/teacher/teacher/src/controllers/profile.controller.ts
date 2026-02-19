import { createDbClient } from '../shared/db.client';
import { Env } from '../shared/types';
import * as bcrypt from 'bcryptjs';

export async function getProfile(env: Env, teacherId: string) {
  const client = createDbClient(env);
  await client.connect();
  const res = await client.query(
    `SELECT u.id, u.email, u.role, tp.specialty, tp."salaryFixe", tp."hourlyRate"
     FROM "User" u
     LEFT JOIN "TeacherProfile" tp ON u.id = tp."userId"
     WHERE u.id = $1`,
    [teacherId]
  );
  await client.end();
  return res.rows[0];
}

export async function updatePassword(env: Env, teacherId: string, oldPassword: string, newPassword: string) {
  const client = createDbClient(env);
  await client.connect();
  
  const userRes = await client.query('SELECT password FROM "User" WHERE id = $1', [teacherId]);
  
  if (!await bcrypt.compare(oldPassword, userRes.rows[0].password)) {
    await client.end();
    throw new Error('Ancien mot de passe incorrect');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await client.query('UPDATE "User" SET password = $1 WHERE id = $2', [hashedPassword, teacherId]);
  await client.end();
}
