import { Request, Response } from "express";

export interface Controller<T>
{
    index (req: Request, res: Response): T;
    show (req: Request, res: Response): T;
    create (req: Request, res: Response): T;
    update (req: Request, res: Response): T;
    delete (req: Request, res: Response): T;
}