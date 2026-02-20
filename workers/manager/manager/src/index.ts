import { Hono } from "hono";
import { cors } from 'hono/cors';
import { swaggerUI } from "@hono/swagger-ui";
import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import teacherRoutes from "./routes/teacher.routes";
import staffRoutes from "./routes/staff.routes";
import studentRoutes from "./routes/student.routes";
import parentRoutes from "./routes/parent.routes";
import { swaggerConfig } from "./docs/swagger.config";
import { Env } from "./shared/types";

const app = new Hono<{ Bindings: Env }>();

app.use('/*', cors({
  origin: 'http://localhost:3000',
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.get("/swagger", swaggerUI({ url: "/api-doc.json" }));
app.get("/api-doc.json", (c) => c.json(swaggerConfig));

app.route("/auth", authRoutes);
app.route("/dashboard", dashboardRoutes);
app.route("/", teacherRoutes);
app.route("/", staffRoutes);
app.route("/", studentRoutes);
app.route("/", parentRoutes);

export default app;
