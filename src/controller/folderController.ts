// Importing necessary modules from the 'express' package to handle HTTP requests and responses.
import {Request, Response} from 'express';
// Importing the User model from the userModel.js file, which defines the schema for the user documents in the MongoDB database.
import Folder from '../model/folderModel.js';
import Note from '../model/noteModel.js';
import mongoose from 'mongoose';
import { getModelBy } from '../utilities/dbFunctions.js';

const objectId = mongoose.Types.ObjectId;

interface filterdNotes {
    content: string;
    fileName: string;
    createdAt: string;
    updatedAt: string;
    id: string;
}

// Define the 'createUser' controller function as an asynchronous function to handle POST requests for creating a new user.
export const createFolder = async  (req: Request, res: Response) => {
    
    try {
            // Validates the incoming request to ensure it contains a body with JSON data.
        if (!req.body) {
            // Responds with a 400 Bad Request error if the request body is missing.
            return res.status(400).json({"Error": "Not a valid JSON"});
        } else if (!("folderName" in req.body)) {
            // Responds with a 400 Bad Request error if the 'folderNmae' field is missing in the request body.
            return res.status(400).json({"Error": "Missing folder name"});
        }
        const userId = (req as Request & { user: any }).user.id;
        // Extracts the data from the request body.
        const folderData = {
            folderName: req.body.folderName,
            is_root: false,
            userId: userId
        };
        
        // Initializes a new instance of the User model with the extracted data.
        const new_folder = new Folder(folderData);

        // Saves the new user instance to the MongoDB database and awaits its completion.
        const folder = await new_folder.save();

        // Responds with a 200 OK status and the newly created user data in JSON format.
        res.status(201).json(folder);

    } catch(error) {
        // Catches any errors that occur during the execution of the try block.
        if (error instanceof Error) {
            if (error.message.includes("E11000")) {
                // Responds with a 409 Conflict status if the folder name already exists.
                return res.status(409).json({
                    "Error": "Folder Already Exists",
                    "Details": error.message
                });
            }
            
            // Responds with a 500 Internal Server Error status and the error details if an exception occurs.
            return res.status(500).json({
                "Error": "Error Creating A Folder",
                "Details": error.message
            });
        }
    }
 
};


export const getRootFolder = async (req: Request, res: Response) => {
    // use the 'find' method on the Folder model to find a root folder by the user_id
    // This returns a promise

    const userId = (req as Request & { user: any }).user.id;

    Folder.find({"userId": userId, "isRoot": true})
    .then(folder => {
        if (folder.length === 0) {
            return res.status(404).json({
                "Error": "Folder Not Found"
            });
        }
        
        // if the query is succesfull, send a 200 OK response with the root folder

        res.status(200).json(folder);
    })
    .catch(error => {
        // if there is an error during query, respons with a 500 Internal Server Error

        res.status(500).json({
            "Error": "Getting Folder",
            "Details": error.message
        });
    });
};


// get all folders for a user
export const getAllFolders = async (req: Request, res: Response) =>  {
    // get the user id from the request object
    const userId = (req as Request & { user: any }).user.id;

    // find all folders for the user
    Folder.find({ userId: userId })
    .then((folders) => {
        // if folders are found, send a 200 OK response with the folders
        res.status(200).json({
            message: "Folders retrieved successfully",
            data: folders
        });
    })
    .catch((error) => {
        // if there is an error during query, respond with a 500 Internal Server Error
        res.status(500).json({
            message: "Error retrieving folders",
            details: error.message
        });
    });
};

// get a single folder by folderName
export const getFolder = async (req: Request, res: Response) => {
    // get the folder name from the request parameters
    const folderName = req.params.folderName;

    // find the folder by folderName
    Folder.findOne({ folderName: folderName })
    .then((folder) => {
        if (!folder) {
            return res.status(404).json({
                message: "Folder not found"
            });
        }
        // if the folder is found, send a 200 OK response with the folder
        res.status(200).json({
            message: "Folder retrieved successfully",
            data: folder
        });
    })
    .catch((error) => {
        // if there is an error during query, respond with a 500 Internal Server Error
        res.status(500).json({
            message: "Error retrieving folder",
            details: error.message
        });
    });
};

// delete a folder by folderName
export const deleteFolder = async (req: Request, res: Response) => {
    const folderId = req.params.folderId;

    Folder.findOneAndDelete({ _id: folderId })
    .then((folder) => {
        // if successful, send a 200 OK with the deleted data
        res.status(200).json({ deleted: folder });
    })
    .catch((error) => {
        // if error occurred, respond with 500 Internal Server Error and print out error
        // error message is included in the response
        res.status(500).json({
            message: "Error deleting folder",
            details: error.message
        });
    });
};

// update a folder by folderName
export const updateFolder = async (req: Request, res: Response) => {
    const folderName = req.params.folderName;
    const folderData = req.body;

    Folder.findOneAndUpdate({ folderName: folderName }, folderData, { new: true })
    .then((folder) => {
        if (!folder) {
            return res.status(404).json({
                message: "Folder not found"
            });
        }
        folder.save();
        // if successful, send a 200 OK with the updated data
        res.status(200).json({ updated: folder });
    })
    .catch((error) => {
        // if error occurred, respond with 500 Internal Server Error and print out error
        // error message is included in the response
        res.status(500).json({
            message: "Error updating folder",
            details: error.message
        });
    });
};

// all notes to a folder
export const getNotesForFolder = async (req: Request, res: Response) => {
    // Get all Notes for a folder
    const folderId = req.params.folderId; // retreive folderId from request
    
    if (!folderId) {
        return res.status(400).json({message: "Invalid folderId"});
    }

    Folder.findOne({ _id: folderId })
    .then((folder) => {
        if (folder) {
            Note.find({ folderId: folder._id })
            .sort({ updatedAt: -1 })
            .then((note) => {
                if (note.length === 0) {
                    return res.status(200).json({message: "Folder is empty"});
                }
                
                const filteredNotes: filterdNotes[] = note.map((note: any) => ({
                    fileName: note.fileName,
                    id: note._id,
                    content: note.content,
                    createdAt: note.createdAt,
                    updatedAt: note.updatedAt
                }));
                
                // return all notes in that folder
                res.status(200).json({
                    "folder": {
                        "folderId": folder._id,
                        "folderName": folder.folderName,
                        "isRoot": folder.isRoot,
                        "notes": filteredNotes,
                    }
                });
            })
            .catch(error => {
                if (error instanceof Error) {
                    // error with the query
                    res.status(500).json({
                        message: error.message
                    });
                }
            });
        } else {
            return res.status(404).json({message: "Folder not found"});
        }
    })
    .catch(error => {
        if (error instanceof Error) {
            // error with the query
            res.status(500).json({
                message: error.message
            });
        }
    });
};
