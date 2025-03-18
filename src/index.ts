import express, { Express, Request, Response } from "express";
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.DEFAULT_PORT || 3002;

app.listen(port, () => console.log(`server running at port ${port} 👾`));