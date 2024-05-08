// Import necessary modules
import { Router } from 'express'; // Express Router to handle routing
// Import createUser controller
import { createUser, 
    allUsers, 
    userByName, 
    deleteUser, 
    updateUserUserName, 
    UpdateUserPassword, 
    getUserName,
    updateUserEmail }
 from "../controller/userController.js"; // Import createUser controller
import { authMiddleware } from '../controller/auth/authController.js';



// Create a new router instance
const router = Router();

/**
 * Route for creating a new user.
 * POST /user/create
 * This route handles the creation of a new user by utilizing the createUser controller.
 * The actual logic for user creation is encapsulated in the createUser function within the userController.
 */
router.post("/user/create", createUser);

/**
 * Route for getting all users in the system
 * GET /user/get_users
 * The actual logic is handled by the controller function createUSer within the userController
 */
router.get("/user/get_users", allUsers);

/**
 * Route for getting a user by the userName
 * GET /user/get_user/:userName
 * The actual logic is handled by the controller function userByName within userController
 */
router.get("/user/get_user/:userName", userByName);


/**
 * Route for deleting a User
 * Get /user/deleteUser/:userName
 * The actual logic is handled by the controller function deleteUser within the userController
 */
router.delete("/user/delete/", authMiddleware, deleteUser);

/**
 * Route for updating a user
 * PUT /user/update/:userName
 * The actual logic is handled by the controller function updateUser within the userController
 */

router.put("/user/update/username", authMiddleware, updateUserUserName);

/**
 * Route for updating a user password
 * PUT /user/updatePassword/:userName
 * The actual logic is handled by the controller function UpdateUserPassword within the userController
 */

router.put("/user/update/password", authMiddleware, UpdateUserPassword);

/**
 * Route for retreiving username
 * GET /user/username
 * The actual logic is handled by the controller function getUserName within the userController
 */

router.get("/user/username", authMiddleware, getUserName);

/**
 * Route for updating a user email
 * PUT /user/updateEmail/
 * The actual logic is handled by the controller function updateUserEmail within the userController
 */

router.put("/user/update/email/", authMiddleware, updateUserEmail);

// Export the router for use in other parts of the application
export default router;
