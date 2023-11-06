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
exports.loginKeyMail = exports.sendUserMail = exports.sendAdminMail = void 0;
const googleapis_1 = require("googleapis");
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const envVar_1 = require("../config/envVar");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const adminModel_1 = __importDefault(require("../model/adminModel"));
const userModel_1 = __importDefault(require("../model/userModel"));
const url = `http://localhost:5173`;
const G_ID = envVar_1.environment.G_ID;
const G_SECRET = envVar_1.environment.G_SECRET;
const G_REFRESH = envVar_1.environment.G_REFRESH;
const G_URL = envVar_1.environment.G_URL;
const oAuth = new googleapis_1.google.auth.OAuth2(G_ID, G_SECRET, G_URL);
oAuth.setCredentials({ access_token: G_REFRESH });
const sendAdminMail = (admin) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = (yield oAuth.getAccessToken()).token;
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "cfoonyemmemme@gmail.com",
                clientId: G_ID,
                clientSecret: G_SECRET,
                refreshToken: G_REFRESH,
                accessToken,
            },
        });
        const token = jsonwebtoken_1.default.sign({ id: admin._id }, "token");
        const passedData = {
            adminUrl: `${url}/admin/${token}/verify`,
            adminName: admin.adminName,
            businessName: admin.businessName,
        };
        const findFile = path_1.default.join(__dirname, "../views/adminMail.ejs");
        const readFile = yield ejs_1.default.renderFile(findFile, passedData);
        const mailer = {
            from: "Verify <cfoonyemmemme@gmail.com>",
            to: admin.email,
            subject: "Please Verify",
            html: readFile,
        };
        transporter.sendMail(mailer);
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendAdminMail = sendAdminMail;
const sendUserMail = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = (yield oAuth.getAccessToken()).token;
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "cfoonyemmemme@gmail.com",
                clientId: G_ID,
                clientSecret: G_SECRET,
                refreshToken: G_REFRESH,
                accessToken,
            },
        });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, "token");
        const passedData = {
            userUrl: `${url}/user/${token}/verify`,
            userName: user.userName,
        };
        const findFile = path_1.default.join(__dirname, "../views/userMail.ejs");
        const readFile = yield ejs_1.default.renderFile(findFile, passedData);
        const mailer = {
            from: "Verify <cfoonyemmemme@gmail.com>",
            to: user.email,
            subject: "Please Verify",
            html: readFile,
        };
        transporter.sendMail(mailer);
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendUserMail = sendUserMail;
const loginKeyMail = (admin, user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = (yield oAuth.getAccessToken()).token;
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "cfoonyemmemme@gmail.com",
                clientId: G_ID,
                clientSecret: G_SECRET,
                refreshToken: G_REFRESH,
                accessToken,
            },
        });
        const generated = crypto_1.default.randomBytes(2).toString("hex");
        yield adminModel_1.default.findByIdAndUpdate(admin === null || admin === void 0 ? void 0 : admin._id, { loginKey: generated }, { new: true });
        yield userModel_1.default.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, { loginKey: generated }, { new: true });
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield adminModel_1.default.findByIdAndUpdate(admin === null || admin === void 0 ? void 0 : admin._id, { loginKey: "" }, { new: true });
            yield userModel_1.default.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, { loginKey: "" }, { new: true });
        }), 21600000);
        const passedData = {
            loginKey: generated,
            userUrl: `${url}/user/sign-in`,
        };
        const findFile = path_1.default.join(__dirname, "../views/keyMail.ejs");
        const readFile = yield ejs_1.default.renderFile(findFile, passedData);
        const mailer = {
            from: "LoginKey <cfoonyemmemme@gmail.com>",
            to: user.email,
            subject: "Your key",
            html: readFile,
        };
        transporter.sendMail(mailer);
    }
    catch (error) {
        console.log(error);
    }
});
exports.loginKeyMail = loginKeyMail;
