import { Router, Request, Response } from "express";
import jwtAuth from "../middlewares/jwtAuth";
import DatabaseSeeder from "../seeders/DatabaseSeeder";

const router: Router = Router();

router.post('/fake/seed', jwtAuth(), async (req: Request, res: Response) => {
    DatabaseSeeder.run(req, res);
});

export default router;