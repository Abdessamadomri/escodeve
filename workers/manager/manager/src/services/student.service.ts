import { Env } from "../shared/types";
import { createDbClient } from "../shared/db.client";

export class StudentService {
  /**
   * Assigne un étudiant à une classe
   */
  static async assignToClass(env: Env, studentId: string, classId: number) {
    const client = createDbClient(env);
    try {
      await client.connect();
      const res = await client.query(
        `UPDATE "Student" SET "classId" = $1 WHERE id = $2 RETURNING *`,
        [classId, studentId],
      );
      return res.rows[0];
    } finally {
      await client.end();
    }
  }

  /**
   * Obtient tous les étudiants d'un parent
   */
  static async getStudentsByParent(env: Env, parentId: number) {
    const client = createDbClient(env);
    try {
      await client.connect();
      const res = await client.query(
        `SELECT * FROM "Student" WHERE "parentId" = $1`,
        [parentId],
      );
      return res.rows;
    } finally {
      await client.end();
    }
  }

  /**
   * Vérifie si un étudiant peut être supprimé
   */
  static async canDelete(env: Env, studentId: string): Promise<boolean> {
    // Logique métier : vérifier si l'étudiant a des notes, absences, etc.
    return true;
  }
}
