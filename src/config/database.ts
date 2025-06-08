import { PrismaClient } from '@prisma/client';
import { logSuccess, logError } from './logger';

let prisma: PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
  }
  prisma = global.__prisma;
}

export const connectDB = async () => {
  try {
    await prisma.$connect();
    logSuccess('Database connected successfully');
  } catch (error) {
    logError(error as Error, 'Database Connection');
    throw error;
  }
};

export const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    logSuccess('Database disconnected');
  } catch (error) {
    logError(error as Error, 'Database Disconnection');
  }
};

export { prisma };
