import { Hono } from 'hono';
import { createGrade, updateGrade, deleteGrade, getGradesByStudent, getGradesByGroup } from '../controllers/grade.controller';
import { calculateStudentAverage, getGroupStatistics } from '../services/grade.service';
import { authMiddleware } from '../middlewares/auth.middleware';
import { Env } from '../shared/types';

const app = new Hono<{ Bindings: Env }>();

app.use('/*', authMiddleware);

app.post('/', async (c) => {
  try {
    const schoolId = (c as any).schoolId;
    const data = await c.req.json();
    const grade = await createGrade(c.env, data, schoolId);
    return c.json(grade, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.put('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const data = await c.req.json();
    const grade = await updateGrade(c.env, id, data);
    return c.json(grade);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.delete('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    await deleteGrade(c.env, id);
    return c.json({ message: 'Note supprimée' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.get('/student/:studentId', async (c) => {
  try {
    const { studentId } = c.req.param();
    const grades = await getGradesByStudent(c.env, studentId);
    const average = await calculateStudentAverage(c.env, studentId);
    return c.json({ grades, average });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.get('/group/:groupId', async (c) => {
  try {
    const { groupId } = c.req.param();
    const grades = await getGradesByGroup(c.env, groupId);
    const statistics = await getGroupStatistics(c.env, groupId);
    return c.json({ grades, statistics });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default app;
