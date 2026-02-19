import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { createDbClient } from '../shared/db.client';
import { Env } from '../shared/types';
import * as bcrypt from 'bcryptjs';

const app = new Hono<{ Bindings: Env }>();

app.post('/register-super-admin', async (c) => {
  try {
    const { name, email, password } = await c.req.json();
    const client = createDbClient(c.env);
    
    await client.connect();
    
    // Vérifier si un Super Admin existe déjà
    const checkRes = await client.query(
      'SELECT COUNT(*) as count FROM "User" WHERE role = $1',
      ['SUPER_ADMIN']
    );
    
    if (parseInt(checkRes.rows[0].count) > 0) {
      await client.end();
      return c.json({ error: 'Un Super Admin existe déjà' }, 400);
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const res = await client.query(
      'INSERT INTO "User" (id, name, email, password, role) VALUES (gen_random_uuid(), $1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, 'SUPER_ADMIN']
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
      user: { id: user.id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Endpoints temporaires pour gérer les Super Admins
app.get('/list-super-admins', async (c) => {
  const client = createDbClient(c.env);
  await client.connect();
  const res = await client.query('SELECT id, name, email FROM "User" WHERE role = $1', ['SUPER_ADMIN']);
  await client.end();
  return c.json(res.rows);
});

app.delete('/delete-super-admin/:id', async (c) => {
  const id = c.req.param('id');
  const client = createDbClient(c.env);
  await client.connect();
  await client.query('DELETE FROM "User" WHERE id = $1 AND role = $2', [id, 'SUPER_ADMIN']);
  await client.end();
  return c.json({ message: 'Super Admin supprimé' });
});

export default app;
