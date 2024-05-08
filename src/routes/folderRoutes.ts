import { Router } from "express";
import { createFolder, getRootFolder, getNotesForFolder, getAllFolders, getFolder, deleteFolder, updateFolder }
 from '../controller/folderController.js';
import { authMiddleware } from "../controller/auth/authController.js";

// Create a new router instance
const router = Router();

/**
 * Route for creating a new folder.
 * POST /folder/create
 * The actual logic for user creation is encapsulated in the createFolder function within the folderController.
 */
router.post('/user/folder/create/new', authMiddleware, createFolder);


/**
 * Route for getting the root folder
 * GET /folder/getRoot
 */

router.get('/user/folder/rootfolder', getRootFolder);

/**
 * Route for getting notes in a folder
* GET /user/folder/<folderId>/notes
 */
router.get('/user/folder/notes/:folderId', authMiddleware, getNotesForFolder);

/**
 * Route for getting all folders
 * GET /user/folder/getAll
 * The actual logic for user creation is encapsulated in the getAllFolders function within the folderController.
 */

router.get('/user/folder/getAll', authMiddleware, getAllFolders);

/**
 * Route for getting a folder
 * GET /user/folder/get/:folderId
 * The actual logic for user creation is encapsulated in the getFolder function within the folderController.
 */

router.get('/user/folder/get/:folderName', authMiddleware, getFolder);

/**
 * Route for updating a folder
 * PUT /user/folder/update/:folderId
 * The actual logic for user creation is encapsulated in the updateFolder function within the folderController.
 */

router.put('/user/folder/update/:folderName', authMiddleware, updateFolder);

/**
 * Route for deleting a folder
 * DELETE /user/folder/delete/:folderId
 * The actual logic for user creation is encapsulated in the deleteFolder function within the folderController.
 */

router.delete('/user/folder/delete/:folderName', authMiddleware, deleteFolder);


export default router;
