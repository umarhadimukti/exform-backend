import { z } from "zod";

export const answerSchema = z.object({
    value: z.string({
        message: 'value must be a string',
    }).min(2, 'value at least 2 characters'),
});