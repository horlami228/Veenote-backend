import {Request, Response} from 'express';
import User from '../model/userModel.js';
import Folder from '../model/folderModel.js';
import Note from '../model/noteModel.js';
import { hashPassword,  comparePassword } from '../utilities/passwordHashing.js';

// Define the 'createUser' controller function as an asynchronous function to handle POST requests for creating a new user.
export const createUser = async  (req: Request, res: Response) => {
    
    try {
            // Validates the incoming request to ensure it contains a body with JSON data.
        if (Object.keys(req.body).length === 0) {
            res.status(400).send({ message: "Content can not be empty!" });
            return;
        } else if (!("userName" in req.body)) {
            // Responds with a 400 Bad Request error if the 'userName' field is missing in the request body.
            return res.status(400).json({"Error": "Missing Username"});
        } else if (!("email" in req.body)) {
            // Responds with a 400 Bad Request error if the 'email' field is missing in the request body.
            return res.status(400).json({"Error": "Missing Email"});
        } else if (!("password" in req.body)) {
            // Responds with a 400 Bad Request error if the 'password' field is missing in the request body.
            return res.status(400).json({"Error": "Missing Password"});
        }

        const password = req.body.password;

        // Hash the password
        req.body.password = await hashPassword(password);

        // Extracts the data from the request body.
        const data = {
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password
        };

        const userExists = await User.findOne({ $or: [{ email: data.email }, { userName: data.userName }] });
        if (userExists) {
            return res.status(400).json({ "Error": "User with the provided email or username already exists" });
        }

        // Initializes a new instance of the User model with the extracted data.
        const new_user = new User(data);

        // Saves the new user instance to the MongoDB database and awaits its completion.
        const user = await new_user.save();

        // Create the root folder for the user
        const folderData = {
            folderName: `${user.userName} Root Folder`,
            isRoot: true,
            userId: user.id
        };

        const new_folder = new Folder(folderData);
        const folder = await new_folder.save();

        // Responds with a 200 OK status and the newly created user data in JSON format.
        res.status(201).json({"User": user, "Folder": folder});

    } catch(error) {
        // Catches any errors that occur during the execution of the try block.
        if (error instanceof Error) {

            if ((error as any).code === 11000) {
                return res.status(409).json({
                  errorCode: 'UserExists',
                  errorMessage: "User with the provided email or username already exists",
                  errorDetails: "A user with the same email or username already exists in the database. Please use a unique email or username.",
                  error: error.message
              });
            }
            // Responds with a 500 Internal Server Error status and the error details if an exception occurs.
            res.status(500).json({
                "Error": "Error Creating A User",
                "Details": error.message
            });
        }
    }
 
};


export const allUsers = (req: Request, res: Response) => {
    // Use the 'find' method on the User model to query the database.
    // This returns a Promise.
    User.find({})
        .then(users => {
            if (users.length === 0) {
                return res.status(404).json({
                    "Error": "No user was found"
                });
            }
            
            // If the query is successful, send a 200 OK response with the users data.
            res.status(200).json(users);
        })
        .catch(error => {
            // If there's an error during the query, respond with a 500 Internal Server Error.
            // The error message is included in the response.
            res.status(500).json({
                "Error": "Getting all Users",
                "Details": error.message
            });
        });
};


export const userByName = (req: Request, res: Response) => {
    // use the 'find' method on the User model to find a user by the userName
    // This returns a promise

    const userName: string | number = req.params.userName;

    User.find({"userName": userName})
    .then(user => {
        if (user.length === 0) {
            return res.status(404).json({
                "Error": "User not found"
            });
        }
        
        // if the query is succesfull, send a 200 OK response with the user data

        res.status(200).json(user);
    })
    .catch(error => {
        // if there is an error during query, respons with a 500 Internal Server Error

        res.status(500).json({
            "Error": "Getting User",
            "Details": error.message
        });
    });
};


export const deleteUser = async (req: Request, res: Response) => {

    const userId = (req as Request & { user: any }).user._id;

    // first delete all notes with the userId
    Note.deleteMany({ userId: userId })
    .then(() => {
        // delete all folder with the userId
        Folder.deleteMany({ userId: userId })
        .then(() => {
            // delete the user with the userId
            User.findOneAndDelete({ _id: userId })
            .then(() => {
                // if succesful send a 204 no content response
                res.status(204).send();
            })
            .catch(error => {
                // if error occured response with 500 Internal Server Error and print out error
                // error message is included in the response
                res.status(500).json({
                    "Error": "Failed to perform delete",
                    "Details": error.message
                });
        })
        .catch(error => {
            // if error occured response with 500 Internal Server Error and print out error
            // error message is included in the response
            res.status(500).json({
                "Error": "Failed to perform delete",
                "Details": error.message
            });
        });
    })
    .catch(error => {
        // if error occured response with 500 Internal Server Error and print out error
        // error message is included in the response
        res.status(500).json({
            "Error": "Failed to perform delete",
            "Details": error.message
        });
    });
    });
};

export const updateUserUserName = async (req: Request, res: Response) => {
    try {
        const userId = (req as Request & { user: any }).user.id;
        const userName = req.body.userName;

        // Check if the username is provided
        if (!userName) {
            return res.status(400).json({
                message: "Username is required",
            });
        }

        // Check if a user with the provided username already exists
        const existingUser = await User.findOne({ userName: userName });
        if (existingUser) {
            return res.status(409).json({
                message: "User with the provided username already exists",
            });
        }

        // Update the user's username
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { $set: { userName: userName } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Respond with success
        res.status(200).json({
            message: "Username updated successfully",
        });

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                message: "Error updating username",
                details: error.message,
            });
        }
    }
};

export const updateUserEmail = async (req: Request, res: Response) => {
    try {
        const userId = (req as Request & { user: any }).user.id;
        const email = req.body.email;

        // Check if the email is provided
        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        // Check if a user with the provided email already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({
                message: "User with the provided email already exists",
            });
        }

        // Update the user's email
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { $set: { email: email } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Respond with success
        res.status(200).json({
            message: "Email updated successfully",
        });

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                message: "Error updating email",
                details: error.message,
            });
        }
    }
};


export const UpdateUserPassword = async (req: Request, res: Response) => {
    try {
        const user = (req as Request & { user: any }).user;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                message: "Old password and new password are required.",
            });
        }

        // Find the user by ID to ensure they exist and to retrieve the current password
        const currentUser = await User.findById(user.id);
        if (!currentUser) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        // Compare the provided old password with the stored password
        const isMatch = await comparePassword(oldPassword, currentUser.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password.",
            });
        }

        // If the passwords match, hash the new password and update it
        const newHashedPassword = await hashPassword(newPassword);
        currentUser.password = newHashedPassword;
        await currentUser.save();

        res.status(200).json({
            message: "Password updated successfully.",
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                message: "Error updating password.",
                details: error.message,
            });
        }
    }
};


export const getUserName = async (req: Request, res: Response) => {
    // get the userId from the request object
    const userId = (req as Request & { user: any }).user.id;

    User.findOne({ _id: userId })
    .then(user => {
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json({
            userName: user.userName,
        });
    })
    .catch(error => {
        res.status(500).json({
            message: "Error getting user",
            details: error.message,
        });
    });
};
