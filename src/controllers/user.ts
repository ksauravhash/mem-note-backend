import { Request, Response } from "express";
import { z } from "zod";
import User from "../models/User";
import { hash, verify } from "argon2";
import {
  generateAccessToken,
  generateRefreshToken,
  generateUniqueToken,
  verifyRefreshToken,
  verifyUniqueToken,
} from "../utility/auth";
import { createTransporter } from "../utility/mailer";
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from "jsonwebtoken";
import { google } from "googleapis";

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
      const userByUsername = await User.findOne({ username: userData.username });
      if (userByUsername) {
        res.status(409).json({ 'type': 'username', 'message': "This username is already registered" });
        return;
      }
      const userByEmail = await User.findOne({ email: userData.email });
      if (userByEmail) {
        res.status(409).json({ 'type': 'email', 'message': "This email is already registered" });
        return;
      }
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
          const payload: JWTPayloadType &{verified: boolean}  = {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            verified: user.verified
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
      const ob = verifyRefreshToken(refToken) as {id: string, username: string, name: string};
      const user = await User.findById(ob.id);
      if(user) {
        const payload: JWTPayloadType = {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email
        };
        const accessToken = generateAccessToken(payload);
        res.json({ user: payload, accessToken, refToken });
      }
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

const generateUserVerificationData = z.object({
  username: z.string().nonempty(),
  email: z.string().email(),
});

export const generateUserVerificationEmail = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const dataValidationOb = generateUserVerificationData.safeParse(data);
    if (dataValidationOb.success) {
      const userData = dataValidationOb.data;
      const link = process.env.FRONTEND_URLS.split(' ').
        map(url => `${url}/verify/${generateUniqueToken(userData)}`)[0]
      const transporter = await createTransporter();
      await transporter.sendMail({
        from: `MemNote" <${process.env.FROM_EMAIL}>`,
        to: userData.email,
        subject: 'MemNote - Verify Your Email',
        ...( {
          template: "verify-email",
          context: { username: userData.username, verificationLink: link },
        } as any ),
      })

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
}

const verifyAccountData = z.object({
  uniqueToken: z.string().nonempty()
})

export const verifyAccount = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const dataValidationOb = verifyAccountData.safeParse(data);
    if (dataValidationOb.success) {
      const userData = dataValidationOb.data;
      const userOb = verifyUniqueToken(userData.uniqueToken) as {
        username: string;
        email: string;
      };

      const user = await User.findOne({ email: userOb.email });
      if (user) {
        user.verified = true;
        await user.save();
        res.sendStatus(200);
      } else {
        res.sendStatus(400);
      }
    } else {
      res.status(400).json(dataValidationOb.error);
    }
  } catch (err) {
    if (
      err instanceof JsonWebTokenError ||
      err instanceof TokenExpiredError ||
      err instanceof NotBeforeError
    )
      res.sendStatus(401);

    res.status(500).send();
    console.error(
      `${new Date().toTimeString()} ${new Date().toDateString()}`,
      err
    );
  }
}

export const googleLogin = (req: Request, res: Response) => {
  try {
    const isProduction = process.env.NODE_ENV === "production" || process.env.RAILWAY_ENVIRONMENT === "production"
    const redirectUrl = `${isProduction ? 'https' : 'http'}://${req.get('host')}/${process.env.REDIRECT_LINK_2}`
    const authURL = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${redirectUrl}&response_type=code&scope=email profile&access_type=offline`;
    res.redirect(authURL);
  } catch (err) {
    res.status(500).send();
    console.error(
      `${new Date().toTimeString()} ${new Date().toDateString()}`,
      err
    );
  }
}



export const googleLoginRedirect = async (req: Request, res: Response) => {
  try {
    const isProduction = process.env.NODE_ENV === "production" || process.env.RAILWAY_ENVIRONMENT === "production"
    const oauth2Client = new google.auth.OAuth2(
      {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        redirectUri: `${isProduction ? 'https' : 'http'}://${req.get('host')}/${process.env.REDIRECT_LINK_2}`
      }
    );
    if (req.query.error) {
      res.redirect(`${process.env.FRONTEND_URLS.split(' ')[0]}/login`);
    } else {
      const code = req.query.code as string;
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
      const userInfo = await oauth2Client.request({
        url: "https://www.googleapis.com/oauth2/v3/userinfo",
      });
      const userData = userInfo.data as {
        sub: string,
        name: string,
        given_name: string,
        family_name: string,
        picture: string,
        email: string,
        email_verified: boolean;
      }
      let user = await User.findOne({ email: userData.email });
      if (!user) {
        user = await new User({
          name: userData.name,
          email: userData.email,
          username: userData.email.split('@')[0],
          oauth: {
            provider: 'google'
          },
          verified: true
        }).save();
      }
      else {
        user.name = userData.name;
        user.oauth = { provider: 'google' };
        await user.save();
      }
      const payload = {
        id: user?._id,
        username: user?.username,
        name: user?.name,
      };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      res.redirect(`${process.env.FRONTEND_URLS.split(' ')[0]}/login?at=${accessToken}&rt=${refreshToken}`);

    }

  } catch (err) {
    res.status(500).send();
    console.error(
      `${new Date().toTimeString()} ${new Date().toDateString()}`,
      err
    );
  }
}
