import { Env, DashboardStats } from '../shared/types';

export async function getDashboardStats(env: Env, schoolId: string): Promise<DashboardStats> {
  return {
    totalTeachers: 15,
    totalStudents: 250,
    totalStaff: 8,
    totalRevenue: 125000,
    totalExpenses: 85000,
    netProfit: 40000
  };
}
