"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../db/connection");
class UserController {
    async index(req, res) {
        const users = await connection_1.prisma.user.findMany();
        return res.status(200).json({
            status: true,
            length: users.length,
            data: users,
        });
    }
    async show(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new Error('user_id is required.');
        }
        try {
            const user = await connection_1.prisma.user.findUnique({
                where: { id: Number(id) },
            });
            return res.status(200).json({
                status: true,
                data: user
            });
        }
        catch (err) {
            return res.status(400).json({
                status: false,
                message: `failed to get user ❌: ${err instanceof Error ? err.message : err}`,
            });
        }
    }
    async create(req, res) {
        const payload = req.body;
        try {
            const newUser = await connection_1.prisma.user.create({
                data: payload,
            });
            return res.status(201).json({
                status: true,
                message: `success to store new user ✅`,
                data: newUser,
            });
        }
        catch (err) {
            return res.status(400).json({
                status: false,
                message: `failed to store new user ❌: ${err instanceof Error ? err.message : err}`,
            });
        }
    }
}
exports.default = new UserController;
