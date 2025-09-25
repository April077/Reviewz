// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Prevent multiple instances in development
const globalForPrisma = global as typeof globalThis & { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: ["query", "error"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
