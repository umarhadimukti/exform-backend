import { Request, Response } from "express";
import CustomError from "../libs/errors/CustomError";
import { prisma } from "../db/connection";
import { JwtPayload } from "jsonwebtoken";
import { randomUUID } from "crypto";

class OptionController
{
    public async create (req: Request, res: Response): Promise<Response>
    {
        try {
            const { formId, questionId } = req.params;
            const { options } = req.body;
            const user: JwtPayload | { id: number } | undefined = req.user;

            const parsedFormId: number = parseInt(formId, 10);
            const parsedQuestionId: number = parseInt(questionId, 10);

            if (isNaN(parsedFormId) ||  isNaN(parsedQuestionId)) {
                throw new CustomError('form id or question id is invalid.', 400);
            }

            const userForm = await prisma.form.findUnique({
                where: {
                    id: parsedFormId,
                    user_id: user?.id,
                }
            })

            if (!userForm) {
                throw new CustomError('form not valid.', 400);
            }

            if (!Array.isArray(options)) {
                throw new CustomError('options must be an array.', 428);
            }

            const existingQuestion = await prisma.question.findUnique({
                where: { id: parsedQuestionId },
                select: { options: true },
            });

            if (!existingQuestion) {
                throw new CustomError('question not valid.', 400);
            }

            const optionsWithId = options.map((opt) => {
                return {
                    id: randomUUID(),
                    option: opt,
                };
            });

            const existingOptions = existingQuestion?.options || [];
            const allOptions = Array.isArray(existingOptions) ? [...existingOptions, ...optionsWithId] : optionsWithId;

            const updateOption = await prisma.question.update({
                where: { id: parsedQuestionId },
                data: {
                    options: allOptions, // push new option from payload
                },
            });

            return res
                .status(201)
                .json({
                    status: false,
                    message: `option successfully added.`,
                    data: updateOption,
                });
        } catch (error) {
            return res
                .status(error instanceof CustomError ? error.statusCode : 500)
                .json({
                    status: false,
                    message: `failed to add new option: ${error instanceof Error ? error.message : error}`,
                });
        }
    }

    public async delete (req: Request, res: Response): Promise<Response>
    {
        try {
            const { formId, questionId, option } = req.params;

            const parsedFormId: number = parseInt(formId, 10);
            const parsedQuestionId: number = parseInt(questionId, 10);

            if (isNaN(parsedFormId) ||  isNaN(parsedQuestionId)) {
                throw new CustomError('form id or question id is invalid.', 400);
            }

            const existingQuestion = await prisma.question.findFirst({
                where: {
                    id: parsedQuestionId,
                    form_id: parsedFormId,
                },
            });

            if (!existingQuestion) {
                throw new CustomError('question doesn\'t belong to the specified form', 404);
            }

            // const updatedOptions = await prisma.question.

            return res.status(200).json({
                status: true,
                message: `option successfully deleted.`,
            });
        } catch (error) {
            return res
                .status(error instanceof CustomError ? error.statusCode : 500)
                .json({
                    status: false,
                    message: `failed to delete option: ${error instanceof Error ? error.message : error}`,
                });
        }
    }
}

export default new OptionController;