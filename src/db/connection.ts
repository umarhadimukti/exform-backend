import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export default async function connectDB() {
    try {
        await prisma.$connect();
        console.log('database connected ✅');
        return prisma;
    } catch (err) {
        console.log(`connection error ❌: ${err instanceof Error ? err.message : err}`);
        await prisma.$disconnect();
        process.exit(1);
    }
}