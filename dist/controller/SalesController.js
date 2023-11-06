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
exports.readSales = exports.userDeleteSales = exports.populateAdminSalesReview = exports.populateUserSales = exports.createSales = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const adminModel_1 = __importDefault(require("../model/adminModel"));
const errorSetUp_1 = require("../errors/errorSetUp");
const salesModel_1 = __importDefault(require("../model/salesModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const createSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productName, price, quantity, description, paymentMethod, businessName, } = req.body;
        const { userID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        const admin = yield userModel_1.default.findOne({ businessName });
        if ((user === null || user === void 0 ? void 0 : user.businessName) === (admin === null || admin === void 0 ? void 0 : admin.businessName)) {
            const sales = yield salesModel_1.default.create({
                productName,
                price,
                userName: user === null || user === void 0 ? void 0 : user.userName,
                userID: userID,
                quantity,
                description,
                paymentMethod,
            });
            user === null || user === void 0 ? void 0 : user.sales.push(new mongoose_1.default.Types.ObjectId(sales === null || sales === void 0 ? void 0 : sales._id));
            user === null || user === void 0 ? void 0 : user.save();
            admin === null || admin === void 0 ? void 0 : admin.sales.push(new mongoose_1.default.Types.ObjectId(sales === null || sales === void 0 ? void 0 : sales._id));
            admin === null || admin === void 0 ? void 0 : admin.save();
            return res.status(errorSetUp_1.HTTP.CREATED).json({
                message: "Sales is written",
                data: sales,
            });
        }
        else {
            return res.status(errorSetUp_1.HTTP.UN_AUTHORIZED).json({
                message: "Sorry...You can't do this",
            });
        }
    }
    catch (error) {
        return res.status(errorSetUp_1.HTTP.UN_FULLFILLED).json({
            message: "error creating sales",
            data: error.message,
        });
    }
});
exports.createSales = createSales;
const populateUserSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield userModel_1.default.findById(userID).populate({
            path: "sales",
            options: {
                sort: { createdAt: -1 },
            },
        });
        return res.status(errorSetUp_1.HTTP.OK).json({
            message: "Populated Users Sales",
            data: user,
        });
    }
    catch (error) {
        return res.status(errorSetUp_1.HTTP.UN_FULLFILLED).json({
            message: "error populating sales",
            data: error.message,
        });
    }
});
exports.populateUserSales = populateUserSales;
const populateAdminSalesReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminID } = req.params;
        const admin = yield adminModel_1.default.findById(adminID).populate({
            path: "sales",
            options: {
                sort: { createdAt: -1 },
            },
        });
        return res.status(errorSetUp_1.HTTP.OK).json({
            message: "Populated Admin Sales Review",
            data: admin,
        });
    }
    catch (error) {
        return res.status(errorSetUp_1.HTTP.UN_FULLFILLED).json({
            message: "error populating sales review",
            data: error.message,
        });
    }
});
exports.populateAdminSalesReview = populateAdminSalesReview;
const userDeleteSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { salesID, userID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        const sales = yield salesModel_1.default.findById(salesID);
        if (user && sales) {
            user.sales.pull(new mongoose_1.default.Types.ObjectId(sales === null || sales === void 0 ? void 0 : sales._id));
            user.save();
        }
        return res.status(errorSetUp_1.HTTP.DELETE).json({
            message: "Deleted Sales",
        });
    }
    catch (error) {
        return res.status(errorSetUp_1.HTTP.UN_FULLFILLED).json({
            message: "error deleting sales",
            data: error.message,
        });
    }
});
exports.userDeleteSales = userDeleteSales;
const readSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const read = yield salesModel_1.default.find();
        return res.status(errorSetUp_1.HTTP.OK).json({
            message: "Reading Sales",
            data: read,
        });
    }
    catch (error) {
        return res.status(errorSetUp_1.HTTP.UN_FULLFILLED).json({
            message: "error reading sales",
            data: error.message,
        });
    }
});
exports.readSales = readSales;
