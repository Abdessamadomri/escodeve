import { z } from "zod";

export const createStudentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  schoolId: z.number().int().positive(),
  parentId: z.number().int().positive().optional(),
  classId: z.number().int().positive().optional(),
});

export const updateStudentSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  parentId: z.number().int().positive().optional(),
  classId: z.number().int().positive().optional(),
});
