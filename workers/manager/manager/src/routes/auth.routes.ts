import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { login } from '../controllers/auth.controller';
import { createDbClient } from '../shared/db.client';
import { Env } from '../shared/types';
import * as bcrypt from 'bcryptjs';

const app = new Hono<{ Bindings: Env }>();

// Route temporaire pour créer un admin
app.post('/register-admin', async (c) => {
  try {
    const { nom, prenom, email, password, schoolId } = await c.req.json();
    const client = createDbClient(c.env);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await client.connect();
    const res = await client.query(
      'INSERT INTO "User" (id, nom, prenom, email, password, role, "schoolId") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6) RETURNING id, nom, prenom, email, role, "schoolId"',
      [nom, prenom, email, hashedPassword, 'ADMIN_ECOLE', schoolId]
    );
    await client.end();

    return c.json({ message: 'Admin créé', user: res.rows[0] }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.post('/login', async (c) => {
  try {
    const data = await c.req.json();
    const user = await login(c.env, data);

    const accessToken = await sign(
      { 
        id: user.id,
        role: user.role === 'ADMIN_ECOLE' ? 'ADMIN_SCHOOL' : user.role,
        schoolId: user.schoolId
      },
      c.env.JWT_SECRET
    );

    return c.json({ 
      accessToken,
      user: { 
        id: user.id,
        email: user.email,
        nom: user.nom || '',
        prenom: user.prenom || '',
        role: user.role === 'ADMIN_ECOLE' ? 'ADMIN_SCHOOL' : user.role,
        schoolId: user.schoolId
      } 
    });
  } catch (error: any) {
    const statusCode = error.message.includes('incorrect') ? 401 : 403;
    return c.json({ error: error.message }, statusCode);
  }
});

export default app;
