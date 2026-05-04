import express from "express"
import authMiddleware from "../../middleware/auth.middleware.js"
import roleMiddleware from "../../middleware/role.middleware.js"
import {
  getProfile,
  getAllUsers,
  deleteUser,
  updateUserRole,
  updateProfile,
  verifyUser,
  suspendUser
} from "./user.controller.js"

const router = express.Router()

/*
Protected routes
*/
router.get("/me", authMiddleware, getProfile);

router.patch("/me/update",
  authMiddleware,
  updateProfile
);

/*
  ADMIN ROUTES (Election Officers)
  - Accessible by Admin AND God
  - Note: Modify your roleMiddleware to accept an array or handle hierarchy
*/
router.get("/", 
  authMiddleware, 
  roleMiddleware(["admin", "god"]), 
  getAllUsers
);

// Only Super Admins should be able to delete users/admins in a voting system
router.delete("/:id", 
  authMiddleware, 
  roleMiddleware(["god"]), 
  deleteUser
);

// Only Super Admin(god) can promote a Voter to an Admin
router.patch("/role/:id", 
  authMiddleware, 
  roleMiddleware(["god"]), 
  updateUserRole
);

//Aprove user to participate in election
router.patch("/:id/verify",
  authMiddleware,
  roleMiddleware(["admin","god"]),
  verifyUser
);

// Suspend user from participating in election
router.patch("/:id/suspend",
  authMiddleware,
  roleMiddleware(["admin","god"]),
  suspendUser
);


export default router