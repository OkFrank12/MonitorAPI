import mongoose from "mongoose";

interface iBusiness {
  user: {};
  admin: {};
}

interface iBusinessData extends iBusiness, mongoose.Document {}

const businessModel = new mongoose.Schema<iBusinessData>(
  {
    admin: {
      type: mongoose.Types.ObjectId,
      ref: "admins",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "workers",
    },
  },
  { timestamps: true }
);

export default mongoose.model<iBusinessData>("businesses", businessModel);
