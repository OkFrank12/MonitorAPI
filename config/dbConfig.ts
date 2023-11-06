import mongoose from "mongoose";
import { environment } from "./envVar";

const url: string = environment.MONGO;

export const dbConnect = () => {
  mongoose.connect(url).then(() => {
    console.log(`Server has connected...!!!`);
  });
};
