import express, { Express, Request, Response } from "express";
import dotenv from 'dotenv';
import connectDB from "./db/connection";

dotenv.config();

const app: Express = express();
const port = process.env.DEFAULT_PORT || 3002;

// built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connection to db
connectDB();

app.listen(port, () => console.log(`server running at port ${port} 👾`));