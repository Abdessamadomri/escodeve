import { Hono } from 'hono';
import { createSchool } from '../controllers/school.controller';

type Env = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.post('/school', async (c) => {
  try {
    const data = await c.req.json();
    const { name, address } = data;
    
    if (!name || !address) {
      return c.json({ error: 'Name et address sont requis' }, 400);
    }

    const school = await createSchool(c.env, data);
    return c.json(school);
  } catch (err: any) {
    return c.json({ error: 'Internal Server Error', details: err.message }, 500);
  }
});

export default app;
