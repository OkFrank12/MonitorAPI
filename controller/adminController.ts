import { Request, Response } from "express";
import { HTTP } from "../errors/errorSetUp";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { loginKeyMail, sendAdminMail, sendUserMail } from "../utils/email";
import jwt from "jsonwebtoken";
import adminModel from "../model/adminModel";

export const createAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { adminName, email, password, businessName } = req.body;
    const salted = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salted);
    const token = crypto.randomBytes(10).toString("hex");
    const admin = await adminModel.create({
      adminName,
      email,
      password: hashed,
      businessName,
      token,
    });

    sendAdminMail(admin).then(() => {
      console.log(`admin mail sent!!!`);
    });
    return res.status(HTTP.CREATED).json({
      message: "Created admin",
      data: admin,
    });
  } catch (error: any) {
    return res.status(HTTP.UN_FULLFILLED).json({
      message: "error creating admin",
      data: error.message,
    });
  }
};

export const verifyAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { token } = req.params;
    jwt.verify(token, "token", async (err, payload: any) => {
      if (err) {
        throw new Error();
      } else {
        const admin = await adminModel.findById(payload.id);
        if (admin) {
          await adminModel.findByIdAndUpdate(payload.id, {
            verified: true,
            token: "",
          });

          return res.status(HTTP.OK).json({
            message: "admin has been verified",
          });
        } else {
          return res.status(HTTP.UN_AUTHORIZED).json({
            message: "Token Error",
          });
        }
      }
    });

    return res;
  } catch (error: any) {
    return res.status(HTTP.UN_FULLFILLED).json({
      message: "error verifying admin",
      data: error.message,
    });
  }
};

export const signInAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const admin = await adminModel.findOne({ email });
    if (admin) {
      const validPassword = await bcrypt.compare(password, admin.password);
      if (validPassword) {
        const token = jwt.sign({ id: admin._id }, "token");
        if (admin?.verified && admin.token === "") {
          const populate = await adminModel.findById(admin?._id).populate({
            path: "user",
            options: {
              sort: { createdAt: -1 },
            },
          });

          loginKeyMail(admin, populate?.user[0]).then(() => {
            console.log("Sent..!");
          });
          // loginKeyMail(admin, populate?.user[1]).then(() => {
          //   console.log("Sent..!");
          // });
          return res.status(HTTP.OK).json({
            message: `Welcome Back ${admin.adminName}`,
            data: token,
          });
        } else {
          return res.status(HTTP.UN_AUTHORIZED).json({
            message: "Please verify this account",
          });
        }
      } else {
        return res.status(HTTP.UN_AUTHORIZED).json({
          message: "Password is invalid",
        });
      }
    } else {
      return res.status(HTTP.UN_AUTHORIZED).json({
        message: "Email is not found",
      });
    }
  } catch (error: any) {
    return res.status(HTTP.UN_FULLFILLED).json({
      message: "error signing in admin",
      data: error.message,
    });
  }
};

export const allAdmins = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const all = await adminModel.find();

    return res.status(HTTP.OK).json({
      message: "all admin",
      data: all,
    });
  } catch (error: any) {
    return res.status(HTTP.UN_FULLFILLED).json({
      message: "error getting all admin",
      data: error.message,
    });
  }
};

export const oneAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { _id } = req.params;
    const one = await adminModel.findById(_id);

    return res.status(HTTP.OK).json({
      message: "one admin",
      data: one,
    });
  } catch (error: any) {
    return res.status(HTTP.UN_FULLFILLED).json({
      message: "error getting one admin",
      data: error.message,
    });
  }
};

export const deleteAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { _id } = req.params;
    await adminModel.findByIdAndDelete(_id);

    return res.status(HTTP.DELETE).json({
      message: "Deleted admin",
    });
  } catch (error: any) {
    return res.status(HTTP.UN_FULLFILLED).json({
      message: "error deleting admin",
      data: error.message,
    });
  }
};
