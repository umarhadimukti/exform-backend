"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.default = connectDB;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
async function connectDB() {
    try {
        await exports.prisma.$connect();
        console.log('database connected ✅');
        return exports.prisma;
    }
    catch (err) {
        console.log(`connection error ❌: ${err instanceof Error ? err.message : err}`);
        await exports.prisma.$disconnect();
        process.exit(1);
    }
}
