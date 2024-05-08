// This module is for authentication

import { Request, Response, NextFunction } from "express";
import User from "../../model/userModel.js";
import { comparePassword } from "../../utilities/passwordHashing.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load the JWT secret key from the .env file
dotenv.config({ path: "./dist/src/config/.env"});

const secretKey = process.env.JWT_SECRET_KEY as string; // Secret key for JWT

// Define the 'login' controller function as an asynchronous function to handle POST requests for user login.
export const login = async (req: Request, res: Response) => {
    try {
        // Validates the incoming request to ensure it contains a body with JSON data.
        if (Object.keys(req.body).length === 0) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
        } else if (!("userNameOrEmail" in req.body)) {
        // Responds with a 400 Bad Request error if the 'email' field is missing in the request body.
        return res.status(400).json({ Error: "Missing Email or UserName" });
        } else if (!("password" in req.body)) {
        // Responds with a 400 Bad Request error if the 'password' field is missing in the request body.
        return res.status(400).json({ Error: "Missing Password" });
        }
    
        // Extracts the email/userName and password from the request body.
        const { userNameOrEmail, password } = req.body;
    
        // Find the user with the provided email in the MongoDB database.
        const user = await User.findOne({ $or: [{ email: userNameOrEmail }, { userName: userNameOrEmail }]});
    
        // Respond with a 401 Unauthorized error if the user is not found in the database.
        if (!user) {
        return res.status(401).json({ Error: "Authenication failed" });
        }
    
        // Compare the provided password with the hashed password stored in the database.
        const isMatch = await comparePassword(password, user.password);
    
        // Respond with a 401 Unauthorized error if the passwords do not match.
        if (!isMatch) {
        return res.status(401).json({ Error: "Authentication failed" });
        }
    
        // Respond with a 200 OK status and the jwt token if the login is successful.
        const jwtToken = jwt.sign({ id: user._id, userName: user.userName }, secretKey, {expiresIn: "1h"});
        return res.status(200).json({ message: "User logged in successfully", token: jwtToken });

    } catch (error) {
        // Catches any errors that occur during the execution of the try block.
        if (error instanceof Error) {
        // Responds with a 500 Internal Server Error status and the error details if an exception occurs.
        res.status(500).json({ message: error.message });
        }
    }
};



export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // Extract token from cookies
    const token = req.cookies['token'];

    if (!token) {
        return res.status(403).json({ Error: "Access Denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        (req as Request & { user: any }).user = decoded;
        next();
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            res.status(400).json({ Error: error.message });
        }
    }
};


// Define the 'logout' controller function to handle POST requests for user logout.
export const logout = (req: Request, res: Response) => {
    // Respond with a 200 OK status and a success message when the user logs out.
    res.status(200).json({ message: "User logged out successfully" });
};
