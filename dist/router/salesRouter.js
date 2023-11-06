"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SalesController_1 = require("../controller/SalesController");
const router = express_1.default.Router();
router.route("/:userID/sales").post(SalesController_1.createSales);
router.route("/:userID/sales-populate").get(SalesController_1.populateUserSales);
router.route("/:adminID/sales-review").get(SalesController_1.populateAdminSalesReview);
router.route("/:salesID/:userID/delete-sales").delete(SalesController_1.userDeleteSales);
router.route("/read").get(SalesController_1.readSales);
exports.default = router;
