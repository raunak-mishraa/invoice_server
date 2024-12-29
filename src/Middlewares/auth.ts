import jwt from "jsonwebtoken";
import { Request , Response , NextFunction } from "express";

import {KEY} from "../constants"


if (!KEY) {
  throw new Error("SECRETKEY environment variable is not set.");
}

export const createtoken = (user: object): string => {
  try {
    return jwt.sign(user, KEY, { expiresIn: "24h" });
  } catch (error: any) {
    throw new Error(error.message || "An error occurred while creating the token");
  }
};

export const verifyTokenMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.token;

  if (!token) {
    console.error("No token provided.");
    return res.redirect("/login"); // Redirect if token is missing
  }

  try {
    jwt.verify(token, KEY);
    next(); // Token is valid, proceed to the controller
  } catch (error: any) {
    console.error("Token verification failed:", error.message);
    return res.redirect("/login"); // Redirect if token is invalid
  }
};
