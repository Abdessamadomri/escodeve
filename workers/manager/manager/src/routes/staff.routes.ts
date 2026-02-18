import { Hono } from "hono";
import {
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../controllers/staff.controller";
import { handleError } from "../middlewares/error.middleware";
import { createStaffSchema, updateStaffSchema } from "../schemas/staff.schema";
import { Env } from "../shared/types";
import { HTTP_STATUS, ERROR_MESSAGES } from "../shared/constants";

const app = new Hono<{ Bindings: Env }>();

app.get("/staff", async (c) => {
  try {
    const staff = await getAllStaff(c.env);
    return c.json(staff, HTTP_STATUS.OK);
  } catch (err: any) {
    return handleError(err, c);
  }
});

app.post("/staff", async (c) => {
  try {
    const data = await c.req.json();
    const validatedData = createStaffSchema.parse(data);
    const staff = await createStaff(c.env, validatedData);
    return c.json(staff, HTTP_STATUS.CREATED);
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

app.put("/staff/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const data = await c.req.json();
    const validatedData = updateStaffSchema.parse(data);
    const staff = await updateStaff(c.env, id, validatedData);

    if (!staff) {
      return c.json({ error: ERROR_MESSAGES.NOT_FOUND }, HTTP_STATUS.NOT_FOUND);
    }

    return c.json(staff, HTTP_STATUS.OK);
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

app.delete("/staff/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const staff = await deleteStaff(c.env, id);

    if (!staff) {
      return c.json({ error: ERROR_MESSAGES.NOT_FOUND }, HTTP_STATUS.NOT_FOUND);
    }

    return c.json({ message: "Staff supprimé", data: staff }, HTTP_STATUS.OK);
  } catch (err: any) {
    return handleError(err, c);
  }
});

export default app;
