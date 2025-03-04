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
            if (!notebook) {
                res.sendStatus(400);
                return;
            }
            await Note.create({
                title: noteData.title,
                noteBlocks: noteData.noteBlocks,
                noteId: noteData.notebookID,
                userId: req.user?.id
            });
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
                const nbs = await Note.find({ previouslyUsed: false, userId: req.user?.id, noteId: notebook.id as string }).limit(10);
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
                const nbs = (await Note.find({ previouslyUsed: false, userId: req.user?.id, noteId: notebook.id as string })).filter(note => {
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
                })
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
                const note = await Note.findById(iterateData.noteID)
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
                    note.previouslyUsed = true;
                    note.usedDate = new Date();
                    await note.save();
                    const currentDate = new Date();
                    if (notebook.lastStreak) {
                        const diffInDays = currentDate.getUTCDate() - notebook.lastStreak.getUTCDate();
                        if (diffInDays > 1 ||
                            currentDate.getMonth() !== notebook.lastStreak.getMonth() ||
                            currentDate.getFullYear() !== notebook.lastStreak.getFullYear() || !notebook.streakStart) {
                            notebook.streakStart = currentDate;
                        }
                    }
                    notebook.lastStreak = currentDate;
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

const noteBlockSchema = z.object({
    type: z.enum(["word", "description", "image", "audio"]),
    content: z.string().min(1, "Content cannot be empty"),
    sequenceNumber: z.number().int().gte(0, 'Must be a natural number'),
    answer: z.boolean()
});

const updateNoteSchema = z.object({
    title: z.string().optional(),
    noteBlocks: z.array(noteBlockSchema).optional(),
    noteId: z.string().nonempty()
});


export const updateNote = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const dataValidationOb = await updateNoteSchema.safeParseAsync(data);
        if (dataValidationOb.success) {
            const { title, noteBlocks, noteId } = dataValidationOb.data;
            const note = await Note.findOne({ _id: noteId, userId: req.user?.id });
            if (note) {
                if (title) {
                    note.title = title;
                }

                if (noteBlocks && Array.isArray(noteBlocks)) {
                    //@ts-ignore
                    note.noteBlocks = noteBlocks;
                }

                await note.save();
                res.sendStatus(204);
            } else {
                res.sendStatus(400);
            }
        } else {
            res.status(400).json(dataValidationOb.error);
        }
    } catch (err) {
        res.sendStatus(500);
        console.error(
            `${new Date().toTimeString()} ${new Date().toDateString()}`,
            err
        );
    }
}

export const getNoteById = async (req: Request, res: Response) => {
    try {
        const notebookId = req.params['notebookId'];
        const noteId = req.params['noteId'];

        const note = await Note.findOne({_id: noteId, noteId: notebookId, userId: req.user?.id }).lean();

        if (note)
            res.json(note);
        else
            res.sendStatus(400);
    } catch (err) {
        res.sendStatus(500);
        console.error(
            `${new Date().toTimeString()} ${new Date().toDateString()}`,
            err
        )
    }
}

const pageLimit = 15;

export const getNotes = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.params['page']) || 1;
        const notebookId = req.params['notebookId'];

        const notes = await Note.find({ userId: req.user?.id, noteId: notebookId })
            .skip((page - 1) * pageLimit)
            .limit(pageLimit)
            .sort({ createdAt: -1 }).lean();
        res.json(notes);
    } catch (err) {
        res.sendStatus(500);
        console.error(
            `${new Date().toTimeString()} ${new Date().toDateString()}`,
            err
        );
    }
}