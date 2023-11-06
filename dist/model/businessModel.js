"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const businessModel = new mongoose_1.default.Schema({
    admin: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "admins",
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "workers",
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("businesses", businessModel);
