import { Hono } from 'hono';
import { getAllLessons, getLessonById, createLesson, updateLesson, deleteLesson } from '../controllers/lesson.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { Env } from '../shared/types';

const app = new Hono<{ Bindings: Env }>();

app.use('/*', authMiddleware);

app.get('/', async (c) => {
  try {
    const teacherId =  (c as any).teacherId;
    const lessons = await getAllLessons(c.env, teacherId);
    return c.json(lessons);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const teacherId =  (c as any).teacherId;
    const lesson = await getLessonById(c.env, id, teacherId);
    return c.json(lesson);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.post('/', async (c) => {
  try {
    const teacherId =  (c as any).teacherId;
    const schoolId =  (c as any).schoolId;
    const data = await c.req.json();
    const lesson = await createLesson(c.env, teacherId, schoolId, data);
    return c.json(lesson, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.put('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const teacherId =  (c as any).teacherId;
    const data = await c.req.json();
    const lesson = await updateLesson(c.env, id, teacherId, data);
    return c.json(lesson);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.delete('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const teacherId =  (c as any).teacherId;
    await deleteLesson(c.env, id, teacherId);
    return c.json({ message: 'Lesson supprimée' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default app;
