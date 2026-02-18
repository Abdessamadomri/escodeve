export type Env = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};

export type CreateSchoolDto = {
  name: string;
  logo?: string;
  plan?: 'BASIC' | 'PREMIUM';
};

export type UpdateSchoolDto = Partial<CreateSchoolDto> & {
  isActive?: boolean;
};
