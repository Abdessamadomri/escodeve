import { Hono } from 'hono';
import { swaggerUI } from '@hono/swagger-ui';
import authRoutes from './routes/auth.routes';
import schoolRoutes from './routes/school.routes';
import { swaggerConfig } from './docs/swagger.config';
import { Env } from './shared/types';

const app = new Hono<{ Bindings: Env }>();

app.get('/swagger', swaggerUI({ url: '/api-doc.json' }));
app.get('/api-doc.json', (c) => c.json(swaggerConfig));

app.route('/auth', authRoutes);
app.route('/schools', schoolRoutes);

export default app;
