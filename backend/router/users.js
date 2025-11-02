const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { signup, login, logout, forgotPassword, resetPassword } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
	getProfile,
	updateProfile,
	upload,
	uploadAvatarHandler
} = require("../controllers/profileController");

// ===== AUTH routes =====
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Route xem profile
router.get("/profile", authMiddleware, getProfile);

// Route update profile
router.put("/profile", authMiddleware, updateProfile);

// Route upload avatar (sử dụng Multer + handler)
router.post(
	"/upload-avatar",
	authMiddleware,
	upload.single("avatar"),
	uploadAvatarHandler
);
// ===== USER CRUD routes =====
router.get("/", authMiddleware, roleMiddleware("Admin"), userController.getUsers);
router.post("/", authMiddleware, roleMiddleware("Admin"), userController.addUser);
router.put("/:id", authMiddleware, roleMiddleware("Admin"), userController.updateUser);
router.delete("/:id", authMiddleware, roleMiddleware("Admin"), userController.deleteUser);

module.exports = router;