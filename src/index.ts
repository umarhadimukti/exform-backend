import express, { Express } from "express";
import dotenv from "dotenv";
import connectDB from "./db/connection";
import apiRoutes from "./routes/api";
import authRoutes from "./routes/auth";
import seedRoutes from "./routes/seed";
import { notFoundHandler } from "./middlewares/notFound";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerDocs from "./config/swagger";

dotenv.config();

const app: Express = express();
const port = Number(process.env.DEFAULT_PORT) || 3002;

// built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// cors
app.use(cors({
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // allowed send cookies and headers authentication
}));

// connection to db
connectDB();

// api routes
app.use('/api/v1', apiRoutes);

// auth routes
app.use(authRoutes);

// seed routes
app.use(seedRoutes);

// swagger docs
swaggerDocs(app, port);

// handle 404 (not found route)
app.use(notFoundHandler);

app.listen(port, () => console.log(`server running at port ${port} 👾`));