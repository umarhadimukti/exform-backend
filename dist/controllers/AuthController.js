"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../db/connection");
const userValidator_1 = require("../validators/userValidator");
const bcryptjs_1 = require("bcryptjs");
const zod_1 = require("zod");
const CustomError_1 = __importDefault(require("../libs/errors/CustomError"));
class AuthController {
    async register(req, res) {
        const payloadUser = req.body;
        try {
            let validated = userValidator_1.User.parse(payloadUser);
            const isExistsUser = await connection_1.prisma.user.findUnique({ where: { email: validated.email } });
            if (isExistsUser) {
                throw new CustomError_1.default('email already registered.', 409);
            }
            const hashPassword = await (0, bcryptjs_1.hash)(validated.password, await (0, bcryptjs_1.genSalt)(10));
            const newUser = await connection_1.prisma.user.create({
                data: {
                    first_name: validated.first_name,
                    last_name: validated.last_name,
                    email: validated.email,
                    password: hashPassword,
                    role_id: validated.role_id,
                },
            });
            return res.status(201).json({
                status: true,
                message: 'user successfully registered.',
                data: newUser,
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const formattedErrors = error.errors.map(err => {
                    return ({
                        field: err.path.join('.'),
                        message: err.message,
                    });
                });
                return res.status(400).json({
                    status: false,
                    message: formattedErrors,
                });
            }
            if (error instanceof CustomError_1.default) {
                return res.status(error.statusCode).json({
                    status: false,
                    message: `failed to register new user: ${error.message}`,
                });
            }
            return res.status(500).json({
                status: false,
                message: `failed to register new user: ${error instanceof Error ? error.message : error}`,
            });
        }
    }
}
exports.default = new AuthController;
