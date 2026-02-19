import { createDbClient } from '../shared/db.client';
import { Env } from '../shared/types';

export async function checkLessonConflicts(
  env: Env,
  teacherId: string,
  day: string,
  startTime: string,
  endTime: string,
  classroomId: string,
  groupId: string,
  excludeLessonId?: string
) {
  const client = createDbClient(env);
  await client.connect();

  const excludeClause = excludeLessonId ? `AND id != '${excludeLessonId}'` : '';

  const teacherConflict = await client.query(
    `SELECT * FROM "Lesson" 
     WHERE "teacherId" = $1 AND day = $2 
     AND "startTime" < $3 AND "endTime" > $4 ${excludeClause}`,
    [teacherId, day, endTime, startTime]
  );

  const classroomConflict = await client.query(
    `SELECT * FROM "Lesson" 
     WHERE "classroomId" = $1 AND day = $2 
     AND "startTime" < $3 AND "endTime" > $4 ${excludeClause}`,
    [classroomId, day, endTime, startTime]
  );

  const groupConflict = await client.query(
    `SELECT * FROM "Lesson" 
     WHERE "groupId" = $1 AND day = $2 
     AND "startTime" < $3 AND "endTime" > $4 ${excludeClause}`,
    [groupId, day, endTime, startTime]
  );

  await client.end();

  return {
    hasConflict: teacherConflict.rows.length > 0 || 
                 classroomConflict.rows.length > 0 || 
                 groupConflict.rows.length > 0,
    conflicts: {
      teacher: teacherConflict.rows,
      classroom: classroomConflict.rows,
      group: groupConflict.rows
    }
  };
}
