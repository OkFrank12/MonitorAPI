import mongoose from "mongoose";

interface iSales {
  userID: string;
  userName: string;
  productName: string;
  quantity: number;
  description: string;
  paymentMethod: string;
  price: number;
  user: {};
  admin: {};
}

interface iSalesData extends iSales, mongoose.Document {}

const salesModel = new mongoose.Schema<iSalesData>(
  {
    userID: {
      type: String,
    },
    userName: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "workers",
    },
    admin: {
      type: mongoose.Types.ObjectId,
      ref: "admins",
    },
    price: {
      type: Number,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<iSalesData>("sales", salesModel);
