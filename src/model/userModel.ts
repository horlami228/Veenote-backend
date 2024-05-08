import mongoose from './engine/dataBase.js';
import { Document, Schema, Model} from 'mongoose';

// user model schema

interface Vuser extends Document {
    userName: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema = new Schema<Vuser> ({
    userName: {type: String, required: [true, "userName is required"], unique: true},
    email: {type: String, required: [true, "email is required"], unique: true},
    password: {type: String, required: [true, "password is required"]},
}, {
    timestamps: true // This adds createdAt and updatedAt fields automatically
});

const User: Model<Vuser> = mongoose.model<Vuser>("User", userSchema, "users_collection");

export default User;
