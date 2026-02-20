import { Hono } from 'hono';
import { getDashboardStats } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { createDbClient } from '../shared/db.client';
import { Env } from '../shared/types';

const app = new Hono<{ Bindings: Env }>();

app.use('/*', authMiddleware);

app.get('/admin', async (c) => {
  try {
    const schoolId = (c as any).schoolId;
    
    const client = createDbClient(c.env);
    await client.connect();
    const schoolRes = await client.query('SELECT name FROM "School" WHERE id = $1', [schoolId]);
    await client.end();

    const stats = await getDashboardStats(c.env, schoolId);
    
    return c.json({
      schoolName: schoolRes.rows[0]?.name || 'Academy',
      stats: {
        totalTeachers: stats.totalTeachers,
        totalStudents: stats.totalStudents,
        totalRevenue: stats.totalRevenue
      }
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default app;
