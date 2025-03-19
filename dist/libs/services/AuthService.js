"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const bcryptjs_1 = require("bcryptjs");
const CustomError_1 = __importDefault(require("../errors/CustomError"));
class AuthService {
    async hashPassword(password) {
        const salt = await (0, bcryptjs_1.genSalt)(10);
        const hashPassword = await (0, bcryptjs_1.hash)(password, salt);
        return hashPassword;
    }
    async comparePassword(password, hashedPassword) {
        return await (0, bcryptjs_1.compare)(password, hashedPassword);
    }
    generateToken(payload, secretKey, options) {
        return (0, jsonwebtoken_1.sign)(payload, secretKey, options);
    }
    verifyToken(token, secretKey) {
        try {
            return (0, jsonwebtoken_1.verify)(token, secretKey);
        }
        catch (err) {
            throw new CustomError_1.default(`invalid or expired token.`, 400);
        }
    }
}
exports.default = AuthService;
