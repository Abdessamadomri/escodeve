import { Env } from "../shared/types";
import { createDbClient } from "../shared/db.client";

export class ParentService {
  /**
   * Lie plusieurs enfants à un parent
   */
  static async linkChildren(env: Env, parentId: number, studentIds: number[]) {
    const client = createDbClient(env);
    try {
      await client.connect();
      const promises = studentIds.map((studentId) =>
        client.query(`UPDATE "Student" SET "parentId" = $1 WHERE id = $2`, [
          parentId,
          studentId,
        ]),
      );
      await Promise.all(promises);
      return true;
    } finally {
      await client.end();
    }
  }

  /**
   * Obtient le nombre d'enfants d'un parent
   */
  static async getChildrenCount(env: Env, parentId: number): Promise<number> {
    const client = createDbClient(env);
    try {
      await client.connect();
      const res = await client.query(
        `SELECT COUNT(*) as count FROM "Student" WHERE "parentId" = $1`,
        [parentId],
      );
      return parseInt(res.rows[0].count);
    } finally {
      await client.end();
    }
  }
}
