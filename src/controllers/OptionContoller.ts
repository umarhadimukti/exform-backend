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

            const parsedQuestionId: number = parseInt(questionId, 10);

            if (!formId ||  isNaN(parsedQuestionId)) {
                throw new CustomError('form id or question id is invalid.', 400);
            }

            const userForm = await prisma.form.findUnique({
                where: {
                    id: formId,
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
                    option: opt.option,
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
                    status: true,
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

    public async update (req: Request, res: Response): Promise<Response>
    {
        try {
            const { formId, questionId, optionId } = req.params;
            const { user } = req;
            const payload = req.body;

            const parsedQuestionId: number = parseInt(questionId, 10);

            if (!formId ||  isNaN(parsedQuestionId)) {
                throw new CustomError('form id or question id is invalid.', 400);
            }

            const userForm = await prisma.form.findUnique({
                where: {
                    id: formId,
                    user_id: user?.id,
                }
            });

            if (!userForm) {
                throw new CustomError('form not valid.', 400);
            }

            const existingQuestion = await prisma.question.findFirst({
                where: {
                    id: parsedQuestionId,
                    form_id: formId,
                },
            });

            if (!existingQuestion) {
                throw new CustomError('question doesn\'t belong to the specified form', 404);
            }

            const existingOptions = Array.isArray(existingQuestion?.options) ? existingQuestion?.options as any[] : [];

            const optionIndex = existingOptions.findIndex(opt => opt.id === optionId);

            if (optionIndex === -1 ) {
                throw new CustomError('options not found.', 404);
            }

            const updatedOptions = [...existingOptions];
            updatedOptions[optionIndex] = {
                ...updatedOptions[optionIndex],
                option: payload.option,
            };

            const updatedQuestion = await prisma.question.update({
                where: {
                    id: parsedQuestionId,
                },
                data: {
                    options: updatedOptions,
                },
            });

            return res.status(200).json({
                status: true,
                message: `option successfully updated.`,
                data: updatedQuestion,
            });
        } catch (error) {
            return res
                .status(error instanceof CustomError ? error.statusCode : 500)
                .json({
                    status: false,
                    message: `failed to update option: ${error instanceof Error ? error.message : error}`,
                });
        }
    }

    public async delete (req: Request, res: Response): Promise<Response>
    {
        try {
            const { formId, questionId, optionId } = req.params;
            const { user } = req;

            const parsedQuestionId: number = parseInt(questionId, 10);

            if (formId ||  isNaN(parsedQuestionId)) {
                throw new CustomError('form id or question id is invalid.', 400);
            }

            const userForm = await prisma.form.findUnique({
                where: {
                    id: formId,
                    user_id: user?.id,
                }
            });

            if (!userForm) {
                throw new CustomError('form not valid.', 400);
            }

            const existingQuestion = await prisma.question.findFirst({
                where: {
                    id: parsedQuestionId,
                    form_id: formId,
                },
            });

            if (!existingQuestion) {
                throw new CustomError('question doesn\'t belong to the specified form', 404);
            }

            const existingOptions = Array.isArray(existingQuestion?.options) ? existingQuestion?.options as any[] : [];

            
            const filteredOptions = existingOptions.filter(opt => opt.id !== optionId);

            if (filteredOptions.length === existingOptions.length) {
                throw new CustomError('options not found.', 404);
            }

            const updatedQuestion = await prisma.question.update({
                where: {
                    id: parsedQuestionId,
                },
                data: {
                    options: filteredOptions
                },
            });

            return res.status(200).json({
                status: true,
                message: `option successfully deleted.`,
                data: updatedQuestion,
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