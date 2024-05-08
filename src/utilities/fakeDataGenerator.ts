import casual from "casual";
import mongoose  from "mongoose";
import dateTimeGenerator from "./dateTimeGenerator.js";

const no_name = `default-${dateTimeGenerator()}`;

export function generateNote(folderId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) {
  return {
    fileName: casual.title, // Use casual.title for filenames
    content: casual.sentences(2),
    userId:  userId,// Generate random content sentences
    folderId: folderId,
  };
}

// Path: backend_veenote/src/utilities/fakeDataGenerator.ts
