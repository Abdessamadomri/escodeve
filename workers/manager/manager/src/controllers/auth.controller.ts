import { createDbClient } from '../shared/db.client';
import { Env, LoginDto } from '../shared/types';
import * as bcrypt from 'bcryptjs';

export async function login(env: Env, data: LoginDto) {
  const client = createDbClient(env);
  await client.connect();
  
  const res = await client.query('SELECT * FROM "User" WHERE email = $1', [data.email]);
  await client.end();

  const user = res.rows[0];
  
  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    throw new Error('Email ou mot de passe incorrect');
  }

  if (user.role !== 'ADMIN_ECOLE') {
    throw new Error('Accès refusé: Admin École uniquement');
  }

  return user;
}
