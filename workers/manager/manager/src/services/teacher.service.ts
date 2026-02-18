import { Env } from "../shared/types";
import { createDbClient } from "../shared/db.client";

export class TeacherService {
  /**
   * Calcule le salaire mensuel d'un professeur
   */
  static calculateMonthlySalary(
    salaryType: string,
    salaryAmount: number,
    hoursWorked: number = 160,
  ): number {
    if (salaryType === "fixed") {
      return salaryAmount;
    }

    if (salaryType === "hourly") {
      return salaryAmount * hoursWorked;
    }

    return 0;
  }

  /**
   * Vérifie si un professeur a des classes assignées
   */
  static async hasAssignedClasses(
    env: Env,
    teacherId: string,
  ): Promise<boolean> {
    const client = createDbClient(env);
    try {
      await client.connect();
      const res = await client.query(
        `SELECT COUNT(*) as count FROM "Class" WHERE "teacherId" = $1`,
        [teacherId],
      );
      return parseInt(res.rows[0].count) > 0;
    } finally {
      await client.end();
    }
  }

  /**
   * Obtient les statistiques d'un professeur
   */
  static async getTeacherStats(env: Env, teacherId: string) {
    const client = createDbClient(env);
    try {
      await client.connect();
      const classesRes = await client.query(
        `SELECT COUNT(*) as count FROM "Class" WHERE "teacherId" = $1`,
        [teacherId],
      );

      const studentsRes = await client.query(
        `SELECT COUNT(*) as count FROM "Student" s
         JOIN "Class" c ON s."classId" = c.id
         WHERE c."teacherId" = $1`,
        [teacherId],
      );

      return {
        totalClasses: parseInt(classesRes.rows[0].count),
        totalStudents: parseInt(studentsRes.rows[0].count),
      };
    } finally {
      await client.end();
    }
  }
}
