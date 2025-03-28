import { Request, Response } from 'express';
import { BaseController, Controller } from '@interface/ControllerInterface';

class InviteController extends BaseController {

    public create(req: Request, res: Response): Response {
        try {
            // logic here..

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