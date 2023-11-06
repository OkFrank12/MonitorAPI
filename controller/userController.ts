import { Request, Response } from "express";
import { HTTP } from "../errors/errorSetUp";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendUserMail } from "../utils/email";
import jwt from "jsonwebtoken";
import userModel from "../model/userModel";
import adminModel from "../model/adminModel";
import mongoose from "mongoose";

export const createUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userName, email, password, businessName } = req.body;
    const salted = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salted);
    const token = crypto.randomBytes(10).toString("hex");
    const user = await userModel.create({
      userName,
      email,
      password: hashed,
      token,
      businessName,
    });

    const admin = await adminModel.findOne({ businessName });

    if (admin?.businessName === businessName) {
      if (admin?.user.length === 2) {
        return res.status(HTTP.UN_AUTHORIZED).json({
          message: "Your Boss can only accept two boys",
        });
      }
      admin?.user.push(new mongoose.Types.ObjectId(user?._id));
      admin?.save();
    }
    sendUserMail(user).then(() => {
      console.log(`user mail sent!!!`);
    });
    return res.status(HTTP.CREATED).json({
      message: "Created user",
      data: user,
    });
  } catch (error: any) {
    return res.status(HTTP.UN_FULLFILLED).json({
      message: "error creating user",
      data: error.message,
    });
  }
};

export const populatingBusiness = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { adminID } = req.params;
    const admin = await adminModel.findById(adminID).populate({
      path: "user",
      options: {
        sort: { createdAt: -1 },
      },
    });

    return res.status(HTTP.OK).send({
      message: "Populated",
      data: admin,
    });
  } catch (error: any) {
    return res.status(HTTP.UN_FULLFILLED).json({
      message: "error populating business",
      data: error.message,
    });
  }
};

export const verifyUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { token } = req.params;
    jwt.verify(token, "token", async (err, payload: any) => {
      if (err) {
        throw new Error();
      } else {
        const user = await userModel.findById(payload.id);
        if (user) {
          await userModel.findByIdAndUpdate(payload.id, {
            verified: true,
            token: "",
          });

          return res.status(HTTP.OK).json({
            message: "user has been verified",
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
      message: "error verifying user",
      data: error.message,
    });
  }
};

export const signInUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password, loginKey } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      if (loginKey !== user.loginKey) {
        return res.status(HTTP.UN_AUTHORIZED).json({
          message: "This is wrong",
        });
      } else {
        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) {
          const token = jwt.sign({ id: user._id }, "token");
          if (user?.verified && user.token === "") {
            return res.status(HTTP.OK).json({
              message: `Welcome Back ${user.userName}`,
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
      }
    } else {
      return res.status(HTTP.UN_AUTHORIZED).json({
        message: "Email is not found",
      });
    }
  } catch (error: any) {
    return res.status(HTTP.UN_FULLFILLED).json({
      message: "error signing in user",
      data: error.message,
    });
  }
};

export const allUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const all = await userModel.find();

    return res.status(HTTP.OK).json({
      message: "all user",
      data: all,
    });
  } catch (error: any) {
    return res.status(HTTP.UN_FULLFILLED).json({
      message: "error getting all user",
      data: error.message,
    });
  }
};

export const oneUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { _id } = req.params;
    const one = await userModel.findById(_id);

    return res.status(HTTP.OK).json({
      message: "one user",
      data: one,
    });
  } catch (error: any) {
    return res.status(HTTP.UN_FULLFILLED).json({
      message: "error getting one user",
      data: error.message,
    });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { _id } = req.params;
    await userModel.findByIdAndDelete(_id);

    return res.status(HTTP.DELETE).json({
      message: "Deleted user",
    });
  } catch (error: any) {
    return res.status(HTTP.UN_FULLFILLED).json({
      message: "error deleting user",
      data: error.message,
    });
  }
};
