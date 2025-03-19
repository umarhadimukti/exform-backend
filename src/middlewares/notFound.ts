import { NextFunction, Request, Response } from "express";

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
    res.status(404).json({
        status: false,
        message: `${res.statusCode}: path ${req.originalUrl} not found.`,
    });
}