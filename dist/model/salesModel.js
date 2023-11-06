"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const salesModel = new mongoose_1.default.Schema({
    userID: {
        type: String,
    },
    userName: {
        type: String,
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "workers",
    },
    admin: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "admins",
    },
    price: {
        type: Number,
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("sales", salesModel);
