import { Hono } from "hono";
import { swaggerUI } from "@hono/swagger-ui";
import teacherRoutes from "./routes/teacher.routes";
import staffRoutes from "./routes/staff.routes";
import studentRoutes from "./routes/student.routes";
import parentRoutes from "./routes/parent.routes";
import { swaggerConfig } from "./docs/swagger.config";

type Env = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

// Documentation Swagger
app.get("/swagger", swaggerUI({ url: "/api-doc.json" }));
app.get("/api-doc.json", (c) => c.json(swaggerConfig));

// Monter toutes les routes
app.route("/", teacherRoutes);
app.route("/", staffRoutes);
app.route("/", studentRoutes);
app.route("/", parentRoutes);

export default app;
