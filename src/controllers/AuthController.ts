import { Request, Response } from "express";
import { prisma } from "../db/connection";
import { User } from "../validators/userValidator";
import { hash, genSalt } from "bcryptjs";
import { z } from "zod";
import CustomError from "../libs/errors/CustomError";

class AuthController
{
    public async register (req: Request, res: Response) {
        const payloadUser = req.body;

        try {
            let validated = User.parse(payloadUser);

            const isExistsUser = await prisma.user.findUnique({ where: { email: validated.email } });
            if (isExistsUser) {
                throw new CustomError('email already registered.', 409);
            }

            const hashPassword = await hash(validated.password, await genSalt(10));
            
            const newUser = await prisma.user.create({
                data: {
                    first_name: validated.first_name,
                    last_name: validated.last_name,
                    email: validated.email,
                    password: hashPassword,
                    role_id: validated.role_id,
                },
            });

            return res.status(201).json({
                status: true,
                message: 'user successfully registered.',
                data: newUser,

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

            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    status: false,
                    message: `failed to register new user: ${error.message}`,
                });
            }

            return res.status(500).json({
                status: false,
                message: `failed to register new user: ${error instanceof Error ? error.message : error}`,
            });
        }
    }
}

export default new AuthController;