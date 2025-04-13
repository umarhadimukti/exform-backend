import { Request, Response } from 'express';
import { BaseController } from '../interfaces/ControllerInterface';
import { ZodError } from "zod";
import CustomError from '../libs/errors/CustomError';
import { Form } from '@prisma/client';
import { prisma } from '../db/connection';

class ResponseController extends BaseController {
    public async index(req: Request, res: Response): Promise<Response> {
        try {
           const { user } = req;
            const { formId } = req.params;

            if (!formId) throw new CustomError('invalid form id.', 400);

            const isUserForm: Form | null = await prisma.form.findFirst({
                where: { user_id: user?.id, id: formId }
            });
            if (!isUserForm) throw new CustomError('invalid form (you don\'t have access with this form.', 400);

            const answers = await prisma.answer.findMany({
                where: { form_id: isUserForm?.id },
                select: {
                    id: true,
                    user_id: true,
                    form_id: true,
                    question: {
                        select: { question: true },
                    },
                    value: true,
                },
                distinct: ['question_id'],
                orderBy: { created_at: 'desc' },
            });

            return res.status(200).json({
                status: true,
                length: answers?.length,
                answers,
            });
        } catch (error) {
            return this.handleError(res, error, 'failed to get data');
        }
    }

    private handleError(res: Response, error: unknown, message: string): Response {
        if (error instanceof ZodError) {
            const formattedErrors = error?.errors.map((err) => {
                return ({
                    field: err.path[0],
                    message: err.message,
                });
            })

            return res.status(428).json({ status: false, message: formattedErrors });
        }

        return res.status(error instanceof CustomError ? error.statusCode : 500).json({
            status: false,
            message: `${ message }: ${ error instanceof Error ? error.message : 'unknown error' }`,
        });
    }
}

export default new ResponseController;