import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../db/connection";
import CustomError from "../libs/errors/CustomError";
import { Request, Response } from "express";
import { questionSchema } from "../validators/questionValidator";
import { ZodError } from "zod";
import { Pagination } from "../libs/services/Pagination";
import { Question } from "@prisma/client";

class QuestionController
{
    protected readonly allowedTypes: string[] = ['text', 'checkbox', 'radio', 'email', 'dropdown'];

    public async index (req: Request, res: Response): Promise<Response>
    {
        const pagination = new Pagination<Question>();
        try {
            const { formId } = req.params;
            const { page, limit } = req.query;

            if (!formId || isNaN(parseInt(formId, 10))) {
                throw new CustomError('form id is invalid.', 400);
            }

            const pageQuery: number = parseInt(page as string, 10) || 1;
            const limitQuery: number = parseInt(limit as string, 10) || 5;

            if (pageQuery < 1 || limitQuery < 1) {
                throw new CustomError('page or size invalid', 400);
            }

            const questionsForm = await prisma.question.findMany({
                where: {
                    form_id: parseInt(formId, 10),
                }
            });

            const findTotal = async () => {
                return await prisma.question.count({
                    where: {
                        form_id: parseInt(formId, 10),
                    }
                });
            }

            const findPaginate = async (skip: number, take: number) => {
                return await prisma.question.findMany({
                    where: {
                        form_id: parseInt(formId, 10),
                    },
                    skip,
                    take,
                    orderBy: {
                        id: 'asc'
                    },
                });
            }

            const paginationResult = await pagination.paginate(questionsForm, findTotal, findPaginate, { page: pageQuery, limit: limitQuery });

            return res.status(200).json({
                status: true,
                ...paginationResult,
            });
        } catch (error) {
            return res
                .status(error instanceof CustomError ? error.statusCode : 500)
                .json({
                    status: false,
                    message: `failed to get questions: ${error instanceof Error ? error.message : error}`,
                });
        }
    }

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

    public async update (req: Request, res: Response): Promise<Response>
    {
        try {
            const { formId, questionId } = req.params;
            const payload = req.body;

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

            if (!this.allowedTypes.includes(payload.type)) {
                throw new CustomError('field \'type\' must be (text, dropdown, email, checkbox, radio)', 428);
            }

            const question = await prisma.question.update({
                where: {
                    id: parseInt(questionId, 10),
                    form_id: parseInt(formId, 10),
                },
                data: payload,
            });

            if (!question) {
                throw new CustomError('invalid input question.', 400);
            }

            return res.status(200).json({
                status: true,
                message: 'question successfully updated.',
                data: question,
            });
        } catch (error) {
            return res
                .status(error instanceof CustomError ? error.statusCode : 500)
                .json({
                    status: false,
                    message: `failed to update question: ${error instanceof Error ? error.message : error}`,
                });
        }
    }

    public async delete (req: Request, res: Response): Promise<Response>
    {
        try {
            const { formId, questionId } = req.params;

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

            const questionToBeDeleted = await prisma.question.delete({
                where: {
                    id: parsedQuestionId,
                    form_id: parsedFormId,
                },
            });

            if (!questionToBeDeleted) {
                throw new CustomError('invalid input question.', 400);
            }

            return res.status(200).json({
                status: true,
                message: `question '${questionToBeDeleted.question}' successfully deleted.`,
            });
        } catch (error) {
            return res
                .status(error instanceof CustomError ? error.statusCode : 500)
                .json({
                    status: false,
                    message: `failed to delete question: ${error instanceof Error ? error.message : error}`,
                });
        }
    }

}

export default new QuestionController;