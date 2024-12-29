import bcrypt from "bcrypt";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { createtoken } from "../Middlewares/auth";


// Helper function to check if the user exists
const checkExisting = async (email: string) => {
  const db = mongoose.connection.db;
  // @ts-ignore
  return await db.collection("users").findOne({ email });
};

// Login Handler
export const Login = async (req: Request, res: Response): Promise<void> => {
 

  try {
    const { email , password } = req.body;

    

    const user = await checkExisting(email);
    if (!user) {
      res.status(404).json({ success: false, message: "Incorrect Username" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(400).json({ success: false, message: "Incorrect Password" });
      return;
    }

    const token = await createtoken({
      email: user.email,
    });
    // res.cookie("token", token, { maxAge: 24 * 60 * 60 * 1000});
    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true, // Prevents client-side scripts from accessing the cookie
      secure: true, // Ensures the cookie is sent over HTTPS only
      sameSite: "none", // Required for cross-origin cookies
      path: "/", // Makes the cookie accessible to all routes
    });

    res.status(200).json({ success: true, message: "Login Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Register Handler
export const Register = async (req: Request, res: Response): Promise<void> => {
  
  

  try {
    const { username, password, email } = req.body;

    const user = await checkExisting(email);
    if (user) {
      res.status(400).json({ success: false, message: "User Already Exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const db = mongoose.connection.db;
    const newUser = { username, email, password: hashedPassword };
    // @ts-ignore
    const result = await db.collection("users").insertOne(newUser);

    if (!result) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
      return;
    }

    const token = await createtoken({
      email: email,
    });
    // res.cookie("token", token, { maxAge: 24 * 60 * 60 * 1000});
    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true, // Prevents client-side scripts from accessing the cookie
      secure: true, // Ensures the cookie is sent over HTTPS only
      sameSite: "none", // Required for cross-origin cookies
      path: "/", // Makes the cookie accessible to all routes
    });
    
    res.status(200).json({ success: true, message: "Registered Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
