import { createDbClient } from '../shared/db.client';
import { Env } from '../shared/types';
import * as bcrypt from 'bcryptjs';

export async function registerSuperAdmin(env: Env, data: { nom: string; prenom: string; email: string; password: string }) {
  const client = createDbClient(env);
  await client.connect();
  
  // Vérifier si un Super Admin existe déjà
  const checkRes = await client.query('SELECT COUNT(*) FROM "User" WHERE role = $1', ['SUPER_ADMIN']);
  if (parseInt(checkRes.rows[0].count) > 0) {
    await client.end();
    throw new Error('Un Super Admin existe déjà');
  }
  
  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  const res = await client.query(
    'INSERT INTO "User" (id, nom, prenom, email, password, role) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5) RETURNING id, nom, prenom, email, role',
    [data.nom, data.prenom, data.email, hashedPassword, 'SUPER_ADMIN']
  );
  await client.end();
  
  return res.rows[0];
}

export async function loginSuperAdmin(env: Env, data: { email: string; password: string }) {
  const client = createDbClient(env);
  await client.connect();
  
  const res = await client.query('SELECT * FROM "User" WHERE email = $1', [data.email]);
  await client.end();

  const user = res.rows[0];
  
  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    throw new Error('Email ou mot de passe incorrect');
  }

  if (user.role !== 'SUPER_ADMIN') {
    throw new Error('Accès refusé: Super Admin uniquement');
  }

  return user;
}
