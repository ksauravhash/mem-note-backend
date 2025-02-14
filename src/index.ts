import express, { Request, Response } from "express";
import cors from "cors";
import 'dotenv/config'
import { connectDB } from "./db";
import userRouter from "./routes/user";
import notebookRouter from "./routes/notebook";
import noteRouter from "./routes/note";

const app = express();

app.use(express.json());

const frontend_urls = process.env.FRONTEND_URLS.split(" ");

app.use(cors({
  origin: frontend_urls
}));

const port = process.env.PORT;

connectDB();

app.use('/user',userRouter);

app.use('/notebook', notebookRouter);

app.use('/note', noteRouter);

app.get("/test", (req: Request, res: Response) => {
  res.json({ success: 200 });
});

app.listen(port || 5000, ()=> {
    console.log(`Listening on ${port}`);
})
