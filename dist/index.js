"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const envVar_1 = require("./config/envVar");
const dbConfig_1 = require("./config/dbConfig");
const myAppConfig_1 = require("./myAppConfig");
const port = parseInt(envVar_1.environment.PORT);
const app = (0, express_1.default)();
(0, myAppConfig_1.myAppConfig)(app);
const server = app.listen(envVar_1.environment.PORT || port, () => {
    (0, dbConfig_1.dbConnect)();
});
process.on("uncaughtException", (error) => {
    console.log("uncaughtException: ", error);
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    console.log("unhandledRejection: ", reason);
    server.close(() => {
        process.exit(1);
    });
});
