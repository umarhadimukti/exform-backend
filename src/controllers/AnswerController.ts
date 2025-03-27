import { Request, Response } from "express";
import CustomError from "../libs/errors/CustomError";
import { prisma } from "../db/connection";
import { requiredButEmpty } from "../libs/requiredButEmpty";
import { PayloadAnswer, PayloadQuestionAnswers } from "../types/payloadType";
import { availableAnswer } from "../libs/availableAnswer";
import { validateQuestionId } from "../libs/validateQuestionId";

class AnswerController
{

    public async index (req: Request, res: Response): Promise<Response>
    {
        try {
            const { user } = req;
            const { formId } = req.params;

            const parsedFormId: number = parseInt(formId, 10);

            if (isNaN(parsedFormId)) {
                throw new CustomError('invalid form id.', 400);
            }

            const isUserForm = await prisma.form.findMany({
                where: { id: parsedFormId, user_id: user?.id },
            });

            if (!isUserForm) {
                throw new CustomError('this form doesn\'t belong to the user.', 403);
            }

            const questionForm = await prisma.question.findMany({
                where: { form_id: parsedFormId },
                select: {
                    id: true,
                    form_id: true,
                    question: true,
                    answers: {
                        select: {
                            value: true,
                        },
                        take: 1,
                        orderBy: { created_at: 'desc' }
                    }
                }
            });

            return res.status(200).json({
                status: true,
                data: questionForm,
            });
        } catch (error) {
            return res
                .status(error instanceof CustomError ? error.statusCode : 500)
                .json({
                    status: false,
                    message: `failed to get answers: ${error instanceof Error ? error.message : error}`,
                });
        }
    }

    public async create (req: Request, res: Response): Promise<Response>
    {
        try {
            const { user } = req;
            const { formId } = req.params;
            const payload = req.body;

            const parsedFormId: number= parseInt(formId, 10);

            if (isNaN(parsedFormId)) throw new CustomError('form id is invalid.', 400);

            const isUserForm = await prisma.form.findFirst({
                where: { id: parsedFormId, user_id: user?.id },
                include: {
                    questions: true,
                },
            });

            if (!isUserForm) throw new CustomError('invalid form.', 400);

            // check if answer is required, but the value is empty.
            const isEmptyAnswer = await requiredButEmpty(isUserForm, payload.data);
            if (isEmptyAnswer) throw new CustomError('answer is required.', 400);

            // check question id is valid
            const isValidQuestion = validateQuestionId(isUserForm, payload.data);
            if (!isValidQuestion) throw new CustomError('question id is not valid.', 400);

            // check if user's answer is not available in options
            const isAvailableAnswer = availableAnswer(isUserForm, payload.data);
            if (isAvailableAnswer) throw new CustomError('answer is not available in options.', 400);

            // store to db..
            const answerToBeStore: PayloadAnswer[] = [];

            payload.data.forEach((data: PayloadQuestionAnswers) => {
                answerToBeStore.push({
                    user_id: user?.id,
                    form_id: parsedFormId,
                    question_id: data.question_id,
                    value: Array.isArray(data.answer) ? data.answer.join(', ') : data.answer,
                });
            })

            const answerQuestion = await prisma.answer.createMany({ data: answerToBeStore });

            return res.status(201).json({
                status: true,
                message: 'answer successfully created.',
            });
        } catch (error) {
            return res
                .status(error instanceof CustomError ? error.statusCode : 500)
                .json({
                    status: false,
                    message: `failed to create new answer: ${error instanceof Error ? error.message : error}`,
                });
        }
    }

}

export default new AnswerController;