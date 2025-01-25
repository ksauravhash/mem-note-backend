import { Document, Model, Schema, Types, model } from "mongoose";

type NoteType = "word" | "image" | "audio";

interface INote extends Document {
  type: NoteType;
  content: string;
  sequenceNumber: number;
}

interface INotebook extends Document {
  title: string;
  notes: INote[];
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
    required: true
  }
});

const NoteBookSchema = new Schema<INotebook>({
  title: {
    type: String,
    required: true,
  },
  notes: Types.DocumentArray<INote>,
});

const Notebook:Model<INotebook> = model('Notebook', NoteBookSchema);

export default Notebook;
