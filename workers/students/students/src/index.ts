import { Hono } from 'hono';
import { Client } from '@neondatabase/serverless';

type Env = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

function createDbClient(env: Env) {
  return new Client({
    connectionString: env.DATABASE_URL,
  });
}

// GET /student - lister tous les students avec leur parent
app.get('/student', async (c) => {
  const client = createDbClient(c.env);
  try {
    await client.connect();
    const res = await client.query(`
      SELECT s.id as student_id, s.name as student_name, s.email as student_email,
             p.id as parent_id, p.name as parent_name, p.email as parent_email
      FROM "Student" s
      LEFT JOIN "Parent" p ON s."parentId" = p.id
    `);

    const students = res.rows.map((row) => ({
      id: row.student_id,
      name: row.student_name,
      email: row.student_email,
      parent: row.parent_id ? {
        id: row.parent_id,
        name: row.parent_name,
        email: row.parent_email
      } : null
    }));

    return c.json(students);
  } catch (err: any) {
    console.error(err);
    return c.json({ error: 'Internal Server Error', details: err.message }, 500);
  } finally {
    await client.end();
  }
});

// POST /student - créer un student avec un parent
app.post('/student', async (c) => {
  const client = createDbClient(c.env);
  try {
    const { name, email, parentName, parentEmail } = await c.req.json();

    if (!name || !email || !parentName || !parentEmail) {
      return c.json({ error: 'Tous les champs sont requis' }, 400);
    }

    await client.connect();

    const parentRes = await client.query(
      `INSERT INTO "Parent" (name, email) VALUES ($1, $2) RETURNING id, name, email`,
      [parentName, parentEmail]
    );
    const parent = parentRes.rows[0];

    const studentRes = await client.query(
      `INSERT INTO "Student" (name, email, "parentId") VALUES ($1, $2, $3) RETURNING id, name, email`,
      [name, email, parent.id]
    );

    const student = studentRes.rows[0];
    student.parent = parent;

    return c.json(student);
  } catch (err: any) {
    console.error(err);
    if (err.code === '23505') {
      return c.json({ error: 'Un student ou parent avec cet email existe déjà.' }, 400);
    }
    return c.json({ error: 'Internal Server Error', details: err.message }, 500);
  } finally {
    await client.end();
  }
});

export default app;
