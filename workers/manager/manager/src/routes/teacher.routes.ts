import { Hono } from "hono";
import {
  getAllTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacher.controller";
import { handleError } from "../middlewares/error.middleware";
import {
  createTeacherSchema,
  updateTeacherSchema,
} from "../schemas/teacher.schema";
import { Env } from "../shared/types";
import { HTTP_STATUS, ERROR_MESSAGES } from "../shared/constants";

const app = new Hono<{ Bindings: Env }>();

app.get("/teacher", async (c) => {
  try {
    const teachers = await getAllTeachers(c.env);
    return c.json(teachers, HTTP_STATUS.OK);
  } catch (err: any) {
    return handleError(err, c);
  }
});

app.post("/teacher", async (c) => {
  try {
    const data = await c.req.json();
    const validatedData = createTeacherSchema.parse(data);
    const teacher = await createTeacher(c.env, validatedData);
    return c.json(teacher, HTTP_STATUS.CREATED);
  } catch (err: any) {
    if (err.name === "ZodError") {
      return c.json(
        { error: ERROR_MESSAGES.VALIDATION_ERROR, details: err.errors },
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return handleError(err, c);
  }
});

app.put("/teacher/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const data = await c.req.json();
    const validatedData = updateTeacherSchema.parse(data);
    const teacher = await updateTeacher(c.env, id, validatedData);

    if (!teacher) {
      return c.json({ error: ERROR_MESSAGES.NOT_FOUND }, HTTP_STATUS.NOT_FOUND);
    }

    return c.json(teacher, HTTP_STATUS.OK);
  } catch (err: any) {
    if (err.name === "ZodError") {
      return c.json(
        { error: ERROR_MESSAGES.VALIDATION_ERROR, details: err.errors },
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return handleError(err, c);
  }
});

app.delete("/teacher/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const teacher = await deleteTeacher(c.env, id);

    if (!teacher) {
      return c.json({ error: ERROR_MESSAGES.NOT_FOUND }, HTTP_STATUS.NOT_FOUND);
    }

    return c.json(
      { message: "Professeur supprimé", data: teacher },
      HTTP_STATUS.OK,
    );
  } catch (err: any) {
    return handleError(err, c);
  }
});

export default app;
