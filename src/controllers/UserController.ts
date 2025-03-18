import { Request, Response } from "express";
import { prisma } from "../db/connection";
import { User } from "../validators/UserValidator";
import { z } from "zod";
class UserController
{
    public async index (req: Request, res: Response) {
        const users = await prisma.user.findMany();
        return res.status(200).json({
            status: true,
            length: users.length,
            data: users,
        });
    }

    public async show (req: Request, res: Response) {
        const { id } = req.params;
        
        if (!id) {
            throw new Error('user_id is required.');
        }

        try {
            const user = await prisma.user.findUnique({
                where: { id: Number(id) },
            });
    
            return res.status(200).json({
                status: true,
                data: user
            })
        } catch (err) {
            return res.status(400).json({
                status: false,
                message: `failed to get user: ${ err instanceof Error ? err.message:err }`,
            });
        }
    }

    public async create (req: Request, res: Response) {
        const payload = req.body;

        try {
            const validated = User.parse(payload);

            const newUser = await prisma.user.create({
                data: validated,
            });

            return res.status(201).json({
                status: true,
                message: `success to store new user.`,
                data: newUser,
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors = error.errors.map(err => {
                    return {
                        field: err.path.join('.'),
                        message: err.message,
                    };
                });
                return res.status(400).json({
                    status: false,
                    message: formattedErrors,
                });
            }
            
            return res.status(400).json({
                status: false,
                message: `failed to store new user: ${ error instanceof Error ? error.message:error }`,
            });
        }

    }
}

export default new UserController;