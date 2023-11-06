import { Request, Response, NextFunction } from "express";
import { HTTP, errorSetUp } from "./errorSetUp";

const prepareError = (err: errorSetUp, res: Response) => {
  return res.status(HTTP.BAD).json({
    name: err.name,
    message: err.message,
    status: err.status,
    success: err.success,
    stack: err.stack,
    err,
  });
};

export const errorSet = (
  err: errorSetUp,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  prepareError(err, res);
};
