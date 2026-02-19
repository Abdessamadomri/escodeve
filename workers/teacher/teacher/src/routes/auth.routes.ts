import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { login } from '../controllers/auth.controller';
import { Env } from '../shared/types';

const app = new Hono<{ Bindings: Env }>();

app.post('/login', async (c) => {
  try {
    const data = await c.req.json();
    const user = await login(c.env, data);

    const token = await sign(
      { id: user.id, email: user.email, role: user.role, schoolId: user.schoolId },
      c.env.JWT_SECRET
    );

    return c.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error: any) {
    return c.json({ error: error.message }, error.message.includes('incorrect') ? 401 : 403);
  }
});

export default app;
