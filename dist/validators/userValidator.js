"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const zod_1 = require("zod");
exports.User = zod_1.z.object({
    first_name: zod_1.z.string().min(3, 'first name at least 3 characters').max(50),
    last_name: zod_1.z.string().max(50).optional(),
    email: zod_1.z.string().email('must be a valid email').max(100),
    password: zod_1.z.string().min(6, 'password at least 6 characters'),
    role_id: zod_1.z.number().int().positive('role id must be positive integer'),
});
