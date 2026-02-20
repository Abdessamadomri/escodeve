export type Env = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type DashboardStats = {
  totalTeachers: number;
  totalStudents: number;
  totalStaff: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
};
