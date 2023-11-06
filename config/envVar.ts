import dotenv from "dotenv";
dotenv.config();

export const environment = {
  PORT: process.env.PORT!,
  MONGO: process.env.MONGO_URL!,
  G_ID: process.env.G_ID!,
  G_SECRET: process.env.G_SECRET!,
  G_URL: process.env.G_URL!,
  G_REFRESH: process.env.G_REFRESH!,
};
