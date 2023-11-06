"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controller/adminController");
const userController_1 = require("../controller/userController");
const router = express_1.default.Router();
router.route("/all").get(adminController_1.allAdmins);
router.route("/create-admin").post(adminController_1.createAdmin);
router.route("/sign-in").post(adminController_1.signInAdmin);
router.route("/:_id").get(adminController_1.oneAdmin);
router.route("/:token/verify").get(adminController_1.verifyAdmin);
router.route("/:_id/delete").delete(adminController_1.deleteAdmin);
// router.route("/:adminID/business").get(populateBusiness);
router.route("/:adminID/workers").get(userController_1.populatingBusiness);
exports.default = router;
