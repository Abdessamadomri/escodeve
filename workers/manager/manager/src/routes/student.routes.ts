import { Hono } from "hono";
import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller";
import { handleError } from "../middlewares/error.middleware";
import {
  createStudentSchema,
  updateStudentSchema,
} from "../schemas/student.schema";
import { Env } from "../shared/types";
import { HTTP_STATUS, ERROR_MESSAGES } from "../shared/constants";

const app = new Hono<{ Bindings: Env }>();

app.get("/student", async (c) => {
  try {
    const students = await getAllStudents(c.env);
    return c.json(students, HTTP_STATUS.OK);
  } catch (err: any) {
    return handleError(err, c);
  }
});

app.post("/student", async (c) => {
  try {
    const data = await c.req.json();
    const validatedData = createStudentSchema.parse(data);
    const student = await createStudent(c.env, validatedData);
    return c.json(student, HTTP_STATUS.CREATED);
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

app.put("/student/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const data = await c.req.json();
    const validatedData = updateStudentSchema.parse(data);
    const student = await updateStudent(c.env, id, validatedData);

    if (!student) {
      return c.json({ error: ERROR_MESSAGES.NOT_FOUND }, HTTP_STATUS.NOT_FOUND);
    }

    return c.json(student, HTTP_STATUS.OK);
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

app.delete("/student/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const student = await deleteStudent(c.env, id);

    if (!student) {
      return c.json({ error: ERROR_MESSAGES.NOT_FOUND }, HTTP_STATUS.NOT_FOUND);
    }

    return c.json(
      { message: "Étudiant supprimé", data: student },
      HTTP_STATUS.OK,
    );
  } catch (err: any) {
    return handleError(err, c);
  }
});

export default app;
