import { Request, Response } from "express";
import { prisma } from "../db/connection";
import CustomError from "../libs/errors/CustomError";
import { formSchema } from "../validators/formValidator";
import { z } from "zod";
import { Pagination } from "../libs/services/Pagination";
import { Form } from "@prisma/client";

class FormController
{
    private async getUserId(email?: string): Promise<number> {
        if (!email) throw new CustomError('User email not found', 401);
      
        const user = await prisma.user.findUnique({
          where: { email },
          select: { id: true }
        });
      
        if (!user) throw new CustomError('User not found', 404);
      
        return user.id;
      }

    public async index (req: Request, res: Response): Promise<Response>
    {
        const pagination = new Pagination<Form>();

        try {
            const { user } = req;
            const { page, limit } = req.query;

            const pageQuery: number = parseInt(page as string, 10) || 1;
            const limitQuery: number = parseInt(limit as string, 10) || 15;

            if (pageQuery < 1 || limitQuery < 1) throw new CustomError('page or size invalid', 400);

            const userId: number = await this.getUserId(user?.email);

            // user forms
            const forms: Form[] = await prisma.form.findMany({
                where: { user_id: userId },
            });

            // find total row
            const findTotal = async (): Promise<number> => {
                return await prisma.form.count({ where: { user_id: user?.id } });
            }

            // find paginate
            const findPaginate = async (skip: number, take: number): Promise<Form[]> => {
                return await prisma.form.findMany({
                    where: { user_id: user?.id },
                    take,
                    skip,
                    orderBy: { created_at: 'desc' },
                })
            }

            const paginationResult = await pagination.paginate(forms, findTotal, findPaginate, { page: pageQuery, limit: limitQuery || 5 });

            return res.status(200).json({ status: true, ...paginationResult });
        } catch (error) {
            return res
                .status(error instanceof CustomError ? error.statusCode : 500)
                .json({
                    status: false,
                    message: `failed to get forms: ${error instanceof Error ? error.message : error}`,
                });
        }
    }

    public async create (req: Request, res: Response): Promise<Response>
    {
        try {
            const { body: payload, user } = req;

            const validated = formSchema.parse(payload);
            
            const userId: number = await this.getUserId(user?.email);
            
            const form = await prisma.form.create({
                data: {
                    title: validated.title,
                    description: validated.description,
                    user_id: userId,
                    invites: validated.invites,
                }
            });

            return res.status(201).json({
                status: true,
                message: `form successfully created.`,
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

                return res.status(428).json({
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

            if (!formId || typeof formId !== 'string') throw new CustomError('invalid form id.', 400);

            const userId: number = await this.getUserId(user?.email);

            const form = await prisma.form.findFirst({
                where: { id: formId, user_id: userId }
            })

            if (!form) throw new CustomError('form not found.', 404); 

            const updatedForm = await prisma.form.update({
                where: {
                    id: formId,
                    user_id: userId,
                },
                data: payload
            });
            
            return res.status(200).json({
                status: true,
                message: 'form successfully updated.',
                data: updatedForm,
            })
        } catch (error) {
            return res
                .status(error instanceof CustomError ? error.statusCode : 500)
                .json({
                    status: false,
                    message: `failed to update form: ${error instanceof Error ? error.message : error}`,
                });
        }
    }

    public async show (req: Request, res: Response): Promise<Response>
    {
        try {
            const { id: formId } = req.params;
            const { user } = req;

            if (!formId) {
                throw new CustomError('invalid form id.', 400);
            }

            if (!user) {
                throw new CustomError('unauthorized.', 403);
            }

            const userId: number = await this.getUserId(user?.email);

            const form = await prisma.form.findFirst({
                where: {
                    id: formId,
                    user_id: userId,
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
                    message: `failed to show form: ${error instanceof Error ? error.message : error}`,
                });
        }
    }

    public async showToUser (req: Request, res: Response): Promise<Response>
    {
        try {
            const { formId } = req.params;
            const { user } = req;

            if (!formId) {
                throw new CustomError('invalid form id.', 400);
            }

            const form = await prisma.form.findFirst({
                where: {
                    id: formId,
                }
            });

            if (!form) {
                throw new CustomError('form not found.', 404);
            }

            if (user?.id !== form.user_id || !form.is_public) {
                if (!form.invites.includes(user?.email)) {
                    throw new CustomError('invalid user.', 401);
                }
            }
            
            form.invites = [];

            return res.status(200).json({
                status: true,
                data: form,
            })
        } catch (error) {
            return res
                .status(error instanceof CustomError ? error.statusCode : 500)
                .json({
                    status: false,
                    message: `failed to show form: ${error instanceof Error ? error.message : error}`,
                });
        }
    }

    public async delete (req: Request, res: Response): Promise<Response>
    {
        try {
            const { id: formId } = req.params;
            const { user } = req;

            console.log(formId)

            if (!formId) {
                throw new CustomError('invalid form id.', 400);
            }

            const userId: number = await this.getUserId(user?.email);

            const form = await prisma.form.findFirst({
                where: {
                    id: formId,
                    user_id: userId,
                }
            });

            if (!form) {
                throw new CustomError('form not found.', 404);
            }

            const formToBeDeleted = await prisma.form.delete({
                where: {
                    id: formId,
                    user_id: userId,
                }
            });

            return res.status(200).json({
                status: true,
                message: `form '${formToBeDeleted.title}' successfully deleted.`,
            })
        } catch (error) {
            return res
                .status(error instanceof CustomError ? error.statusCode : 500)
                .json({
                    status: false,
                    message: `failed to delete form: ${ error instanceof Error ? error.message : error }`,
                });
        }
    }
}

export default new FormController;