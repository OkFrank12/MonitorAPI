import mongoose from "mongoose";

interface iAdmin {
  adminName: string;
  email: string;
  password: string;
  businessName: string;
  user: {}[];
  token: string;
  sales: {}[];
  verified: boolean;
  loginKey: string;
}

interface iAdminData extends iAdmin, mongoose.Document {}

const adminModel = new mongoose.Schema<iAdminData>(
  {
    loginKey: {
      type: String,
    },
    adminName: {
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
    businessName: {
      type: String,
      required: true,
    },
    user: [
      {
        type: mongoose.Types.ObjectId,
        ref: "workers",
      },
    ],
    sales: [
      {
        type: mongoose.Types.ObjectId,
        ref: "sales",
      },
    ],
    token: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<iAdminData>("admins", adminModel);
