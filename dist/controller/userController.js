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
exports.deleteUser = exports.oneUser = exports.allUsers = exports.signInUser = exports.verifyUser = exports.populatingBusiness = exports.createUser = void 0;
const errorSetUp_1 = require("../errors/errorSetUp");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const email_1 = require("../utils/email");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../model/userModel"));
const adminModel_1 = __importDefault(require("../model/adminModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, email, password, businessName } = req.body;
        const salted = yield bcrypt_1.default.genSalt(10);
        const hashed = yield bcrypt_1.default.hash(password, salted);
        const token = crypto_1.default.randomBytes(10).toString("hex");
        const user = yield userModel_1.default.create({
            userName,
            email,
            password: hashed,
            token,
            businessName,
        });
        const admin = yield adminModel_1.default.findOne({ businessName });
        if ((admin === null || admin === void 0 ? void 0 : admin.businessName) === businessName) {
            if ((admin === null || admin === void 0 ? void 0 : admin.user.length) === 2) {
                return res.status(errorSetUp_1.HTTP.UN_AUTHORIZED).json({
                    message: "Your Boss can only accept two boys",
                });
            }
            admin === null || admin === void 0 ? void 0 : admin.user.push(new mongoose_1.default.Types.ObjectId(user === null || user === void 0 ? void 0 : user._id));
            admin === null || admin === void 0 ? void 0 : admin.save();
        }
        (0, email_1.sendUserMail)(user).then(() => {
            console.log(`user mail sent!!!`);
        });
        return res.status(errorSetUp_1.HTTP.CREATED).json({
            message: "Created user",
            data: user,
        });
    }
    catch (error) {
        return res.status(errorSetUp_1.HTTP.UN_FULLFILLED).json({
            message: "error creating user",
            data: error.message,
        });
    }
});
exports.createUser = createUser;
const populatingBusiness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminID } = req.params;
        const admin = yield adminModel_1.default.findById(adminID).populate({
            path: "user",
            options: {
                sort: { createdAt: -1 },
            },
        });
        return res.status(errorSetUp_1.HTTP.OK).send({
            message: "Populated",
            data: admin,
        });
    }
    catch (error) {
        return res.status(errorSetUp_1.HTTP.UN_FULLFILLED).json({
            message: "error populating business",
            data: error.message,
        });
    }
});
exports.populatingBusiness = populatingBusiness;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        jsonwebtoken_1.default.verify(token, "token", (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                throw new Error();
            }
            else {
                const user = yield userModel_1.default.findById(payload.id);
                if (user) {
                    yield userModel_1.default.findByIdAndUpdate(payload.id, {
                        verified: true,
                        token: "",
                    });
                    return res.status(errorSetUp_1.HTTP.OK).json({
                        message: "user has been verified",
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
            message: "error verifying user",
            data: error.message,
        });
    }
});
exports.verifyUser = verifyUser;
const signInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, loginKey } = req.body;
        const user = yield userModel_1.default.findOne({ email });
        if (user) {
            if (loginKey !== user.loginKey) {
                return res.status(errorSetUp_1.HTTP.UN_AUTHORIZED).json({
                    message: "This is wrong",
                });
            }
            else {
                const validPassword = yield bcrypt_1.default.compare(password, user.password);
                if (validPassword) {
                    const token = jsonwebtoken_1.default.sign({ id: user._id }, "token");
                    if ((user === null || user === void 0 ? void 0 : user.verified) && user.token === "") {
                        return res.status(errorSetUp_1.HTTP.OK).json({
                            message: `Welcome Back ${user.userName}`,
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
        }
        else {
            return res.status(errorSetUp_1.HTTP.UN_AUTHORIZED).json({
                message: "Email is not found",
            });
        }
    }
    catch (error) {
        return res.status(errorSetUp_1.HTTP.UN_FULLFILLED).json({
            message: "error signing in user",
            data: error.message,
        });
    }
});
exports.signInUser = signInUser;
const allUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const all = yield userModel_1.default.find();
        return res.status(errorSetUp_1.HTTP.OK).json({
            message: "all user",
            data: all,
        });
    }
    catch (error) {
        return res.status(errorSetUp_1.HTTP.UN_FULLFILLED).json({
            message: "error getting all user",
            data: error.message,
        });
    }
});
exports.allUsers = allUsers;
const oneUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const one = yield userModel_1.default.findById(_id);
        return res.status(errorSetUp_1.HTTP.OK).json({
            message: "one user",
            data: one,
        });
    }
    catch (error) {
        return res.status(errorSetUp_1.HTTP.UN_FULLFILLED).json({
            message: "error getting one user",
            data: error.message,
        });
    }
});
exports.oneUser = oneUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        yield userModel_1.default.findByIdAndDelete(_id);
        return res.status(errorSetUp_1.HTTP.DELETE).json({
            message: "Deleted user",
        });
    }
    catch (error) {
        return res.status(errorSetUp_1.HTTP.UN_FULLFILLED).json({
            message: "error deleting user",
            data: error.message,
        });
    }
});
exports.deleteUser = deleteUser;
