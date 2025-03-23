import { Request, Response } from "express";
import CustomError from "../libs/errors/CustomError";
import { prisma } from "../db/connection";
import { JwtPayload } from "jsonwebtoken";

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

            const updateOption = await prisma.question.update({
                where: { id: parsedQuestionId },
                data: {
                    options: { push: [...options] }, // push new option from payload
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
                    message: `failed to create new option: ${error instanceof Error ? error.message : error}`,
                });
        }
    }
}

export default new OptionController;