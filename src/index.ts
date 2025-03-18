import express, { Express } from "express";
import dotenv from "dotenv";
import connectDB from "./db/connection";
import apiRoutes from "./routes/api";

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

app.listen(port, () => console.log(`server running at port ${port} 👾`));