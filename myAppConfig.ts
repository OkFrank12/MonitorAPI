import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { HTTP, errorSetUp } from "./errors/errorSetUp";
import { errorSet } from "./errors/errorConfig";
import admin from "./router/adminRouter";
import user from "./router/userRouter";
import sales from "./router/salesRouter";

export const myAppConfig = (app: Application) => {
  app.use(express.json()).use(cors()).use(morgan("dev")).use(helmet());

  app.use("/api/admin", admin);
  app.use("/api/user", user);
  app.use("/api/sales", sales);
  app.get("/", (req: Request, res: Response) => {
    try {
      return res.status(200).json({
        message: "Default API is ready",
      });
    } catch (error: any) {
      return res.status(404).json({
        message: "error from Default Route",
        data: error.message,
      });
    }
  });

  app
    .all("*", (req: Request, res: Response) => {
      return new errorSetUp({
        name: "Route Error",
        message: `${req.originalUrl} is invalid`,
        status: HTTP.BAD,
        success: false,
      });
    })
    .use(errorSet);
};
