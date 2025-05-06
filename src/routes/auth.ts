import { Request, Response, Router } from "express";
import AuthController from "../controllers/AuthController";
import jwtAuth from "../middlewares/jwtAuth";

const router: Router = Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: register new user
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: First name of the user
 *                 example: John
 *               last_name:
 *                 type: string
 *                 description: Last name of the user
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *                 example: johndoe@gmail.com
 *               password:
 *                 type: string
 *                 description: Password of the user
 *                 example: test1234
 *               status:
 *                 type: string
 *                 description: Status of the user
 *                 enum: [ACTIVE, INACTIVE]
 *                 example: ACTIVE
 *               role_id:
 *                 type: number
 *                 description: Role ID of the user
 *                 example: 1
 *     responses:
 *       201:
 *         description: successfully register new user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   default: true
 *                 message:
 *                   type: string
 *                   default: user successfully registered.
 *                 userInformation:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       description: First name of the user
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       description: Last name of the user
 *                       example: Doe
 *                     fullName:
 *                       type: string
 *                       description: Full name of the user
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: Email address of the user
 *                       example: johndoe@gmail.com
 *                     roleId:
 *                       type: number
 *                       description: Role ID of the user
 *                       example: 1
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   default: false
 *                 message:
 *                   type: string
 *                   default: invalid request body
 *       428:
 *         description: Precondition required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   default: false
 */
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