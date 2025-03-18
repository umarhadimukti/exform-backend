import { PrismaClient } from '@prisma/client';

export default function connectDB() {
    try {
        const prisma = new PrismaClient();
        if (!prisma) {
            throw new Error('failed connect to db 🔐');
        }
    } catch (err) {
        console.log(`connection error: ${err instanceof Error ? err.message : err}`);
    }
}