import { Request, Response } from "express";
import { z } from "zod";
import User from "../models/User";
import { hash, verify } from "argon2";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utility/auth";

const registerDataSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  name: z.string(),
  password: z.string().min(8),
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
    res.status(500).send();
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
          const payload = {
            id: user?._id,
            username: user?.username,
            name: user?.name,
          };
          const accessToken = generateAccessToken(payload);
          const refreshToken = generateRefreshToken(payload);
          res.json({ user: payload, accessToken, refreshToken });
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
    res.status(500).send();
    console.error(
      `${new Date().toTimeString()} ${new Date().toDateString()}`,
      err
    );
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers["authorization"];
    const refToken = authHeader && authHeader.split(" ")[1];
    if (!refToken) {
      res.sendStatus(403);
      return;
    }
    try {
      const ob = verifyRefreshToken(refToken);
      // @ts-ignore
      const user = await User.findById(ob.id);
      const payload = {
        id: user?._id,
        username: user?.username,
        name: user?.name,
      };
      const accessToken = generateAccessToken(payload);
      res.json({ user: payload, accessToken, refToken });
    } catch (err) {
      res.sendStatus(403);
    }
  } catch (err) {
    res.status(500).send();
    console.error(
      `${new Date().toTimeString()} ${new Date().toDateString()}`,
      err
    );
  }
};
