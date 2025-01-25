import { Request as req } from "express";

declare module 'express' {
    interface Request extends req  {
      user?: {
        id: string;
        username: string;
        name: string;
      };
    }
  }