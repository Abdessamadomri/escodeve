import { Hono } from "hono";
import {
  getAllParents,
  createParent,
  updateParent,
  deleteParent,
} from "../controllers/parent.controller";
import { handleError } from "../middlewares/error.middleware";
import {
  createParentSchema,
  updateParentSchema,
} from "../schemas/parent.schema";
import { Env } from "../shared/types";
import { HTTP_STATUS, ERROR_MESSAGES } from "../shared/constants";

const app = new Hono<{ Bindings: Env }>();

app.get("/parent", async (c) => {
  try {
    const parents = await getAllParents(c.env);
    return c.json(parents, HTTP_STATUS.OK);
  } catch (err: any) {
    return handleError(err, c);
  }
});

app.post("/parent", async (c) => {
  try {
    const data = await c.req.json();
    const validatedData = createParentSchema.parse(data);
    const parent = await createParent(c.env, validatedData);
    return c.json(parent, HTTP_STATUS.CREATED);
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

app.put("/parent/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const data = await c.req.json();
    const validatedData = updateParentSchema.parse(data);
    const parent = await updateParent(c.env, id, validatedData);

    if (!parent) {
      return c.json({ error: ERROR_MESSAGES.NOT_FOUND }, HTTP_STATUS.NOT_FOUND);
    }

    return c.json(parent, HTTP_STATUS.OK);
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

app.delete("/parent/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const parent = await deleteParent(c.env, id);

    if (!parent) {
      return c.json({ error: ERROR_MESSAGES.NOT_FOUND }, HTTP_STATUS.NOT_FOUND);
    }

    return c.json({ message: "Parent supprimé", data: parent }, HTTP_STATUS.OK);
  } catch (err: any) {
    return handleError(err, c);
  }
});

export default app;
