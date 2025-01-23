import jwt from "jsonwebtoken";

const accessSecret = process.env.ACCESS_TOKEN_SECRET!;
const refreshSecret = process.env.REFRESH_TOKEN_SECRET!;

export const generateRefreshToken = (payload: string | Buffer | object) => {
  return jwt.sign(payload, refreshSecret, { expiresIn: "7d" });
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, refreshSecret);
}

export const generateAccessToken = (payload: string | Buffer | object) => {
  return jwt.sign(payload, accessSecret, { expiresIn: "15m" });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, accessSecret);
}

