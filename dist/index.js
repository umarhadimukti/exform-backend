"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const connection_1 = __importDefault(require("./db/connection"));
const api_1 = __importDefault(require("./routes/api"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.DEFAULT_PORT || 3002;
// built-in middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// connection to db
(0, connection_1.default)();
// api routes
app.use('/api/v1', api_1.default);
app.listen(port, () => console.log(`server running at port ${port} 👾`));
