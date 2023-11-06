"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userModel = new mongoose_1.default.Schema({
    loginKey: {
        type: String,
    },
    userName: {
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
    token: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    businessName: {
        type: String,
        required: true,
    },
    // business: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "businesses",
    // },
    sales: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "sales",
        },
    ],
    admin: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "admins",
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("workers", userModel);
