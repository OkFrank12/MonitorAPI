import express from "express";
import {
  allUsers,
  createUser,
  deleteUser,
  oneUser,
  signInUser,
  verifyUser,
} from "../controller/userController";

const router = express.Router();

router.route("/all").get(allUsers);
router.route("/create-user").post(createUser);
router.route("/sign-in").post(signInUser);
router.route("/:_id").get(oneUser);
router.route("/:token/verify").get(verifyUser);
router.route("/:_id/delete").delete(deleteUser);

export default router;
