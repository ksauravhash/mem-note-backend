import { Request, Response } from "express";
import { z } from "zod";
import User from "../models/User";
import { argon2d, hash, verify } from "argon2";
import jwt from "jsonwebtoken";

const jwtKey = process.env.JWT_KEY;

const registerDataSchema = z.object({
  username: z.string(),
  email: z.string(),
  name: z.string(),
  password: z.string(),
});

export const register = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const dataValidationOb = registerDataSchema.safeParse(data);
    if (dataValidationOb.success) {
      const userData = dataValidationOb.data;
      userData.password = await hash(userData.password);
      const user = await User.create(userData);
      await user.save();
      res.json({ success: true });
    } else {
      res.status(400).json(dataValidationOb.error);
    }
  } catch (err) {
    console.error(
      `${new Date().toTimeString()} ${new Date().toDateString()}`,
      err
    );
  }
};

const loginDataSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const login = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const dataValidationOb = loginDataSchema.safeParse(data);
    if (dataValidationOb.success) {
      const user = await User.findOne({
        username: dataValidationOb.data.username,
      });
      if (user) {
        const validPassword = await verify(
          user.password,
          dataValidationOb.data.password
        );
        if (validPassword) {
          const accessToken = jwt.sign(
            { username: dataValidationOb.data.username },
            //@ts-ignore
            jwtKey
          );
          res.json({ accessToken: accessToken });
        } else {
          res.status(401).json({ error: "Invalid password" });
        }
      } else {
        res.status(401).json({ error: "Invalid username" });
      }
    } else {
      res.status(400).json(dataValidationOb.error);
    }
  } catch (err) {
    console.error(
      `${new Date().toTimeString()} ${new Date().toDateString()}`,
      err
    );
  }
};
