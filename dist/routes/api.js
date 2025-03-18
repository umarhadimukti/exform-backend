"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const connection_1 = require("../db/connection");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const router = (0, express_1.Router)();
router.get('/users', async (req, res) => {
    await UserController_1.default.index(req, res);
});
router.get('/users/:id', async (req, res) => {
    await UserController_1.default.show(req, res);
});
router.post('/users', async (req, res) => {
    await UserController_1.default.create(req, res);
});
router.post('/roles', async (req, res) => {
    const payload = req.body;
    const result = await connection_1.prisma.role.create({
        data: payload
    });
    res.json(result);
});
exports.default = router;
