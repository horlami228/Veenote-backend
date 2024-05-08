import mongoose from './engine/dataBase.js';
import { Document, Schema, Model} from 'mongoose';

// Schema for folders
interface Vfolder extends Document {
    folderName: string;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    isRoot: boolean;
}

const folderSchema: Schema = new Schema<Vfolder>({
    folderName: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    isRoot: { type: Boolean }
}, {
    timestamps: true // This adds createdAt and updatedAt fields automatically
});

const Folder: Model<Vfolder> = mongoose.model<Vfolder>("Folder", folderSchema, "folders_collection");

export default Folder;
