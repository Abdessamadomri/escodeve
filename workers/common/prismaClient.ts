// common/prismaClient.ts
import { PrismaClient } from '@prisma/client/edge'; // ✅ Important !

let prisma: PrismaClient | null = null;

export function createPrismaClient(env: { DATABASE_URL: string }) {
  if (!prisma) {
    prisma = new PrismaClient({
      datasources: {
        db: { url: env.DATABASE_URL },
      },
    });
  }
  return prisma;
}
