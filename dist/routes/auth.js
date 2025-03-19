"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const router = (0, express_1.Router)();
router.post('/register', async (req, res) => {
    await AuthController_1.default.register(req, res);
});
router.post('/login', async (req, res) => {
    await AuthController_1.default.login(req, res);
});
router.post('/refresh-token', async (req, res) => {
    await AuthController_1.default.refreshToken(req, res);
});
exports.default = router;
