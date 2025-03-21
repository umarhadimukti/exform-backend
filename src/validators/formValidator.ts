import { z } from "zod";

export const formSchema = z.object({
    title: z.string().min(4, 'at least 4 characters.'),
    description: z.string().optional(),
    is_public: z.boolean().optional(),
    invites: z.string().array().optional(),
    user_id: z.number().optional(),
});