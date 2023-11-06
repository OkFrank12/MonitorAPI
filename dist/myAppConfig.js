"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myAppConfig = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const errorSetUp_1 = require("./errors/errorSetUp");
const errorConfig_1 = require("./errors/errorConfig");
const adminRouter_1 = __importDefault(require("./router/adminRouter"));
const userRouter_1 = __importDefault(require("./router/userRouter"));
const salesRouter_1 = __importDefault(require("./router/salesRouter"));
const myAppConfig = (app) => {
    app.use(express_1.default.json()).use((0, cors_1.default)()).use((0, morgan_1.default)("dev")).use((0, helmet_1.default)());
    app.use("/api/admin", adminRouter_1.default);
    app.use("/api/user", userRouter_1.default);
    app.use("/api/sales", salesRouter_1.default);
    app.get("/", (req, res) => {
        try {
            return res.status(200).json({
                message: "Default API is ready",
            });
        }
        catch (error) {
            return res.status(404).json({
                message: "error from Default Route",
                data: error.message,
            });
        }
    });
    app
        .all("*", (req, res) => {
        return new errorSetUp_1.errorSetUp({
            name: "Route Error",
            message: `${req.originalUrl} is invalid`,
            status: errorSetUp_1.HTTP.BAD,
            success: false,
        });
    })
        .use(errorConfig_1.errorSet);
};
exports.myAppConfig = myAppConfig;
