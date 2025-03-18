import { Request, Response, Router } from "express";
import { prisma } from "../db/connection";

const router: Router = Router();

router.get('/users', async (req: Request, res: Response) => {
    const allUsers = await prisma.user.findMany();
    console.log(allUsers);
});

router.post('/roles', async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await prisma.role.create({
        data: payload
    });
    res.json(result);
});

export default router;