import mongoose from "mongoose";

interface iUser {
  userName: string;
  email: string;
  password: string;
  token: string;
  verified: boolean;
  loginKey: string;
  businessName: string;
  sales: {}[];
  admin: {};
}

interface iUserData extends iUser, mongoose.Document {}

const userModel = new mongoose.Schema<iUserData>(
  {
    loginKey: {
      type: String,
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    businessName: {
      type: String,
      required: true,
    },
    // business: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "businesses",
    // },
    sales: [
      {
        type: mongoose.Types.ObjectId,
        ref: "sales",
      },
    ],
    admin: {
      type: mongoose.Types.ObjectId,
      ref: "admins",
    },
  },
  { timestamps: true }
);

export default mongoose.model<iUserData>("workers", userModel);
