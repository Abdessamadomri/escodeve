import { Hono } from 'hono';
import { getProfile, updatePassword } from '../controllers/profile.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { Env } from '../shared/types';

const app = new Hono<{ Bindings: Env }>();

app.use('/*', authMiddleware);

app.get('/', async (c) => {
  try {
    const teacherId = (c as any).teacherId;
    const profile = await getProfile(c.env, teacherId);
    return c.json(profile);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.put('/password', async (c) => {
  try {
    const teacherId = (c as any).teacherId;
    const { oldPassword, newPassword } = await c.req.json();
    await updatePassword(c.env, teacherId, oldPassword, newPassword);
    return c.json({ message: 'Mot de passe modifié' });
  } catch (error: any) {
    return c.json({ error: error.message }, error.message.includes('incorrect') ? 401 : 500);
  }
});

export default app;
