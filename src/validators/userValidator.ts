import { z } from 'zod';

export const User = z.object({
    first_name: z.string().min(3, 'first name at least 3 characters').max(50),
    last_name: z.string().max(50).optional(),
    email: z.string().email('must be a valid email').max(100),
    password: z.string().min(6, 'password at least 6 characters'),
    role_id: z.number().int().positive('role id must be positive integer'),
});