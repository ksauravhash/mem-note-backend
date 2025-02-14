import { Document, Model, Schema, Types, model } from "mongoose";

type NoteType = "word" | "description" | "image" | "audio"

export interface INoteBlock extends Document {
    type: NoteType;
    content: string;
    sequenceNumber: number;
    answer: boolean;
}

export interface INote extends Document {
    title: string;
    noteBlocks: INoteBlock[];
    repetition: number;
    easeFactor: number;
    interval: number;
    usedDate: Date;
    previouslyUsed: boolean;
}

export const NoteSchema = new Schema<INote>({
    title: {
        type: String,
        required: true,
    },
    noteBlocks: [{
        type: {
            type: String,
            required: true,
            enum: ["word", "description", "image", "audio"],
        },
        content: {
            type: String,
            required: true,
        },
        sequenceNumber: {
            type: Number,
            required: true,
        },
        answer: {
            type: Boolean,
            default: false
        }
    }],
    repetition: {
        type: Number,
        default: 0,
    },
    easeFactor: {
        type: Number,
        default: 2.5,
    },
    interval: {
        type: Number,
        default: 0
    },
    usedDate: Date,
    previouslyUsed: {
        type: Boolean,
        default: false
    }
})

export const Note: Model<INote> = model("Note", NoteSchema);

export default Note;