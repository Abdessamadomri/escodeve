import { Hono } from 'hono';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import lessonRoutes from './routes/lesson.routes';
import groupRoutes from './routes/group.routes';
import attendanceRoutes from './routes/attendance.routes';
import gradeRoutes from './routes/grade.routes';
import { Env } from './shared/types';

const app = new Hono<{ Bindings: Env }>();

app.route('/auth', authRoutes);
app.route('/profile', profileRoutes);
app.route('/lessons', lessonRoutes);
app.route('/groups', groupRoutes);
app.route('/attendance', attendanceRoutes);
app.route('/grades', gradeRoutes);

export default app;
