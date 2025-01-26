import mongoose, { Document, Model, Schema, Types, model } from "mongoose";

type NotebookInstance = {
  id: Types.ObjectId;
  lastAccessed: Date;
};

interface IRecentNotebook {
  notebooks: NotebookInstance[];
  user: Types.ObjectId;
}

const RecentNotebookSchema = new Schema<IRecentNotebook>({
  notebooks: {
    type: [
      {
        id: { type: Schema.Types.ObjectId, required: true, ref: 'Notebook' },
        lastAccessed: { type: Date, default: Date.now, required: false },
      },
    ],
    default: [],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const MAX_ITEMS = 20;

RecentNotebookSchema.pre<IRecentNotebook>("save", function (next) {
  if (this.notebooks.length > MAX_ITEMS) {
    // Sort by lastAccessed to ensure the oldest is removed
    this.notebooks.sort(
      (a, b) => a.lastAccessed.getTime() - b.lastAccessed.getTime()
    );
    this.notebooks = this.notebooks.slice(-MAX_ITEMS); // Keep only the newest items
  }
  next();
});

const RecentNotebook = model<IRecentNotebook>(
  "RecentNotebook",
  RecentNotebookSchema
);

export default RecentNotebook;
