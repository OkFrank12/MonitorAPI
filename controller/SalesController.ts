import { Request, Response } from "express";
import userModel from "../model/userModel";
import adminModel from "../model/adminModel";
import { HTTP } from "../errors/errorSetUp";
import salesModel from "../model/salesModel";
import mongoose from "mongoose";

export const createSales = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { productName, price, quantity, description, paymentMethod } =
      req.body;
    const { userID } = req.params;
    const user = await userModel.findById(userID);

    if (user?.businessName) {
      const sales = await salesModel.create({
        productName,
        price,
        userName: user?.userName,
        userID: userID,
        quantity,
        description,
        paymentMethod,
      });

      user?.sales.push(new mongoose.Types.ObjectId(sales?._id));
      user?.save();

      return res.status(HTTP.CREATED).json({
        message: "Sales is written",
        data: sales,
      });
    } else {
      return res.status(HTTP.UN_AUTHORIZED).json({
        message: "Sorry...You can't do this",
      });
    }
  } catch (error: any) {
    return res.status(HTTP.UN_FULLFILLED).json({
      message: "error creating sales",
      data: error.message,
    });
  }
};

export const populateUserSales = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;
    const user = await userModel.findById(userID).populate({
      path: "sales",
      options: {
        sort: { createdAt: -1 },
      },
    });

    return res.status(HTTP.OK).json({
      message: "Populated Users Sales",
      data: user,
    });
  } catch (error: any) {
    return res.status(HTTP.UN_FULLFILLED).json({
      message: "error populating sales",
      data: error.message,
    });
  }
};

export const populateAdminSalesReview = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { adminID } = req.params;
    const admin = await adminModel.findById(adminID).populate({
      path: "sales",
      options: {
        sort: { createdAt: -1 },
      },
    });

    return res.status(HTTP.OK).json({
      message: "Populated Admin Sales Review",
      data: admin,
    });
  } catch (error: any) {
    return res.status(HTTP.UN_FULLFILLED).json({
      message: "error populating sales review",
      data: error.message,
    });
  }
};

export const userDeleteSales = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { salesID, userID } = req.params;
    const user: any = await userModel.findById(userID);
    const sales = await salesModel.findById(salesID);

    if (user && sales) {
      user.sales.pull(new mongoose.Types.ObjectId(sales?._id));
      user.save();
    }

    return res.status(HTTP.DELETE).json({
      message: "Deleted Sales",
    });
  } catch (error: any) {
    return res.status(HTTP.UN_FULLFILLED).json({
      message: "error deleting sales",
      data: error.message,
    });
  }
};

export const readSales = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const read = await salesModel.find();

    return res.status(HTTP.OK).json({
      message: "Reading Sales",
      data: read,
    });
  } catch (error: any) {
    return res.status(HTTP.UN_FULLFILLED).json({
      message: "error reading sales",
      data: error.message,
    });
  }
};
