import { Request, Response } from "express";

export const register = (req: Request, res: Response) => {
  try {
    
  } catch (err) {
    console.error(
      `${new Date().toTimeString()} ${new Date().toDateString()}`,
      err
    );
  }
};

export const login = (req: Request, res: Response) => {
  try {
  } catch (err) {
    console.error(
      `${new Date().toTimeString()} ${new Date().toDateString()}`,
      err
    );
  }
};
