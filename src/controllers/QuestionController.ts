import CustomError from "../libs/errors/CustomError";
import { Request, Response } from "express";

class QuestionController
{

    public async create (req: Request, res: Response): Promise<Response>
    {
        try {
            const { formId } = req.params;

            if (!formId || isNaN(parseInt(formId, 10))) {
                throw new CustomError('invalid form id.', 400);
            }

            console.log(formId)
            
            return res.status(201).json({
                status: true,
                message: 'question successfully created.',
                data: {},
            })
        } catch (error) {
            return res
                .status(error instanceof CustomError ? error.statusCode : 500)
                .json({
                    status: false,
                    message: `failed to store new question: ${error instanceof Error ? error.message : error}`,
                });
        }
    }

}

export default new QuestionController;