import { Request, Response, Router } from "express";
import { prisma } from "../db/connection";
import UserController from "../controllers/UserController";

const router: Router = Router();

router.get('/users', async (req: Request, res: Response) => {
    await UserController.index(req, res);
});

router.get('/users/:id', async (req: Request, res: Response) => {
    await UserController.show(req, res);
});

router.post('/users', async (req: Request, res: Response) => {
    await UserController.create(req, res);
});

router.post('/roles', async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await prisma.role.create({
        data: payload
    });
    res.json(result);
});

export default router;