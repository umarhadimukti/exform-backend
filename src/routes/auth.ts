import { Request, Response, Router } from "express";
import AuthController from "../controllers/AuthController";
import jwtAuth from "../middlewares/jwtAuth";

const router: Router = Router();

router.post('/register', async (req: Request, res: Response): Promise<void> => {
    await AuthController.register(req, res);
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
    await AuthController.login(req, res);
});

router.post('/logout', jwtAuth(), async (req: Request, res: Response): Promise<void> => {
    await AuthController.logout(req, res);
});

router.post('/refresh-token', async (req: Request, res: Response): Promise<void> => {
    await AuthController.refreshToken(req, res);
});

export default router;