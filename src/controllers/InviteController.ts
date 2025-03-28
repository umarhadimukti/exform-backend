import { Request, Response } from 'express';
import CustomError from '../libs/errors/CustomError';
import { prisma } from '../db/connection';
import { BaseController } from '../interfaces/ControllerInterface';
import { invitesSchema, InvitesSchemaType } from '../validators/invitesValidator';
import { z, ZodError } from 'zod';
import { Form } from '@prisma/client';

class InviteController extends BaseController {

    public async create(req: Request, res: Response): Promise<Response> {
        try {
            const { user } = req;
            const { formId } = req.params;
            const payload = req.body;

            const parsedFormId: number = parseInt(formId, 10);
            if (!parsedFormId || isNaN(parsedFormId)) throw new CustomError('invalid form id.', 400);

            const isUserForm: Form | null = await prisma.form.findFirst({
                where: { user_id: user?.id, id: parsedFormId }
            });
            if (!isUserForm) throw new CustomError('invalid form (you don\'t have access with this form.', 400);

            // validate payload
            const validatedPayload: InvitesSchemaType = invitesSchema.parse(payload);

            // check duplicate email in database
            const filteredEmail: string[] = isUserForm?.invites.filter((email: string) => {
                const isDuplicateEmail: string | undefined = validatedPayload?.invited_users?.find((inv: string) => inv === email);

                if (isDuplicateEmail) {
                    return true;
                }
            })

            if (filteredEmail.length > 0) throw new CustomError('email already exists!', 400);

            // add new email
            const newInvites: string[] = [
                ...(isUserForm?.invites || []),
                ...(validatedPayload?.invited_users || []),
            ];


            // update field invites
            const updatedInvites = await prisma.form.update({
                where: {
                    id: isUserForm?.id
                },
                data: {
                    invites: newInvites,
                },
            });

            return res.status(201).json({
                status: true,
                message: 'data successfully created.',
                data: updatedInvites,
            });
        } catch (error) {
            return this.handleError(res, error, 'failed to create data');
        }
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        try {
            const { user } = req;
            const { formId } = req.params;
            const payload = req.body;

            const parsedFormId: number = parseInt(formId, 10);
            if (!parsedFormId || isNaN(parsedFormId)) throw new CustomError('invalid form id.', 400);

            const isUserForm: Form | null = await prisma.form.findFirst({
                where: { user_id: user?.id, id: parsedFormId }
            });
            if (!isUserForm) throw new CustomError('invalid form (you don\'t have access with this form.', 400);

            // validate payload
            const validator = z.object({ deleted_email: z.string().email({ message: 'invalid email address.' }).optional() });
            const validatedPayload: { deleted_email?: string | undefined } = validator.parse(payload);

            // check if email is not exists in database
            const isExistsEmail = isUserForm?.invites.find((email: string) => email === validatedPayload?.deleted_email);
            if (!isExistsEmail) throw new CustomError('email doesn\'t exists.', 400);

            // check if exists in database
            const newEmails = isUserForm?.invites.filter((email: string) => {
                return email !== validatedPayload?.deleted_email
            });

            await prisma.form.update({
                where: { id: isUserForm?.id },
                data: {
                    invites: newEmails,
                }
            });

            return res.status(200).json({
                status: true,
                message: 'data successfully deleted.',
                deleted_data: validatedPayload?.deleted_email,
            });
        } catch (error) {
            return this.handleError(res, error, 'failed to delete data');
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
            message: `${message}: ${error instanceof Error ? error.message : 'unknown error'}`,
        });
    }
}

export default new InviteController;