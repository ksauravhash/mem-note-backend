import { Request, Response } from "express";
import { z } from "zod";
import Notebook from "../models/Notebook";

const notebookDataSchema = z.object({
    title: z.string().nonempty()
})

export const create = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const dataValidationOb = notebookDataSchema.safeParse(data);
    if (dataValidationOb.success) {
      const notebookData = dataValidationOb.data;
      const notebook = await Notebook.create({title: notebookData.title})
      await notebook.save();
      res.sendStatus(200);
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
