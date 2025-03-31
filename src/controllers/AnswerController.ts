import { Request, Response } from "express";
import CustomError from "../libs/errors/CustomError";
import { prisma } from "../db/connection";
import { requiredButEmpty } from "../libs/requiredButEmpty";
import { PayloadAnswer, PayloadQuestionAnswers } from "../types/payloadType";
import { availableAnswer } from "../libs/availableAnswer";
import { validateQuestionId } from "../libs/validateQuestionId";
import { validateEmail } from "../libs/validateEmail";
import { AnswerQuestion, QuestionForm } from "../types/questionType";

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
                    }
                }
            });

            const transformedQuestionForm = questionForm.map((question: QuestionForm) => {
                return {
                    id: question?.id,
                    form_id: question?.form_id,
                    question: question?.question,
                    answers: question?.answers.map((answer: AnswerQuestion) => answer.value),
                };
            });

            return res.status(200).json({
                status: true,
                data: transformedQuestionForm,
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

            const form = await prisma.form.findFirst({
                where: { id: parsedFormId },
                include: {
                    questions: true,
                },
            });

            if (!form) throw new CustomError('form not found.', 404);

            if (user?.id !== form.user_id || !form.is_public) {
                if (form?.invites.includes(user?.id)) throw new CustomError('invalid form.', 400);
            }

            // check if answer is required, but the value is empty.
            const isEmptyAnswer = await requiredButEmpty(form, payload.data);
            if (isEmptyAnswer) throw new CustomError('answer is required.', 400);

            // check question id is valid
            const isValidQuestion = validateQuestionId(form, payload.data);
            if (!isValidQuestion) throw new CustomError('question id is not valid.', 400);

            // check email is valid
            const isValidEmail = validateEmail(form, payload.data);
            if (!isValidEmail) throw new CustomError('email is not valid.', 400);

            // check if user's answer is not available in options
            const isAvailableAnswer = availableAnswer(form, payload.data);
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

            await prisma.answer.createMany({ data: answerToBeStore });

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