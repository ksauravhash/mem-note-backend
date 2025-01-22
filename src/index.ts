import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.json({ success: 200 });
});

app.listen(5000, ()=> {
    console.log("Listening on PORT");
})
