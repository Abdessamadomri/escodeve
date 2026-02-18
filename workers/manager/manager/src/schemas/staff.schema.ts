import { z } from "zod";

export const createStaffSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.string().min(2),
  salaryAmount: z.number().positive(),
  schoolId: z.number().int().positive(),
});

export const updateStaffSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.string().min(2).optional(),
  salaryAmount: z.number().positive().optional(),
});
