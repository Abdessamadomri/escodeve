import { createDbClient } from '../shared/db.client';
import { Env, CreateLessonDto, UpdateLessonDto } from '../shared/types';
import { checkLessonConflicts } from '../services/lesson.service';

export async function getAllLessons(env: Env, teacherId: string) {
  const client = createDbClient(env);
  await client.connect();
  const res = await client.query(
    `SELECT l.*, g.name as group_name, c.name as classroom_name 
     FROM "Lesson" l
     LEFT JOIN "Group" g ON l."groupId" = g.id
     LEFT JOIN "Classroom" c ON l."classroomId" = c.id
     WHERE l."teacherId" = $1
     ORDER BY l.day, l."startTime"`,
    [teacherId]
  );
  await client.end();
  return res.rows;
}

export async function getLessonById(env: Env, id: string, teacherId: string) {
  const client = createDbClient(env);
  await client.connect();
  const res = await client.query(
    `SELECT l.*, g.name as group_name, c.name as classroom_name 
     FROM "Lesson" l
     LEFT JOIN "Group" g ON l."groupId" = g.id
     LEFT JOIN "Classroom" c ON l."classroomId" = c.id
     WHERE l.id = $1 AND l."teacherId" = $2`,
    [id, teacherId]
  );
  await client.end();
  return res.rows[0];
}

export async function createLesson(env: Env, teacherId: string, schoolId: string, data: CreateLessonDto) {
  // Vérifier les conflits
  const conflicts = await checkLessonConflicts(
    env,
    teacherId,
    data.day,
    data.startTime,
    data.endTime,
    data.classroomId,
    data.groupId
  );

  if (conflicts.hasConflict) {
    throw new Error(`Conflit détecté: ${JSON.stringify(conflicts.conflicts)}`);
  }

  const client = createDbClient(env);
  await client.connect();
  const res = await client.query(
    `INSERT INTO "Lesson" (id, day, "startTime", "endTime", "teacherId", "groupId", "classroomId", "subjectId", "schoolId")
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [data.day, data.startTime, data.endTime, teacherId, data.groupId, data.classroomId, data.subjectId, schoolId]
  );
  await client.end();
  return res.rows[0];
}

export async function updateLesson(env: Env, id: string, teacherId: string, data: UpdateLessonDto) {
  // Vérifier les conflits si les horaires changent
  if (data.day || data.startTime || data.endTime || data.classroomId || data.groupId) {
    const currentLesson = await getLessonById(env, id, teacherId);
    
    const conflicts = await checkLessonConflicts(
      env,
      teacherId,
      data.day || currentLesson.day,
      data.startTime || currentLesson.startTime,
      data.endTime || currentLesson.endTime,
      data.classroomId || currentLesson.classroomId,
      data.groupId || currentLesson.groupId,
      id
    );

    if (conflicts.hasConflict) {
      throw new Error(`Conflit détecté: ${JSON.stringify(conflicts.conflicts)}`);
    }
  }

  const client = createDbClient(env);
  await client.connect();
  
  const fields = [];
  const values = [];
  let idx = 1;

  if (data.day) { fields.push(`day = $${idx++}`); values.push(data.day); }
  if (data.startTime) { fields.push(`"startTime" = $${idx++}`); values.push(data.startTime); }
  if (data.endTime) { fields.push(`"endTime" = $${idx++}`); values.push(data.endTime); }
  if (data.groupId) { fields.push(`"groupId" = $${idx++}`); values.push(data.groupId); }
  if (data.classroomId) { fields.push(`"classroomId" = $${idx++}`); values.push(data.classroomId); }

  values.push(id, teacherId);
  const res = await client.query(
    `UPDATE "Lesson" SET ${fields.join(', ')} WHERE id = $${idx} AND "teacherId" = $${idx + 1} RETURNING *`,
    values
  );
  await client.end();
  return res.rows[0];
}

export async function deleteLesson(env: Env, id: string, teacherId: string) {
  const client = createDbClient(env);
  await client.connect();
  await client.query('DELETE FROM "Lesson" WHERE id = $1 AND "teacherId" = $2', [id, teacherId]);
  await client.end();
}
