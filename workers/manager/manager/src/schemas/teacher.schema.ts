import { z } from "zod";

export const createTeacherSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  specialty: z.string().min(2, "La spécialité doit contenir au moins 2 caractères"),
  salaryType: z.enum(["fixed", "hourly"]),
  salaryAmount: z.number().positive("Le salaire doit être positif"),
  schoolId: z.string().uuid("schoolId invalide"),
});

export const updateTeacherSchema = z.object({
  specialty: z.string().min(2).optional(),
  salaryType: z.enum(["fixed", "hourly"]).optional(),
  salaryAmount: z.number().positive().optional(),
});
