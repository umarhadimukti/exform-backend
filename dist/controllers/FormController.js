"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FormController {
    async create(req, res) {
        const { body: payload } = req;
        console.log(payload);
    }
}
exports.default = new FormController;
