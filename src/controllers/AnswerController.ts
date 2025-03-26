import { Request, Response } from "express";
import CustomError from "../libs/errors/CustomError";
import { prisma } from "../db/connection";
import { requiredButEmpty } from "../libs/requiredButEmpty";
import { PayloadAnswer, PayloadQuestionAnswers } from "../types/payloadType";

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
                        }
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

            const isEmptyAnswer = await requiredButEmpty(isUserForm, payload.data);

            if (isEmptyAnswer) throw new CustomError('answer is required.', 400);

            const answerToBeStore: PayloadAnswer[] = [];

            payload.data.forEach((data: PayloadQuestionAnswers) => {
                answerToBeStore.push({
                    user_id: user?.id,
                    form_id: parsedFormId,
                    question_id: data.question_id,
                    value: data.answer,
                });
            })

            const answerQuestion = await prisma.answer.createMany({ data: answerToBeStore });

            return res.status(201).json({
                status: true,
                message: 'answer successfully created.',
                data: answerQuestion,
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