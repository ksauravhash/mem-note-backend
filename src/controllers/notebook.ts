import { Request, Response } from "express";
import { z } from "zod";
import Notebook from "../models/Notebook";
import RecentNotebook from "../models/RecentNotebooks";
import { Types } from "mongoose";
import mongoose from "mongoose";
import Note from "../models/Note";
import { Errors, Reader } from 'mynt-handler';

const notebookDataSchema = z.object({
  title: z.string().nonempty(),
});

export const create = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const dataValidationOb = notebookDataSchema.safeParse(data);
    if (dataValidationOb.success) {
      const notebookData = dataValidationOb.data;
      const notebook = await Notebook.create({
        title: notebookData.title,
        user: req.user?.id,
      });
      await notebook.save();
      res.json({ id: notebook._id });
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

export const getRecentNotebooks = async (req: Request, res: Response) => {
  try {
    const recentNotebooks = await RecentNotebook.findOne({
      user: req.user?.id,
    });
    if (recentNotebooks) {
      const sortedNotebooks = recentNotebooks.notebooks.sort(
        (a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime()
      );
      const notebookIds = sortedNotebooks.map((item) => item.id.toString());
      const notebooks = await Notebook.find({
        _id: { $in: notebookIds },
      }).lean();
      const sortedResults = notebookIds.map((id) =>
        notebooks.find((notebook) => notebook._id.toString() === id)
      );
      if (sortedResults) {
        const result = sortedResults.map((item) => ({
          title: item?.title,
          id: item?._id,
        }));
        res.json(
          result
        );
      } else res.json([]);

    } else {
      await RecentNotebook.create({ user: req.user?.id });
      res.json([]);
    }
  } catch (err) {
    res.status(500).send();
    console.error(
      `${new Date().toTimeString()} ${new Date().toDateString()}`,
      err
    );
  }
};

const notebookIDSchema = z.object({
  id: z.string().nonempty(),
});

export const getNotebook = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const dataValidationOb = notebookIDSchema.safeParse(data);
    if (dataValidationOb.success) {
      const notebookID = dataValidationOb.data.id;
      const notebook = await Notebook.findOne({
        user: req.user?.id,
        _id: notebookID,
      });
      // For adding the found notebook to the recent notebook collection
      let recent = await RecentNotebook.find({ user: req.user?.id });
      if (recent.length == 0) {
        const recNB = await RecentNotebook.create({ user: req.user?.id });

        recNB.notebooks.push({
          id: new Types.ObjectId(notebookID),
          lastAccessed: new Date(),
        });
        await recNB.save();
      } else {
        const prevAccessedNb = recent[0].notebooks.filter(nb => nb.id == notebook?.id)
        if (prevAccessedNb.length > 0) {
          await RecentNotebook.updateOne({
            _id: recent[0]._id,
            "notebooks.id": prevAccessedNb[0].id
          }, { $set: { "notebooks.$.lastAccessed": new Date() } })
        } else {

          recent[0].notebooks.push({
            id: new Types.ObjectId(notebookID),
            lastAccessed: new Date(),
          });
          await recent[0].save();
        }
      }
      res.json({ notebook });
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
};

export const getNotbookWithStats = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const dataValidationOb = notebookIDSchema.safeParse(data);
    if (dataValidationOb.success) {
      const notebookID = dataValidationOb.data.id;
      const notebook = await Notebook.findOne({
        user: req.user?.id,
        _id: notebookID,
      });
      if (!notebook) {
        res.status(400);
        return;
      }
      // For adding the found notebook to the recent notebook collection
      let recent = await RecentNotebook.find({ user: req.user?.id });
      if (recent.length == 0) {
        const recNB = await RecentNotebook.create({ user: req.user?.id });

        recNB.notebooks.push({
          id: new Types.ObjectId(notebookID),
          lastAccessed: new Date(),
        });
        await recNB.save();
      } else {
        const prevAccessedNb = recent[0].notebooks.filter(nb => nb.id == notebook?.id)
        if (prevAccessedNb.length > 0) {
          await RecentNotebook.updateOne({
            _id: recent[0]._id,
            "notebooks.id": prevAccessedNb[0].id
          }, { $set: { "notebooks.$.lastAccessed": new Date() } })
        } else {

          recent[0].notebooks.push({
            id: new Types.ObjectId(notebookID),
            lastAccessed: new Date(),
          });
          await recent[0].save();
        }
      }
      const notesCount = await Note.countDocuments({ userId: req.user?.id, noteId: notebook.id });
      const usedNotesCount = await Note.countDocuments({ userId: req.user?.id, noteId: notebook.id, previouslyUsed: true });

      res.json({ notebook, notesCount, usedNotesCount });
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
};

export const uploadNotebookFile = async (req: Request, res: Response) => {
  try {
    if (!req.file || !req.file.buffer) {
      res.sendStatus(400);
      return;
    }
    const file = await Reader.readMyntFileFromBufferV2(req.file?.buffer);
    const notebook = new Notebook({
      title: file.notebook.title,
      user: req.user?.id
    });
    const notes = file.notebook.notes.map(note => ({ ...note, noteId: notebook._id, userId: req.user?.id }));

    let nb = await RecentNotebook.findOne({ user: req.user?.id });
    if (!nb) {
      nb = new RecentNotebook({ user: req.user?.id });
    }
    nb.notebooks.push({
      id: notebook._id as Types.ObjectId,
      lastAccessed: new Date()
    })
    await Promise.all([Note.insertMany(notes), notebook.save(), nb.save()])
    res.json({ id: notebook._id });

  } catch (err) {
    if (err instanceof Errors.MyntParsingError) {
      res.status(400).json({ error: 'Invalid File.' });
    } else if (err instanceof Errors.MyntFileError) {
      res.status(400).json({ error: 'File is corrupt.' });
    } else
      res.sendStatus(500);
    console.error(
      `${new Date().toTimeString()} ${new Date().toDateString()}`,
      err
    );
  }
}

export const deleteNotebook = async (req: Request, res: Response) => {
  try {
    const notebookId = req.params['notebookId'];
    if (notebookId) {
      await Notebook.findByIdAndDelete(notebookId);
      await Note.deleteMany({ userId: req.user?.id, noteId: notebookId });
      const recentNotebooks = await RecentNotebook.findOne({ user: req.user?.id });
      if (recentNotebooks) {
        const deleteIndex = recentNotebooks.notebooks.findIndex(nb => nb.id.toString() === notebookId);
        if (deleteIndex != -1) {
          recentNotebooks.notebooks.splice(deleteIndex, 1);
          await recentNotebooks.save();
        }
      }
      res.sendStatus(204);
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    res.status(500).send();
    console.error(
      `${new Date().toTimeString()} ${new Date().toDateString()}`,
      err
    );
  }
}
