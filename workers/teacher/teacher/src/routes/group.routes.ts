import { Hono } from 'hono';
import { getTeacherGroups, getGroupStudents } from '../controllers/group.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { Env } from '../shared/types';

const app = new Hono<{ Bindings: Env }>();

app.use('/*', authMiddleware);

app.get('/', async (c) => {
  try {
    const teacherId =  (c as any).teacherId;
    const groups = await getTeacherGroups(c.env, teacherId);
    return c.json(groups);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.get('/:id/students', async (c) => {
  try {
    const { id } = c.req.param();
    const students = await getGroupStudents(c.env, id);
    return c.json(students);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default app;
