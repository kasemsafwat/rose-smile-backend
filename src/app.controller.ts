import express, { Application, Request, Response, NextFunction } from "express";
import { errorHandler } from "./utils/errorHandling";
import cookieParser from "cookie-parser";
import redis from "./utils/redis";
import apiRouter from "./index.Routes";
import { ApiDocumentation, PORT } from "./config/env";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import compression from "compression";

const app: Application = express();

app.use(compression({ level: 6, memLevel: 8, threshold: 0 }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://rose-smile.vercel.app",
      "https://rose-smile.vercel.app/",
      "http://rose-smile.vercel.app/",
    ],
  })
);

console.log(process.cwd());

redis;
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(morgan("dev"));

// API routes
app.use("/api/v1", apiRouter);

app.get("/", (req: Request, res: Response): Response | any => {
  return res.json({
    message: "welcome to our Application",
    ApiDocumentation: ApiDocumentation,
  });
});

// Handle invalid routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Invalid URL or Method" });
});

app.use(errorHandler);

export default app;
