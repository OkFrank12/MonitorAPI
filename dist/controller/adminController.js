"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdmin = exports.oneAdmin = exports.allAdmins = exports.signInAdmin = exports.verifyAdmin = exports.createAdmin = void 0;
const errorSetUp_1 = require("../errors/errorSetUp");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const email_1 = require("../utils/email");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminModel_1 = __importDefault(require("../model/adminModel"));
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminName, email, password, businessName } = req.body;
        const salted = yield bcrypt_1.default.genSalt(10);
        const hashed = yield bcrypt_1.default.hash(password, salted);
        const token = crypto_1.default.randomBytes(10).toString("hex");
        const admin = yield adminModel_1.default.create({
            adminName,
            email,
            password: hashed,
            businessName,
            token,
        });
        (0, email_1.sendAdminMail)(admin).then(() => {
            console.log(`admin mail sent!!!`);
        });
        return res.status(errorSetUp_1.HTTP.CREATED).json({
            message: "Created admin",
            data: admin,
        });
    }
    catch (error) {
        return res.status(errorSetUp_1.HTTP.UN_FULLFILLED).json({
            message: "error creating admin",
            data: error.message,
        });
    }
});
exports.createAdmin = createAdmin;
const verifyAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        jsonwebtoken_1.default.verify(token, "token", (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                throw new Error();
            }
            else {
                const admin = yield adminModel_1.default.findById(payload.id);
                if (admin) {
                    yield adminModel_1.default.findByIdAndUpdate(payload.id, {
                        verified: true,
                        token: "",
                    });
                    return res.status(errorSetUp_1.HTTP.OK).json({
                        message: "admin has been verified",
                    });
                }
                else {
                    return res.status(errorSetUp_1.HTTP.UN_AUTHORIZED).json({
                        message: "Token Error",
                    });
                }
            }
        }));
        return res;
    }
    catch (error) {
        return res.status(errorSetUp_1.HTTP.UN_FULLFILLED).json({
            message: "error verifying admin",
            data: error.message,
        });
    }
});
exports.verifyAdmin = verifyAdmin;
const signInAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const admin = yield adminModel_1.default.findOne({ email });
        if (admin) {
            const validPassword = yield bcrypt_1.default.compare(password, admin.password);
            if (validPassword) {
                const token = jsonwebtoken_1.default.sign({ id: admin._id }, "token");
                if ((admin === null || admin === void 0 ? void 0 : admin.verified) && admin.token === "") {
                    const populate = yield adminModel_1.default.findById(admin === null || admin === void 0 ? void 0 : admin._id).populate({
                        path: "user",
                        options: {
                            sort: { createdAt: -1 },
                        },
                    });
                    (0, email_1.loginKeyMail)(admin, populate === null || populate === void 0 ? void 0 : populate.user[0]).then(() => {
                        console.log("Sent..!");
                    });
                    // loginKeyMail(admin, populate?.user[1]).then(() => {
                    //   console.log("Sent..!");
                    // });
                    return res.status(errorSetUp_1.HTTP.OK).json({
                        message: `Welcome Back ${admin.adminName}`,
                        data: token,
                    });
                }
                else {
                    return res.status(errorSetUp_1.HTTP.UN_AUTHORIZED).json({
                        message: "Please verify this account",
                    });
                }
            }
            else {
                return res.status(errorSetUp_1.HTTP.UN_AUTHORIZED).json({
                    message: "Password is invalid",
                });
            }
        }
        else {
            return res.status(errorSetUp_1.HTTP.UN_AUTHORIZED).json({
                message: "Email is not found",
            });
        }
    }
    catch (error) {
        return res.status(errorSetUp_1.HTTP.UN_FULLFILLED).json({
            message: "error signing in admin",
            data: error.message,
        });
    }
});
exports.signInAdmin = signInAdmin;
const allAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const all = yield adminModel_1.default.find();
        return res.status(errorSetUp_1.HTTP.OK).json({
            message: "all admin",
            data: all,
        });
    }
    catch (error) {
        return res.status(errorSetUp_1.HTTP.UN_FULLFILLED).json({
            message: "error getting all admin",
            data: error.message,
        });
    }
});
exports.allAdmins = allAdmins;
const oneAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const one = yield adminModel_1.default.findById(_id);
        return res.status(errorSetUp_1.HTTP.OK).json({
            message: "one admin",
            data: one,
        });
    }
    catch (error) {
        return res.status(errorSetUp_1.HTTP.UN_FULLFILLED).json({
            message: "error getting one admin",
            data: error.message,
        });
    }
});
exports.oneAdmin = oneAdmin;
const deleteAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        yield adminModel_1.default.findByIdAndDelete(_id);
        return res.status(errorSetUp_1.HTTP.DELETE).json({
            message: "Deleted admin",
        });
    }
    catch (error) {
        return res.status(errorSetUp_1.HTTP.UN_FULLFILLED).json({
            message: "error deleting admin",
            data: error.message,
        });
    }
});
exports.deleteAdmin = deleteAdmin;
