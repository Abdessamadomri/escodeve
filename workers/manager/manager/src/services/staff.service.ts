import { Env } from "../shared/types";
import { createDbClient } from "../shared/db.client";

export class StaffService {
  /**
   * Obtient le staff par rôle
   */
  static async getStaffByRole(env: Env, role: string) {
    const client = createDbClient(env);
    try {
      await client.connect();
      const res = await client.query(`SELECT * FROM "Staff" WHERE role = $1`, [
        role,
      ]);
      return res.rows;
    } finally {
      await client.end();
    }
  }

  /**
   * Calcule le salaire total du staff d'une école
   */
  static async calculateTotalSalary(
    env: Env,
    schoolId: number,
  ): Promise<number> {
    const client = createDbClient(env);
    try {
      await client.connect();
      const res = await client.query(
        `SELECT SUM("salaryAmount") as total FROM "Staff" WHERE "schoolId" = $1`,
        [schoolId],
      );
      return parseFloat(res.rows[0].total) || 0;
    } finally {
      await client.end();
    }
  }
}
