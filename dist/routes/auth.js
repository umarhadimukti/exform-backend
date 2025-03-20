"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const jwtAuth_1 = __importDefault(require("../middlewares/jwtAuth"));
const router = (0, express_1.Router)();
router.post('/register', async (req, res) => {
    await AuthController_1.default.register(req, res);
});
router.post('/login', async (req, res) => {
    await AuthController_1.default.login(req, res);
});
router.post('/refresh-token', (0, jwtAuth_1.default)(), async (req, res) => {
    await AuthController_1.default.refreshToken(req, res);
});
exports.default = router;
