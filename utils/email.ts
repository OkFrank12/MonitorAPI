import { google } from "googleapis";
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { environment } from "../config/envVar";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import adminModel from "../model/adminModel";
import userModel from "../model/userModel";

const url: string = `http://localhost:5173`;

const G_ID: string = environment.G_ID;
const G_SECRET: string = environment.G_SECRET;
const G_REFRESH: string = environment.G_REFRESH;
const G_URL: string = environment.G_URL;

const oAuth = new google.auth.OAuth2(G_ID, G_SECRET, G_URL);
oAuth.setCredentials({ access_token: G_REFRESH });

export const sendAdminMail = async (admin: any) => {
  try {
    const accessToken: any = (await oAuth.getAccessToken()).token;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "cfoonyemmemme@gmail.com",
        clientId: G_ID,
        clientSecret: G_SECRET,
        refreshToken: G_REFRESH,
        accessToken,
      },
    });

    const token = jwt.sign({ id: admin._id }, "token");

    const passedData = {
      adminUrl: `${url}/admin/${token}/verify`,
      adminName: admin.adminName,
      businessName: admin.businessName,
    };

    const findFile = path.join(__dirname, "../views/adminMail.ejs");
    const readFile = await ejs.renderFile(findFile, passedData);

    const mailer = {
      from: "Verify <cfoonyemmemme@gmail.com>",
      to: admin.email,
      subject: "Please Verify",
      html: readFile,
    };

    transporter.sendMail(mailer);
  } catch (error: any) {
    console.log(error);
  }
};

export const sendUserMail = async (user: any) => {
  try {
    const accessToken: any = (await oAuth.getAccessToken()).token;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "cfoonyemmemme@gmail.com",
        clientId: G_ID,
        clientSecret: G_SECRET,
        refreshToken: G_REFRESH,
        accessToken,
      },
    });

    const token = jwt.sign({ id: user._id }, "token");

    const passedData = {
      userUrl: `${url}/user/${token}/verify`,
      userName: user.userName,
    };

    const findFile = path.join(__dirname, "../views/userMail.ejs");
    const readFile = await ejs.renderFile(findFile, passedData);

    const mailer = {
      from: "Verify <cfoonyemmemme@gmail.com>",
      to: user.email,
      subject: "Please Verify",
      html: readFile,
    };

    transporter.sendMail(mailer);
  } catch (error: any) {
    console.log(error);
  }
};

export const loginKeyMail = async (admin: any, user: any) => {
  try {
    const accessToken: any = (await oAuth.getAccessToken()).token;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "cfoonyemmemme@gmail.com",
        clientId: G_ID,
        clientSecret: G_SECRET,
        refreshToken: G_REFRESH,
        accessToken,
      },
    });

    const generated = crypto.randomBytes(2).toString("hex");

    await adminModel.findByIdAndUpdate(
      admin?._id,
      { loginKey: generated },
      { new: true }
    );

    await userModel.findByIdAndUpdate(
      user?._id,
      { loginKey: generated },
      { new: true }
    );

    setTimeout(async () => {
      await adminModel.findByIdAndUpdate(
        admin?._id,
        { loginKey: "" },
        { new: true }
      );

      await userModel.findByIdAndUpdate(
        user?._id,
        { loginKey: "" },
        { new: true }
      );
    }, 21600000);

    const passedData = {
      loginKey: generated,
      userUrl: `${url}/user/sign-in`,
    };

    const findFile = path.join(__dirname, "../views/keyMail.ejs");
    const readFile = await ejs.renderFile(findFile, passedData);

    const mailer = {
      from: "LoginKey <cfoonyemmemme@gmail.com>",
      to: user.email,
      subject: "Your key",
      html: readFile,
    };

    transporter.sendMail(mailer);
  } catch (error: any) {
    console.log(error);
  }
};
