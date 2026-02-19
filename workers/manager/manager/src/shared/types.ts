export type Env = {
  DATABASE_URL: string;
};
export type CreateTeacherDto = {
  name: string;
  email: string;
  password: string;
  specialty: string;
  salaryType: "fixed" | "hourly";
  salaryAmount: number;
  schoolId: string;
};


export type UpdateTeacherDto = {
  specialty?: string;
  salaryType?: "fixed" | "hourly";
  salaryAmount?: number;
};

export type CreateStaffDto = {
  name: string;
  email: string;
  role: string;
  salaryAmount: number;
  schoolId: number;
};

export type UpdateStaffDto = Partial<Omit<CreateStaffDto, "schoolId">>;

export type CreateStudentDto = {
  name: string;
  email: string;
  schoolId: number;
  parentId?: number;
  classId?: number;
};

export type UpdateStudentDto = Partial<Omit<CreateStudentDto, "schoolId">>;

export type CreateParentDto = {
  name: string;
  email: string;
  phone?: string;
};

export type UpdateParentDto = Partial<CreateParentDto>;
