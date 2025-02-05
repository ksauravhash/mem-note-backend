import express, { Request, Response } from "express";
import cors from "cors";
import 'dotenv/config'
import { connectDB } from "./db";
import userRouter from "./routes/user";
import notebookRouter from "./routes/notebook";

const app = express();

app.use(express.json());

app.use(cors());

const port = process.env.PORT;

connectDB();

app.use('/user',userRouter);

app.use('/notebook', notebookRouter);

app.get("/test", (req: Request, res: Response) => {
  res.json({ success: 200 });
});

app.listen(port || 5000, ()=> {
    console.log(`Listening on ${port}`);
})
