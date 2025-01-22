import express, { Request, Response } from "express";
import cors from "cors";
import 'dotenv/config'
import { connectDB } from "./db";

const app = express();

app.use(express.json());

app.use(cors());

const port = process.env.PORT;

connectDB();

app.get("/", (req: Request, res: Response) => {
  res.json({ success: 200 });
});

app.listen(port || 5000, ()=> {
    console.log(`Listening on ${port}`);
})
