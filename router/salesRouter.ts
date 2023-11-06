import express from "express";
import {
  createSales,
  populateAdminSalesReview,
  populateUserSales,
  readSales,
  userDeleteSales,
} from "../controller/SalesController";

const router = express.Router();

router.route("/:userID/sales").post(createSales);
router.route("/:userID/sales-populate").get(populateUserSales);
router.route("/:adminID/sales-review").get(populateAdminSalesReview);
router.route("/:salesID/:userID/delete-sales").delete(userDeleteSales);
router.route("/read").get(readSales);

export default router;
