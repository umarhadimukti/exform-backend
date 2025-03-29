import { Router, Request, Response } from "express";
import FormSeeder from "../seeders/FormSeeder";
import jwtAuth from "../middlewares/jwtAuth";

const router: Router = Router();

router.post('/fake/seed', jwtAuth(), async (req: Request, res: Response) => {
    await FormSeeder.seed();
});

export default router;