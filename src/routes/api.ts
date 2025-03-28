import { Request, Response, Router } from "express";
import { prisma } from "../db/connection";
import UserController from "../controllers/UserController";
import jwtAuth from "../middlewares/jwtAuth";
import FormController from "../controllers/FormController";
import QuestionController from "../controllers/QuestionController";
import OptionContoller from "../controllers/OptionContoller";
import AnswerController from "../controllers/AnswerController";
import InviteController from "../controllers/InviteController";

const router: Router = Router();

// invite routes
router.post('/form/:formId/invites', jwtAuth(), async (req: Request, res: Response) => {
    await InviteController.create(req, res);
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
router.get('/users', jwtAuth(),  async (req: Request, res: Response) => {
    await UserController.index(req, res);
});
router.get('/users/:id', jwtAuth(), async (req: Request, res: Response) => {
    await UserController.show(req, res);
});
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