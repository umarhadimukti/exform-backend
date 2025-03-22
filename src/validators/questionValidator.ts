import { z } from "zod";

export const questionSchema = z.object({
    type: z.string({
        required_error: "type is required",
        invalid_type_error: "type must be a string",
    }),
    question: z.string({
        required_error: "question is required",
        invalid_type_error: "question must be a string",
    }).min(4, 'question at least 4 characters.'),
    options: z.string().array().optional(),
    required: z.boolean({
        required_error: "required is required",
        invalid_type_error: "required must be a boolean",
    }),
});