"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const connection_1 = require("../db/connection");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const jwtAuth_1 = __importDefault(require("../middlewares/jwtAuth"));
const FormController_1 = __importDefault(require("../controllers/FormController"));
const router = (0, express_1.Router)();
router.post('/form', (0, jwtAuth_1.default)(), async (req, res) => {
    await FormController_1.default.create(req, res);
});
router.get('/users', (0, jwtAuth_1.default)(), async (req, res) => {
    await UserController_1.default.index(req, res);
});
router.get('/users/:id', (0, jwtAuth_1.default)(), async (req, res) => {
    await UserController_1.default.show(req, res);
});
router.post('/users', (0, jwtAuth_1.default)(), async (req, res) => {
    await UserController_1.default.create(req, res);
});
router.post('/roles', (0, jwtAuth_1.default)(), async (req, res) => {
    const payload = req.body;
    const result = await connection_1.prisma.role.create({
        data: payload
    });
    res.json(result);
});
exports.default = router;
