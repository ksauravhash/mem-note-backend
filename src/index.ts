import express, { Request, Response } from "express";
import 'dotenv/config'
import { connectDB } from "./db";

const app = express();

const port = process.env.PORT;

connectDB();

app.get("/", (req: Request, res: Response) => {
  res.json({ success: 200 });
});

app.listen(port || 5000, ()=> {
    console.log(`Listening on ${port}`);
})
