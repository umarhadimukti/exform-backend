import { Request, Response } from 'express';
import CustomError from '../libs/errors/CustomError';
import { prisma } from '../db/connection';
import { BaseController } from '../interfaces/ControllerInterface';

class InviteController extends BaseController {

    public async create(req: Request, res: Response): Promise<Response> {
        try {
            const { user } = req;
            const { formId } = req.params;

            const parsedFormId: number = parseInt(formId, 10);
            if (!parsedFormId || isNaN(parsedFormId)) throw new CustomError('invalid form id.', 400);

            const isUserForm = await prisma.form.findFirst({
                where: { user_id: user?.id, id: parsedFormId }
            });
            if (!isUserForm) throw new CustomError('invalid form (you don\'t have access with this form.', 400);

            


            return res.status(201).json({
                status: true,
                message: 'data successfully created.',
                data: req.body
            });
        } catch (error) {
            return this.handleError(res, error, 'failed to create data.');
        }
    }

    public update(req: Request, res: Response): Response {
        try {
            const { id } = req.params;
            // logic here..

            return res.status(200).json({
                status: true,
                message: 'data successfully updated.',
                data: { id, ...req.body }
            });
        } catch (error) {
            return this.handleError(res, error, 'failed to update data.');
        }
    }

    private handleError(res: Response, error: unknown, message: string): Response {
        console.error(error);
        return res.status(500).json({
            status: false,
            message,
            error: error instanceof Error ? error.message : 'unknown error'
        });
    }
}

export default new InviteController;