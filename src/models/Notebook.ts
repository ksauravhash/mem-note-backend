import { Document, Model, Schema, Types, model, now } from "mongoose";
import { INote, NoteSchema } from "./Note";

interface INotebook extends Document {
  title: string;
  notes: INote[];
  user: Types.ObjectId;
  streakStart: Date;
  lastStreak: Date;
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
  streakStart: {
    type: Date,
  },
  lastStreak: {
    type: Date
  }

});

const Notebook: Model<INotebook> = model("Notebook", NoteBookSchema);

export default Notebook;
