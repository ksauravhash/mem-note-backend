import { google, privateca_v1 } from 'googleapis';
import nodemailer from 'nodemailer';

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const clientRefreshToken = process.env.CLIENT_REFRESH_TOKEN
const redirectUri = process.env.REDIRECT_URI;

export const createTransporter = async()=> {
    const oAuthClient = new google.auth.OAuth2(
        {
            clientId: clientID,
            clientSecret: clientSecret,
            redirectUri: redirectUri
        }
    )

    oAuthClient.setCredentials({
        refresh_token: clientRefreshToken
    })
    const accessToken = await new Promise((resolve, reject) => {
        oAuthClient.getAccessToken((err, token) => {
          if (err) {
            reject();
          }
          resolve(token);
        });
      });
    const transport = nodemailer.createTransport({
        pool: true,
        secure: true,
        service: "gmail",
        auth: {
            type: 'OAUTH2',
            clientId: clientID,
            clientSecret: clientSecret,
            refreshToken: clientRefreshToken,
            user: process.env.USER_EMAIL,
            accessToken: accessToken as string
        }
    })
    return transport;
}