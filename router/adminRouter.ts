import express from "express";
import {
  allAdmins,
  createAdmin,
  deleteAdmin,
  oneAdmin,
  // populateBusiness,
  signInAdmin,
  verifyAdmin,
} from "../controller/adminController";
import { populatingBusiness } from "../controller/userController";

const router = express.Router();

router.route("/all").get(allAdmins);
router.route("/create-admin").post(createAdmin);
router.route("/sign-in").post(signInAdmin);
router.route("/:_id").get(oneAdmin);
router.route("/:token/verify").get(verifyAdmin);
router.route("/:_id/delete").delete(deleteAdmin);
// router.route("/:adminID/business").get(populateBusiness);
router.route("/:adminID/workers").get(populatingBusiness);

export default router;
