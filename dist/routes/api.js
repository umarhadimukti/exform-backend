"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const connection_1 = require("../db/connection");
const router = (0, express_1.Router)();
router.get('/users', async (req, res) => {
    const allUsers = await connection_1.prisma.user.findMany();
    console.log(allUsers);
});
router.post('/roles', async (req, res) => {
    const payload = req.body;
    const result = await connection_1.prisma.role.create({
        data: payload
    });
    res.json(result);
});
exports.default = router;
