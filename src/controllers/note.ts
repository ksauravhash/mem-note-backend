import { Request, Response } from "express";
import { z } from "zod";
import Notebook from "../models/Notebook";
import Note from "../models/Note";

const noteDataSchema = z.object({
    title: z.string(),
    noteBlocks: z.array(z.object({
        type: z.enum(["word", "description", "image", "audio"]),
        content: z.string(),
        sequenceNumber: z.coerce.number(),
        answer: z.boolean()
    })),
    notebookID: z.string()
});

export const create = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const dataValidationOb = noteDataSchema.safeParse(data);
        if (dataValidationOb.success) {
            const noteData = dataValidationOb.data;
            const notebook = await Notebook.findById(noteData.notebookID);
            const note = await Note.create({
                title: noteData.title,
                noteBlocks: noteData.noteBlocks
            });
            notebook?.notes.push(note);
            await notebook?.save();
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