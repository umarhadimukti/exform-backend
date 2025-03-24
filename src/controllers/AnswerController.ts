import { Request, Response } from "express";
import CustomError from "../libs/errors/CustomError";
import { prisma } from "../db/connection";

class AnswerController
{

    public async create (req: Request, res: Response): Promise<Response>
    {
        try {
            const { user } = req;
            const { formId, questionId } = req.params;
            const payload = req.body;

            const parsedFormId: number= parseInt(formId, 10);
            const parsedQuestionId: number= parseInt(questionId, 10);

            if (isNaN(parsedFormId) || isNaN(parsedQuestionId)) throw new CustomError('form id or question id is invalid.', 400);

            const isUserForm = await prisma.form.findFirst({
                where: { user_id: user?.id }
            });

            if (!isUserForm) throw new CustomError('invalid form.', 400);

            const isQuestionForm = await prisma.question.findFirst({
                where: { form_id: parsedQuestionId },
            })

            if (!isQuestionForm) throw new CustomError('invalid question.', 400);

            const answerQuestion = await prisma.answer.create({
                data: {
                    user_id: user?.id,
                    form_id: parsedFormId,
                    question_id: parsedQuestionId,
                }
            })


            return res.status(201).json({ status: true, message: 'answer successfully created.', data: {} });
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