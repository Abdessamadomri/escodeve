import { Hono } from 'hono';
import { markAttendance, updateAttendance, getAttendanceByLesson } from '../controllers/attendance.controller';
import { calculateAttendanceRate, getAbsentStudents } from '../services/attendance.service';
import { authMiddleware } from '../middlewares/auth.middleware';
import { Env } from '../shared/types';

const app = new Hono<{ Bindings: Env }>();

app.use('/*', authMiddleware);

app.post('/', async (c) => {
  try {
    const schoolId = (c as any).schoolId;
    const data = await c.req.json();
    const attendance = await markAttendance(c.env, data, schoolId);
    return c.json(attendance, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.put('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const { status } = await c.req.json();
    const attendance = await updateAttendance(c.env, id, status);
    return c.json(attendance);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.get('/lesson/:lessonId', async (c) => {
  try {
    const { lessonId } = c.req.param();
    const attendances = await getAttendanceByLesson(c.env, lessonId);
    return c.json(attendances);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.get('/lesson/:lessonId/absents', async (c) => {
  try {
    const { lessonId } = c.req.param();
    const absents = await getAbsentStudents(c.env, lessonId);
    return c.json(absents);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.get('/student/:studentId/rate', async (c) => {
  try {
    const { studentId } = c.req.param();
    const rate = await calculateAttendanceRate(c.env, studentId);
    return c.json({ studentId, attendanceRate: rate });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default app;
