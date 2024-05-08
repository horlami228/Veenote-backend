// Importing necessary modules from the 'express' package to handle HTTP requests and responses.
import {Request, Response} from 'express';
// Importing the User model from the userModel.js file, which defines the schema for the user documents in the MongoDB database.
import Note from '../model/noteModel.js';
import Folder from '../model/folderModel.js';
import getFormattedDateTime from '../utilities/dateTimeGenerator.js';
import User from '../model/userModel.js';

// Define the 'createUser' controller function as an asynchronous function to handle POST requests for creating a new user.
export const createNote = async (req: Request, res: Response) => {
    try {
      // Validate request body
      if (!req.body) {
        return res.status(400).json({
          errorCode: 'Missing body',
          errorMessage: "Request body is required",
          errorDetails: "The request body is missing. Please provide the required data."
      });
      }
  
      // Ensure required fields are present
      if (!req.body.content) {
        return res.status(400).json({
          errorCode: 'MissingContent',
          errorMessage: "content is a required field",
          errorDetails: "The 'content' field is not present in the request body."
        });
      }

       // Get the folderId from the request params
       const folderId = req.params.folderId;
       if (!folderId) {
        return res.status(400).json({
          errorCode: 'MissingFolderId',
          errorMessage: "folderId is a required field",
          errorDetails: "The 'folderId' field is not present in the request body."
        });
      }
  
      // Set default filename if missing
      const fileName = req.body.fileName || `default-${getFormattedDateTime()}`;

      
      // Get the user from the request object
      const me = (req as Request & { user: any }).user;
      console.log(me);

      // Find the associated user
      const user = await User.findOne({ _id: me.id });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // // Find the associated folder
      // const folder = await Folder.findOne({ userId: user._id, isRoot: true});

      // if (!folder) {
      //   return res.status(404).json({ message: "Root folder not found" });
      // }

      // Create the note data object
      const noteData = {
        fileName: fileName,
        content: req.body.content,
        userId: user._id,
        folderId: folderId
      };
  
      // Save the note
      const savedNote = await new Note(noteData).save();
  
      // Send a success response
      res.status(201).json({ message: "Note created successfully", data: savedNote });
    } catch (error) {
      // Handle all errors gracefully
      if (error instanceof Error) {
        // Checking if the error is a MongoDB duplicate key error
        if ((error as any).code === 11000) {
          return res.status(409).json({
            errorCode: 'DuplicateFileName',
            errorMessage: "Note with the provided fileName already exists",
            errorDetails: "A note with the same fileName already exists in the database. Please use a unique fileName."
        });
        }

        // Generic error handling
        res.status(500).json({ message: "Error creating note", details: error.message });
      }
    }
};


// controller to delete a note
export const deleteNote = async (req: Request, res: Response) => {
  // get the node id from the request parameters
  const noteId = req.params.noteId;

  // find the note by email and delete it
  Note.findOneAndDelete({ _id: noteId })
    .then((note) => {
      if (!note) {
        return res.status(404).json({
          message: "Note not found",
        });
      }
      // if the note is successfully deleted, send a 200 OK response
      res.status(200).json({
        message: "Note deleted successfully",
      });
    })
    .catch((error) => {
      // if there is an error during query, respond with a 500 Internal Server Error
      res.status(500).json({
        message: "Error deleting note",
        details: error.message,
      });
    });
};

// controller for updating a note
export const updateNote = async (req: Request, res: Response) => {
  // get the note id from the request parameters
  const noteId = req.params.noteId;
  Note.findOneAndUpdate({ _id: noteId}, req.body, { new: true })
    .then((note) => {
      if (!note) {
        return res.status(404).json({
          message: "Note not found",
        });
      }
      
      note.save();
      
      // if the note is successfully updated, send a 200 OK response
      res.status(200).json({
        message: "Note updated successfully",
      });
    })
    .catch((error) => {
      // if there is an error during query, respond with a 500 Internal Server Error
      res.status(500).json({
        message: "Error updating note",
        details: error.message,
      });
    });
};

// controller to get all notes
export const getAllNotes = async (req: Request, res: Response) =>  {
  // get the user id from the request object
  const userId = (req as Request & { user: any }).user.id;

  // find all notes for the user
  Note.find({ userId: userId })
    .then((notes) => {
      // if notes are found, send a 200 OK response with the notes
      res.status(200).json({
        message: "Notes retrieved successfully",
        data: notes,
      });
    })
    .catch((error) => {
      // if there is an error during query, respond with a 500 Internal Server Error
      res.status(500).json({
        message: "Error retrieving notes",
        details: error.message,
      });
    });
};

// controller to get a single note
export const getNote = async (req: Request, res: Response) => {
  // get the note id from the request parameters
  const noteId = req.params.id;

  // find the note by id
  Note.findOne({ _id: noteId })
    .then((note) => {
      if (!note) {
        return res.status(404).json({
          message: "Note not found",
        });
      }
      // if the note is found, send a 200 OK response with the note
      res.status(200).json({
        message: "Note retrieved successfully",
        data: note,
      });
    })
    .catch((error) => {
      // if there is an error during query, respond with a 500 Internal Server Error
      res.status(500).json({
        message: "Error retrieving note",
        details: error.message,
      });
    });
};

// controller to download a note content
export const downloadNote = async (req: Request, res: Response) => {
  const noteId = req.params.noteId;

  Note.findOne({ _id: noteId })
    .then((note) => {
      if (!note) {
        return res.status(404).json({
          message: "Note not found",
        });
      }

      // Set headers to instruct the browser to download the file
      res.setHeader('Content-Disposition', `attachment; filename=${note.fileName}.txt`);
      res.setHeader('Content-Type', 'text/plain');
      
      // Send the note content as the file content
      res.send(note.content);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving note content",
        details: error.message,
      });
    });
};

