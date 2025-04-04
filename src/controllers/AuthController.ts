import { Request, Response } from "express";
import { prisma } from "../db/connection";
import { User } from "../validators/userValidator";
import { z } from "zod";
import CustomError from "../libs/errors/CustomError";
import AuthService from "../libs/services/AuthService";
import dotenv from "dotenv";
import { JwtPayload } from "jsonwebtoken";

dotenv.config;

class AuthController
{
    protected authService = new AuthService;
    protected static readonly JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN as string || 'super duper secret access token';
    protected static readonly JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN as string || 'super duper secret refresh token';

    public async register (req: Request, res: Response)
    {
        const payloadUser = req.body;

        try {
            let validated = User.parse(payloadUser);

            const isExistsUser = await prisma.user.findUnique({ where: { email: validated.email } });
            if (isExistsUser) {
                throw new CustomError('email already registered.', 409);
            }

            const hashPassword = await this.authService.hashPassword(validated.password);
            
            const newUser = await prisma.user.create({
                data: {
                    first_name: validated.first_name,
                    last_name: validated.last_name,
                    email: validated.email,
                    password: hashPassword,
                    role_id: validated.role_id,
                },
            });

            const accessToken = this.authService.generateToken(newUser, AuthController.JWT_ACCESS_TOKEN, { expiresIn: '1d' });
            const refreshToken = this.authService.generateToken(newUser, AuthController.JWT_REFRESH_TOKEN, { expiresIn: '7d' });

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.APP_ENV as string === 'production',
                sameSite: process.env.APP_ENV as string === 'production' ? 'strict' : 'lax',
                maxAge: 1000 * 60 * 60 * 24, // 1 day (same with token expired)
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.APP_ENV as string === 'production',
                sameSite: process.env.APP_ENV as string === 'production' ? 'strict' : 'lax',
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 day
                path: '/refresh-token'
            });

            return res.status(201).json({
                status: true,
                message: 'user successfully registered.',
                userInformation: {
                    firstName: newUser.first_name,
                    lastName: newUser?.last_name ?? '',
                    fullName: `${newUser.first_name} ${newUser.last_name ?? ''}`.trim(),
                    email: newUser.email,
                    roleId: newUser.role_id,
                },
            });
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

    public async login (req: Request, res: Response): Promise<Response>
    {
        try {
            const { email: emailPayload, password: passwordPayload } = req.body;

            if (!emailPayload || !passwordPayload) {
                throw new CustomError('email and password are required.', 400);
            }
    
            const user = await prisma.user.findUnique({ where: { email: emailPayload } });
            if (!user) {
                throw new CustomError('invalid email or password.', 404);
            }

            if (!await this.authService.comparePassword(passwordPayload, user.password)) {
                throw new CustomError('invalid email or password.', 401);
            }

            const accessToken = this.authService.generateToken(user, AuthController.JWT_ACCESS_TOKEN, { expiresIn: '1d' });
            const refreshToken = this.authService.generateToken(user, AuthController.JWT_REFRESH_TOKEN, { expiresIn: '7d' });

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.APP_ENV as string === 'production',
                sameSite: process.env.APP_ENV as string === 'production' ? 'strict' : 'lax',
                maxAge: 1000 * 60 * 60 * 24, // 1 day (same with token expired)
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.APP_ENV as string === 'production',
                sameSite: process.env.APP_ENV as string === 'production' ? 'strict' : 'lax',
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 day
                path: '/refresh-token'
            });

            return res.status(200).json({
                status: true,
                message: 'login success.',
                userInformation: {
                    firstName: user.first_name,
                    lastName: user.last_name,
                    fullName: `${user.first_name} ${user.last_name ?? ''}`.trim(),
                    email: user.email,
                    roleId: user.role_id,
                },
            })
        } catch (error) {
            return res.status(error instanceof CustomError ? error.statusCode : 500).json({
                status: false,
                message: `failed to login: ${error instanceof Error ? error.message : error}`,
            });
        }
    }

    public async refreshToken (req: Request, res: Response): Promise<Response>
    {
        try {
            const { refreshToken: refreshTokenFromCookie } = req.cookies;

            if (!refreshTokenFromCookie) {
                throw new CustomError('token doesn\'t exists.', 400);
            }

            const verifiedToken: JwtPayload | unknown = this.authService.verifyToken(refreshTokenFromCookie, AuthController.JWT_REFRESH_TOKEN);

            if (!verifiedToken || typeof verifiedToken !== 'object') {
                throw new CustomError('invalid or expired token.', 400);
            }

            const { iat, exp, ...userData } = verifiedToken as JwtPayload;

            const accessToken = this.authService.generateToken(userData, AuthController.JWT_ACCESS_TOKEN, { expiresIn: '1d' });
            const refreshToken = this.authService.generateToken(userData, AuthController.JWT_REFRESH_TOKEN, { expiresIn: '7d' });

            // set cookies untuk access token baru
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
                maxAge: 24 * 60 * 60 * 1000, // 1 day in milisecond
            });

            // set cookies untuk refresh token baru
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day in milisecond
                path: '/refresh-token',
            });

            return res.status(200).json({
                status: true,
                message: 'token successfully refreshed.',
            });
        } catch (error) {
            // clear cookie if there's an error detected
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');

            return res.status(error instanceof CustomError ? error.statusCode : 500).json({
                status: false,
                message: `failed to refresh token: ${error instanceof Error ? error.message : error}`,
            });
        }
    }
}

export default new AuthController;