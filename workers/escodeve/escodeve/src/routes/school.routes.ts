import { Hono } from 'hono';
import { getAllSchools, createSchool, updateSchool, deleteSchool } from '../controllers/school.controller';
import { Env } from '../shared/types';

const app = new Hono<{ Bindings: Env }>();

app.get('/', async (c) => {
  try {
    const schools = await getAllSchools(c.env);
    return c.json(schools);
  } catch (error: any) {
    console.error('GET Error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post('/', async (c) => {
  try {
    const data = await c.req.json();
    console.log('POST data:', data);
    const school = await createSchool(c.env, data);
    return c.json(school, 201);
  } catch (error: any) {
    console.error('POST Error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const data = await c.req.json();
    const school = await updateSchool(c.env, id, data);
    return c.json(school);
  } catch (error: any) {
    console.error('PUT Error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await deleteSchool(c.env, id);
    return c.json({ message: 'École supprimée' });
  } catch (error: any) {
    console.error('DELETE Error:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;
