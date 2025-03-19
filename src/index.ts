import express, { Express } from "express";
import dotenv from "dotenv";
import connectDB from "./db/connection";
import apiRoutes from "./routes/api";
import authRoutes from "./routes/auth";
import { notFoundHandler } from "./middlewares/notFound";

dotenv.config();

const app: Express = express();
const port = process.env.DEFAULT_PORT || 3002;

// built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connection to db
connectDB();

// api routes
app.use('/api/v1', apiRoutes);

// auth routes
app.use(authRoutes);

// handle 404 (not found route)
app.use(notFoundHandler);

app.listen(port, () => console.log(`server running at port ${port} 👾`));