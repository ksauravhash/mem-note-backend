import { Request, Response } from "express";
import { z } from "zod";
import Notebook from "../models/Notebook";
import Note from "../models/Note";
import mongoose from "mongoose";

const noteDataSchema = z.object({
    title: z.string().nonempty(),
    noteBlocks: z.array(z.object({
        type: z.enum(["word", "description", "image", "audio"]),
        content: z.string(),
        sequenceNumber: z.coerce.number(),
        answer: z.boolean()
    })),
    notebookID: z.string().nonempty()
});

export const create = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const dataValidationOb = noteDataSchema.safeParse(data);
        if (dataValidationOb.success) {
            const noteData = dataValidationOb.data;
            const notebook = await Notebook.findById(noteData.notebookID);
            const note = new Note({
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

export const getUnusedNotes = async (req: Request, res: Response) => {
    try {
        const notebookID = req.params['notebookID'];
        if (notebookID) {
            const notebook = await Notebook.findById(notebookID);
            if (notebook) {
                const nbs = notebook.notes.filter(note => !note.previouslyUsed);
                res.json(nbs);
            } else {
                res.sendStatus(400);
            }

        } else {
            res.sendStatus(400);
        }
    } catch (err) {
        if (err instanceof mongoose.Error.CastError) {
            res.sendStatus(400);
            return;
        }
        res.status(500).send();
        console.error(
            `${new Date().toTimeString()} ${new Date().toDateString()}`,
            err
        );
    }
}

export const getTodaysNote = async (req: Request, res: Response) => {
    try {
        const notebookID = req.params['notebookID'];
        if (notebookID) {
            const notebook = await Notebook.findById(notebookID);
            if (notebook) {

                const nbs = notebook.notes.filter(note => {
                    const now = new Date();
                    if (!note.usedDate)
                        return false;
                    const nextDate = new Date(note.usedDate);
                    nextDate.setDate(nextDate.getDate() + note.interval);
                    return (
                        now.getUTCFullYear() >= nextDate.getUTCFullYear() &&
                        now.getUTCMonth() >= nextDate.getUTCMonth() &&
                        now.getUTCDate() >= nextDate.getUTCDate()
                    )
                });
                res.json(nbs);
            } else {
                res.sendStatus(400);
            }

        } else {
            res.sendStatus(400);
        }
    } catch (err) {
        if (err instanceof mongoose.Error.CastError) {
            res.sendStatus(400);
            return;
        }
        res.status(500).send();
        console.error(
            `${new Date().toTimeString()} ${new Date().toDateString()}`,
            err
        );
    }
}

const iterateNoteSchema = z.object({
    notebookID: z.string().nonempty(),
    noteID: z.string().nonempty(),
    quality: z.coerce.number().max(5).min(0)
})

export const iterateNote = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const dataValidationOb = iterateNoteSchema.safeParse(data);
        if (dataValidationOb.success) {
            const iterateData = dataValidationOb.data;
            const notebook = await Notebook.findById(iterateData.notebookID);
            if (notebook) {
                const note = notebook.notes.find(note => note.id == iterateData.noteID);
                if (note) {
                    // The standard SM-2 algorithm
                    if (iterateData.quality >= 3) {
                        if (note.repetition <= 0) {
                            note.interval = 1;
                        } else if (note.repetition == 1) {
                            note.interval = 6;
                        } else {
                            note.interval = Math.round(note.interval * note.easeFactor);
                        }
                        note.repetition++;
                        note.easeFactor = note.easeFactor + (0.1 - (5 - iterateData.quality) * (0.08 + (5 - iterateData.quality) * 0.02));
                    } else {
                        note.repetition = 0;
                        note.interval = 1;
                    }
                    if (note.easeFactor < 1.3)
                        note.easeFactor = 1.3;
                    note.usedDate = new Date();
                    await note.save();
                    await notebook.save();
                    res.sendStatus(200);
                } else {
                    res.sendStatus(400);
                }
            } else {
                res.sendStatus(400);
            }

        } else {
            res.status(400).json(dataValidationOb.error);
        }
    } catch (err) {
        if (err instanceof mongoose.Error.CastError) {
            res.sendStatus(400);
            return;
        }
        res.status(500).send();
        console.error(
            `${new Date().toTimeString()} ${new Date().toDateString()}`,
            err
        );
    }
}