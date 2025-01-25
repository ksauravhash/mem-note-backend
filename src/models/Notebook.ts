import mongoose, { Document, Model, Schema, Types, model } from "mongoose";
import { types } from "util";

type NoteType = "word" | "image" | "audio";

interface INote extends Document {
  type: NoteType;
  content: string;
  sequenceNumber: number;
}

interface INotebook extends Document {
  title: string;
  notes: INote[];
  user: Types.ObjectId;
}

const NoteSchema = new Schema<INote>({
  type: {
    type: String,
    required: true,
    enum: ["word", "image", "audio"],
  },
  content: {
    type: String,
    required: true,
  },
  sequenceNumber: {
    type: Number,
    required: true,
  },
});

const NoteBookSchema = new Schema<INotebook>({
  title: {
    type: String,
    required: true,
  },
  notes: [NoteSchema],
  user: {
    type: Schema.ObjectId,
    required: true,
    ref: 'User'
  },
});

const Notebook: Model<INotebook> = model("Notebook", NoteBookSchema);

export default Notebook;
