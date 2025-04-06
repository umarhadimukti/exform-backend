import { Request, Response } from "express";
import { prisma } from "../db/connection";
import { User } from "../validators/userValidator";
import { z } from "zod";
import CustomError from "../libs/errors/CustomError";
import dotenv from "dotenv";
import AuthService from "../libs/services/AuthService";
import { JwtPayload } from "jsonwebtoken";

dotenv.config();

class UserController
{
    private readonly JWT_SECRET_ACCESS_TOKEN: string = process.env.JWT_ACCESS_TOKEN as string;

    public async getCurrentUser (req: Request, res: Response): Promise<Response> {
        const authService: AuthService = new AuthService();
        try {
            const { at: accessToken } = req.cookies;

            if (!accessToken || typeof accessToken !== 'string') throw new CustomError('no token provided.', 401);

            const decoded: JwtPayload | unknown = authService.verifyToken(accessToken, this.JWT_SECRET_ACCESS_TOKEN);

            if (!decoded || typeof decoded !== 'object') throw new CustomError('invalid access token.', 400);

            const { email } = decoded as JwtPayload;

            if (!email) throw new CustomError('invalid token payload.', 400);

            const user = await prisma.user.findUnique({
                where: { email: email },
                select: {
                    first_name: true,
                    last_name: true,
                    email: true,
                    role_id: true,
                    role: {
                        select: { id: true, name: true }
                    }
                },
                
            });

            if (!user) throw new CustomError('user not found.', 404);

            return res.status(200).json({
                status: true,
                message: 'successful get current user.',
                userInformation: user,
            });
        } catch (error) {
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    status: false,
                    message: error.message
                });
            }
            return res.status(500).json({
                status: false,
                message: `failed to get user information: ${error instanceof Error ? error.message : error}`
            });
        }
    }

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