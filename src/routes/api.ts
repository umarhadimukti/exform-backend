import { Request, Response, Router } from "express";
import { prisma } from "../db/connection";
import UserController from "../controllers/UserController";
import jwtAuth from "../middlewares/jwtAuth";
import FormController from "../controllers/FormController";
import QuestionController from "../controllers/QuestionController";
import OptionContoller from "../controllers/OptionContoller";
import AnswerController from "../controllers/AnswerController";
import InviteController from "../controllers/InviteController";
import ResponseController from "../controllers/ResponseController";

const router: Router = Router();

/**
 * @swagger
 * /api/v1/current-user:
 *   get:
 *     summary: get current signed in user
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: successfully get current user
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
 *                   default: successful get current user
 *                 userInformation:
 *                   $ref: '#/components/schemas/CurrentUser'
 *       401:
 *         description: unauthorized, no token provided
 *       500:
 *         description: failed to get current user, internal server error
 */
router.get('/current-user', jwtAuth(), async (req: Request, res: Response) => {
    await UserController.getCurrentUser(req, res);
});

// response routes
router.get('/form/:formId/list-response', jwtAuth(), async (req: Request, res: Response) => {
    await ResponseController.index(req, res);
});

// invite routes
router.get('/form/:formId/invites', jwtAuth(), async (req: Request, res: Response) => {
    await InviteController.index(req, res);
});
router.post('/form/:formId/invites', jwtAuth(), async (req: Request, res: Response) => {
    await InviteController.create(req, res);
});
router.delete('/form/:formId/invites', jwtAuth(), async (req: Request, res: Response) => {
    await InviteController.delete(req, res);
});

// answers routes
router.get('/form/:formId/answers', jwtAuth(), async (req: Request, res: Response) => {
    await AnswerController.index(req, res);
});
router.post('/form/:formId/answers', jwtAuth(), async (req: Request, res: Response) => {
    await AnswerController.create(req, res);
});

// show form route (for user)
router.get('/form/:formId/users', jwtAuth(), async (req: Request, res: Response) => {
    await FormController.showToUser(req, res);
});

// option routes
router.post('/form/:formId/question/:questionId/option', jwtAuth(), async (req: Request, res: Response) => {
    await OptionContoller.create(req, res);
});
router.put('/form/:formId/question/:questionId/option/:optionId', jwtAuth(), async (req: Request, res: Response) => {
    await OptionContoller.update(req, res);
});
router.delete('/form/:formId/question/:questionId/option/:optionId', jwtAuth(), async (req: Request, res: Response) => {
    await OptionContoller.delete(req, res);
});

// question routes
router.get('/form/:formId/questions', jwtAuth(), async (req: Request, res: Response) => {
    await QuestionController.index(req, res);
});
router.post('/form/:formId/question', jwtAuth(), async (req: Request, res: Response) => {
    await QuestionController.create(req, res);
});
router.put('/form/:formId/question/:questionId', jwtAuth(), async (req: Request, res: Response) => {
    await QuestionController.update(req, res);
});
router.delete('/form/:formId/question/:questionId', jwtAuth(), async (req: Request, res: Response) => {
    await QuestionController.delete(req, res);
});

// form routes
router.get('/forms', jwtAuth(), async (req: Request, res: Response) => {
    await FormController.index(req, res);
})
router.get('/form/:id', jwtAuth(), async (req: Request, res: Response) => {
    await FormController.show(req, res);
})
router.post('/form', jwtAuth(), async (req: Request, res: Response) => {
    await FormController.create(req, res);
});
router.put('/form/:id', jwtAuth(), async (req: Request, res: Response) => {
    await FormController.update(req, res);
});
router.delete('/form/:id', jwtAuth(), async (req: Request, res: Response) => {
    await FormController.delete(req, res);
});

// user routes
/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     summary: get all users
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: successfully get all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   default: true
 *                 length:
 *                   type: integer
 *                   default: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Users'
 *       401:
 *         description: unauthorized, no token provided
 *       500:
 *         description: failed to get all users, internal server error
 */
router.get('/users', jwtAuth(),  async (req: Request, res: Response) => {
    await UserController.index(req, res);
});

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: get user by id
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: user id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: successfully get user by id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   default: true
 *                 data:
 *                   $ref: '#/components/schemas/ShowUser'
 */
router.get('/users/:id', jwtAuth(), async (req: Request, res: Response) => {
    await UserController.show(req, res);
});

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: create new user
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: successfully create new user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShowUser'
 *       400:
 *         description: invalid request body
 *       401:
 *         description: unauthorized, no token provided
 *       403:
 *         description: forbidden, invalid token
 *       500:
 *         description: failed to create new user, internal server error
 *       428:
 *         description: precondition required, invalid request body
 *       409:
 *         description: conflict, email already exists
 */
router.post('/users', jwtAuth(), async (req: Request, res: Response) => {
    await UserController.create(req, res);
});

// role routes
router.post('/roles', async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await prisma.role.create({
        data: payload
    });
    res.json(result);
});

export default router;