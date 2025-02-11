import { Document, Model, Schema, Types, model } from "mongoose";
import { INote, NoteSchema } from "./Note";

interface INotebook extends Document {
  title: string;
  notes: INote[];
  user: Types.ObjectId;
  streak: number;
}

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
  streak: {
    type: Number,
    deafult: 0
  }
});

const Notebook: Model<INotebook> = model("Notebook", NoteBookSchema);

export default Notebook;
