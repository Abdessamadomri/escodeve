import { z } from "zod";

export const createTeacherSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  subject: z.string().min(2, "La matière doit contenir au moins 2 caractères"),
  salaryType: z.enum(["fixed", "hourly"]),
  salaryAmount: z.number().positive("Le salaire doit être positif"),
  schoolId: z.number().int().positive("schoolId invalide"),
});

export const updateTeacherSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  subject: z.string().min(2).optional(),
  salaryType: z.enum(["fixed", "hourly"]).optional(),
  salaryAmount: z.number().positive().optional(),
});
