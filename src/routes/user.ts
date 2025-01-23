import { Request, Router } from "express";
import { register, login, refreshToken } from "../controllers/user";

const userRouter = Router();

userRouter.post("/register", register);

userRouter.post("/login", login);

userRouter.get('/refresh-token', refreshToken);

export default userRouter;
