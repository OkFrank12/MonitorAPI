import express, { Application } from "express";
import { environment } from "./config/envVar";
import { dbConnect } from "./config/dbConfig";
import { myAppConfig } from "./myAppConfig";

const port: number = parseInt(environment.PORT);
const app: Application = express();
myAppConfig(app);

const server = app.listen(environment.PORT || port, () => {
  dbConnect();
});

process.on("uncaughtException", (error: Error) => {
  console.log("uncaughtException: ", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  console.log("unhandledRejection: ", reason);
  server.close(() => {
    process.exit(1);
  });
});
