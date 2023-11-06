"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const adminModel = new mongoose_1.default.Schema({
    loginKey: {
        type: String,
    },
    adminName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    businessName: {
        type: String,
        required: true,
    },
    user: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "workers",
        },
    ],
    sales: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "sales",
        },
    ],
    token: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("admins", adminModel);
