import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
   
  var prisma: PrismaClient | undefined;
   
  var prismaPool: Pool | undefined;
}

const pool =
  global.prismaPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

const adapter = new PrismaPg(pool);

export const prisma =
  global.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
  global.prismaPool = pool;
}
