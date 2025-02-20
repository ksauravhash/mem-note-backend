import { Router } from "express";
import { register, login, refreshToken, generateUserVerificationEmail, verifyAccount, googleLogin, googleLoginRedirect } from "../controllers/user";

const userRouter = Router();

userRouter.post("/register", register);

userRouter.post("/login", login);

userRouter.get('/refresh-token', refreshToken);

userRouter.post('/generateUserVerificationEmail', generateUserVerificationEmail)

userRouter.post('/verifyAccount', verifyAccount);

userRouter.get("/login/google", googleLogin);

userRouter.get("/login/google/redirect", googleLoginRedirect);

export default userRouter;
