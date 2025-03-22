import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../db/connection";
import CustomError from "../libs/errors/CustomError";
import { Request, Response } from "express";
import { questionSchema } from "../validators/questionValidator";
import { ZodError } from "zod";
import { Question } from "@prisma/client";

class QuestionController
{

    public async create (req: Request, res: Response): Promise<Response>
    {
        try {
            const { formId } = req.params;
            const payload = req.body;
            const user: JwtPayload | { id: number } | undefined = req.user;

            if (!formId || isNaN(parseInt(formId, 10))) {
                throw new CustomError('invalid form id.', 400);
            }

            const userForm = await prisma.form.findUnique({
                where: {
                    id: parseInt(formId, 10),
                    user_id: user?.id,
                }
            })

            if (!userForm) {
                throw new CustomError('form not valid.', 400);
            }

            const validated = questionSchema.parse(payload);

            const newQuestion = await prisma.question.create({
                data: {
                    type: validated.type,
                    question: validated.question,
                    options: validated.options,
                    required: validated.required,
                    form_id: userForm.id,
                }
            });
            
            return res.status(201).json({
                status: true,
                message: 'question successfully created.',
                data: newQuestion,
            })
        } catch (error) {
            if (error instanceof ZodError) {
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

            return res
                .status(error instanceof CustomError ? error.statusCode : 500)
                .json({
                    status: false,
                    message: `failed to store new question: ${error instanceof Error ? error.message : error}`,
                });
        }
    }

}

export default new QuestionController;