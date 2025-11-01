const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { signup, login, logout } = require("../controllers/authController");
const { getProfile, updateProfile } = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


// GET Users (Admin only)
router.get("/", authMiddleware, roleMiddleware("Admin"), userController.getUsers);

// DELETE User (Admin only)
router.delete("/:id", authMiddleware, roleMiddleware("Admin"), userController.deleteUser);

// ===== AUTH routes =====
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// ===== PROFILE routes =====
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

// ===== USER CRUD (Admin) =====
router.get("/", userController.getUsers);
router.post("/", userController.addUser);

router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
