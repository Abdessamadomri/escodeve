export type Env = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type CreateLessonDto = {
  day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
  startTime: string;
  endTime: string;
  groupId: string;
  classroomId: string;
  subjectId: string;
};

export type UpdateLessonDto = Partial<CreateLessonDto>;

export type MarkAttendanceDto = {
  studentId: string;
  lessonId: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  date: string;
};

export type CreateGradeDto = {
  studentId: string;
  subjectId: string;
  value: number;
  maxValue: number;
  comment?: string;
};

export type UpdateGradeDto = Partial<CreateGradeDto>;

export type AvailabilityDto = {
  day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};
