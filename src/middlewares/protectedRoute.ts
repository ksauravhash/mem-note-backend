import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utility/auth";
import jwt from "jsonwebtoken";

export const protectedRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const authToken = authHeader && authHeader.split(" ")[1];
    if (!authToken) {
      res.sendStatus(401);
      return;
    }
    req.user = verifyAccessToken(authToken) as {
      id: string;
      username: string;
      name: string;
    };
    next();
  } catch (err) {
    if (
      err instanceof jwt.JsonWebTokenError ||
      err instanceof jwt.TokenExpiredError ||
      err instanceof jwt.NotBeforeError
    )
      res.sendStatus(401);
    else res.sendStatus(500);
    console.error(
      `${new Date().toTimeString()} ${new Date().toDateString()}`,
      err
    );
  }
};
