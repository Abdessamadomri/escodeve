import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { registerSuperAdmin, loginSuperAdmin } from '../controllers/auth.controller';
import { Env } from '../shared/types';

const app = new Hono<{ Bindings: Env }>();

app.post('/register-super-admin', async (c) => {
  try {
    const data = await c.req.json();
    const user = await registerSuperAdmin(c.env, data);
    return c.json({ message: 'Super Admin créé', user }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.post('/login', async (c) => {
  try {
    const data = await c.req.json();
    const user = await loginSuperAdmin(c.env, data);

    const accessToken = await sign(
      { id: user.id, email: user.email, role: user.role },
      c.env.JWT_SECRET
    );

    return c.json({ 
      accessToken,
      user: { 
        id: user.id, 
        email: user.email,
        nom: user.nom || '',
        prenom: user.prenom || '',
        role: user.role 
      } 
    });
  } catch (error: any) {
    const statusCode = error.message.includes('incorrect') ? 401 : 403;
    return c.json({ error: error.message }, statusCode);
  }
});

export default app;
