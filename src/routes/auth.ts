import { Request, Response, Router } from "express";
import { prisma } from "../db/connection";
import AuthController from "../controllers/AuthController";

const router: Router = Router();

router.post('/register', async (req: Request, res: Response) => {
    await AuthController.register(req, res);
});

export default router;