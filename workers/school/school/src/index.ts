import { Hono } from 'hono';
import schoolRoutes from './routes/school.routes';


type Env = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

// Monter les routes
app.route('/', schoolRoutes);

export default app;
