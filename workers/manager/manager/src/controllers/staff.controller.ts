import { createDbClient } from "../shared/db.client";
import { Env, CreateStaffDto, UpdateStaffDto } from "../shared/types";

export async function getAllStaff(env: Env) {
  const client = createDbClient(env);
  try {
    await client.connect();
    const res = await client.query(`
      SELECT s.*, sc.name as school_name
      FROM "Staff" s
      LEFT JOIN "School" sc ON s."schoolId" = sc.id
    `);
    return res.rows;
  } finally {
    await client.end();
  }
}

export async function createStaff(env: Env, data: CreateStaffDto) {
  const client = createDbClient(env);
  try {
    const { name, email, role, salaryAmount, schoolId } = data;
    await client.connect();
    const res = await client.query(
      `INSERT INTO "Staff" (name, email, role, "salaryAmount", "schoolId") 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, role, salaryAmount, schoolId],
    );
    return res.rows[0];
  } finally {
    await client.end();
  }
}

export async function updateStaff(env: Env, id: string, data: UpdateStaffDto) {
  const client = createDbClient(env);
  try {
    const { name, email, role, salaryAmount } = data;
    await client.connect();
    const res = await client.query(
      `UPDATE "Staff" 
       SET name = $1, email = $2, role = $3, "salaryAmount" = $4
       WHERE id = $5 RETURNING *`,
      [name, email, role, salaryAmount, id],
    );
    return res.rows[0];
  } finally {
    await client.end();
  }
}

export async function deleteStaff(env: Env, id: string) {
  const client = createDbClient(env);
  try {
    await client.connect();
    const res = await client.query(
      `DELETE FROM "Staff" WHERE id = $1 RETURNING *`,
      [id],
    );
    return res.rows[0];
  } finally {
    await client.end();
  }
}
