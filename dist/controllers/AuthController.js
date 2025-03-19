"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../db/connection");
const userValidator_1 = require("../validators/userValidator");
const zod_1 = require("zod");
const CustomError_1 = __importDefault(require("../libs/errors/CustomError"));
const AuthService_1 = __importDefault(require("../libs/services/AuthService"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config;
class AuthController {
    authService = new AuthService_1.default;
    static JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN || 'super duper secret access token';
    static JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN || 'super duper secret refresh token';
    async register(req, res) {
        const payloadUser = req.body;
        try {
            let validated = userValidator_1.User.parse(payloadUser);
            const isExistsUser = await connection_1.prisma.user.findUnique({ where: { email: validated.email } });
            if (isExistsUser) {
                throw new CustomError_1.default('email already registered.', 409);
            }
            const hashPassword = await this.authService.hashPassword(validated.password);
            const newUser = await connection_1.prisma.user.create({
                data: {
                    first_name: validated.first_name,
                    last_name: validated.last_name,
                    email: validated.email,
                    password: hashPassword,
                    role_id: validated.role_id,
                },
            });
            const accessToken = this.authService.generateToken(newUser, AuthController.JWT_ACCESS_TOKEN, { expiresIn: '1h' });
            const refreshToken = this.authService.generateToken(newUser, AuthController.JWT_REFRESH_TOKEN, { expiresIn: '1h' });
            return res.status(201).json({
                status: true,
                message: 'user successfully registered.',
                data: newUser,
                accessToken,
                refreshToken,
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
                return res.status(428).json({
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
    async login(req, res) {
        try {
            const { email: emailPayload, password: passwordPayload } = req.body;
            if (!emailPayload || !passwordPayload) {
                throw new CustomError_1.default('email and password are required.', 400);
            }
            const user = await connection_1.prisma.user.findUnique({ where: { email: emailPayload } });
            if (!user) {
                throw new CustomError_1.default('invalid email or password.', 404);
            }
            if (!await this.authService.comparePassword(passwordPayload, user.password)) {
                throw new CustomError_1.default('invalid email or password.', 401);
            }
            const accessToken = this.authService.generateToken(user, AuthController.JWT_ACCESS_TOKEN, { expiresIn: '1h' });
            const refreshToken = this.authService.generateToken(user, AuthController.JWT_REFRESH_TOKEN, { expiresIn: '7d' });
            return res.status(200).json({
                status: true,
                message: 'login success.',
                userInformation: {
                    fullName: `${user.first_name} ${user.last_name ?? ''}`.trim(),
                    email: user.email,
                },
                accessToken,
                refreshToken,
            });
        }
        catch (error) {
            return res.status(error instanceof CustomError_1.default ? error.statusCode : 500).json({
                status: false,
                message: `failed to login: ${error instanceof Error ? error.message : error}`,
            });
        }
    }
    async refreshToken(req, res) {
        try {
            const { token: tokenPayload } = req.body;
            if (!tokenPayload) {
                throw new CustomError_1.default('token doesn\'t exists.', 400);
            }
            const verifiedToken = this.authService.verifyToken(tokenPayload, AuthController.JWT_REFRESH_TOKEN);
            if (!verifiedToken || typeof verifiedToken !== 'object') {
                throw new CustomError_1.default('invalid or expired token.', 400);
            }
            const { iat, exp, ...userData } = verifiedToken;
            const accessToken = this.authService.generateToken(userData, AuthController.JWT_ACCESS_TOKEN, { expiresIn: '1h' });
            const refreshToken = this.authService.generateToken(userData, AuthController.JWT_REFRESH_TOKEN, { expiresIn: '7d' });
            return res.status(200).json({
                status: true,
                message: 'token successfully refreshed.',
                accessToken,
                refreshToken,
            });
        }
        catch (error) {
            return res.status(error instanceof CustomError_1.default ? error.statusCode : 500).json({
                status: false,
                message: `failed to refresh token: ${error instanceof Error ? error.message : error}`,
            });
        }
    }
}
exports.default = new AuthController;
