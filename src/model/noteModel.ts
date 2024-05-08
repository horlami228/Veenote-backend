import mongoose from './engine/dataBase.js';
import { Document, Schema, Model} from 'mongoose';

// Note schema definitions

interface Vnote extends Document {
    fileName: string;
    title: string;
    content: string;
    folderId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const noteSchema: Schema = new Schema<Vnote>({
    fileName: {type: String, unique: true},
    content: {type: String, required: true},
    userId: {type: Schema.Types.ObjectId, ref: "User"},
    folderId: {type: Schema.Types.ObjectId, ref: "Folder"},
}, {
    timestamps: true // This adds createdAt and updatedAt fields automatically
});

const Note: Model<Vnote> = mongoose.model<Vnote>("Note", noteSchema, "notes_collection");

export default Note;
