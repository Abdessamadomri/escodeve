import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { createDbClient } from '../shared/db.client';
import { Env } from '../shared/types';
import * as bcrypt from 'bcryptjs';

const app = new Hono<{ Bindings: Env }>();

app.post('/register-super-admin', async (c) => {
  try {
    const { email, password } = await c.req.json();
    const client = createDbClient(c.env);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await client.connect();
    const res = await client.query(
      'INSERT INTO "User" (id, email, password, role) VALUES (gen_random_uuid(), $1, $2, $3) RETURNING id, email, role',
      [email, hashedPassword, 'SUPER_ADMIN']
    );
    await client.end();

    return c.json({ message: 'Super Admin créé', user: res.rows[0] }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    const client = createDbClient(c.env);
    
    await client.connect();
    const res = await client.query('SELECT * FROM "User" WHERE email = $1', [email]);
    await client.end();

    const user = res.rows[0];
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return c.json({ error: 'Email ou mot de passe incorrect' }, 401);
    }

    if (user.role !== 'SUPER_ADMIN') {
      return c.json({ error: 'Accès refusé: Super Admin uniquement' }, 403);
    }

    const token = await sign(
      { id: user.id, email: user.email, role: user.role },
      c.env.JWT_SECRET
    );

    return c.json({ 
      token, 
      user: { id: user.id, email: user.email, role: user.role } 
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default app;
