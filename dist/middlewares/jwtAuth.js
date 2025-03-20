"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = jwtAuth;
const CustomError_1 = __importDefault(require("../libs/errors/CustomError"));
const AuthService_1 = __importDefault(require("../libs/services/AuthService"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function jwtAuth() {
    const authService = new AuthService_1.default;
    const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN || 'asfdsfsdfw234';
    return async (req, res, next) => {
        try {
            const { authorization } = req.headers;
            if (!authorization) {
                throw new CustomError_1.default('unauthorized', 403);
            }
            const tokenParts = authorization.split(' ');
            if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
                throw new CustomError_1.default('invalid token format.', 400);
            }
            const token = tokenParts[1]; // Bearer <token>
            const verified = authService.verifyToken(token, JWT_ACCESS_TOKEN);
            if (!verified || typeof verified !== 'object') {
                throw new CustomError_1.default('invalid or expired token', 400);
            }
            req.user = verified;
            next();
        }
        catch (error) {
            res
                .status(error instanceof CustomError_1.default ? error.statusCode : 500)
                .json({
                status: false,
                message: `failed to access the page: ${error instanceof Error ? error.message : error}`,
            });
        }
    };
}
