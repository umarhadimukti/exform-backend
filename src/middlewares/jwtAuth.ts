import { NextFunction, Request, Response } from "express";
import CustomError from "../libs/errors/CustomError";
import { JwtPayload } from "jsonwebtoken";
import AuthService from "../libs/services/AuthService";
import dotenv from "dotenv";

dotenv.config();

export default function jwtAuth ()
{
    const authService = new AuthService;
    const JWT_ACCESS_TOKEN: string = process.env.JWT_ACCESS_TOKEN as string || 'asfdsfsdfw234';

    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { authorization } = req.headers;
            const { at: accessToken } = req.cookies;
            
            let token: string | undefined = '';

            if (authorization?.startsWith('Bearer ')) {
                token = authorization.split(' ')[1];
            }

            if (!token && accessToken) {
                token = accessToken;
            }

            if (!token) {
                throw new CustomError('unauthorized: token missing', 401);
            }

            const verified: JwtPayload | unknown = authService.verifyToken(token, JWT_ACCESS_TOKEN);

            if (!verified || typeof verified !== 'object') {
                throw new CustomError('invalid or expired token', 400);
            }

            req.user = verified as JwtPayload;

            next();

        } catch (error) {
            res
                .status(error instanceof CustomError ? error.statusCode : 500)
                .json({
                    status: false,
                    message: `failed to access the page: ${error instanceof Error ? error.message : error}`,
                });
        }
    }
}