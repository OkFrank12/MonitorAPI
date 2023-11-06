"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const router = express_1.default.Router();
router.route("/all").get(userController_1.allUsers);
router.route("/create-user").post(userController_1.createUser);
router.route("/sign-in").post(userController_1.signInUser);
router.route("/:_id").get(userController_1.oneUser);
router.route("/:token/verify").get(userController_1.verifyUser);
router.route("/:_id/delete").delete(userController_1.deleteUser);
exports.default = router;
