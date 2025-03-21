import { Request, Response } from "express";
import { prisma } from "../db/connection";
import CustomError from "../libs/errors/CustomError";
import { formSchema } from "../validators/formValidator";
import { z } from "zod";

class FormController
{
    public async create(req: Request, res: Response): Promise<Response>
    {
        try {
            const { body: payload, user } = req;
            
            const form = await prisma.form.create({
                data: {
                    title: payload.title,
                    description: payload.description,
                    user_id: user?.id,
                    invites: payload.invites,
                }
            });

            return res.status(201).json({
                status: true,
                message: `user successfully created.`,
                data: form,
            })
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors = error.errors.map(err => {
                    return ({
                        field: err.path.join('.'),
                        message: err.message,
                    });
                });

                return res.status(400).json({
                    status: false,
                    message: formattedErrors,
                });
            }

            return res
                .status(error instanceof CustomError ? error.statusCode : 500)
                .json({
                    status: false,
                    message: `failed to create new form: ${error instanceof Error ? error.message : error}`,
                });
        }
    }

    public async update (req: Request, res: Response): Promise<Response>
    {
        try {

            const { id: formId } = req.params;
            const { body: payload, user } = req;

            if (!formId || isNaN(parseInt(formId, 10))) {
                throw new CustomError('invalid form id.', 400);
            }

            const form = await prisma.form.findFirst({
                where: {
                    id: parseInt(formId),
                    user_id: user?.id,
                }
            })

            if (!form) {
                throw new CustomError('form not found.', 404);
            }

            const updatedForm = await prisma.form.update({
                where: {
                    id: parseInt(formId, 10),
                    user_id: user?.id,
                },
                data: payload
            });
            
            return res.status(200).json({
                status: true,
                message: 'user successfully updated.',
                data: updatedForm,
            })
        } catch (error) {
            return res
                .status(error instanceof CustomError ? error.statusCode : 500)
                .json({
                    status: false,
                    message: `failed to update user: ${error instanceof Error ? error.message : error}`,
                });
        }
    }

    public async show (req: Request, res: Response): Promise<Response>
    {
        try {
            const { id: formId } = req.params;
            const { user } = req;

            if (!formId || isNaN(parseInt(formId, 10))) {
                throw new CustomError('invalid form id.', 400);
            }

            if (!user) {
                throw new CustomError('unauthorized.', 403);
            }

            const form = await prisma.form.findFirst({
                where: {
                    id: parseInt(formId, 10),
                    user_id: user.id,
                }
            });

            if (!form) {
                throw new CustomError('form not found.', 404);
            }

            return res.status(200).json({
                status: true,
                data: form,
            })
        } catch (error) {
            return res
                .status(error instanceof CustomError ? error.statusCode : 500)
                .json({
                    status: false,
                    message: `failed to create new form: ${error instanceof Error ? error.message : error}`,
                });
        }
    }
}

export default new FormController;