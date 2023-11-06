"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const envVar_1 = require("./envVar");
const url = envVar_1.environment.MONGO;
const dbConnect = () => {
    mongoose_1.default.connect(url).then(() => {
        console.log(`Server has connected...!!!`);
    });
};
exports.dbConnect = dbConnect;
