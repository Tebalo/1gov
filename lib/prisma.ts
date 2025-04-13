import { PrismaClient } from '@prisma/client'

// This prevents connection during build time
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

// This is crucial for Vercel - don't initialize in production
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma