const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { signup, login, logout, forgotPassword, resetPassword } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const multer = require('multer');
const {
	getProfile,
	updateProfile,
	uploadAvatar
} = require("../controllers/profileController");

const storage = multer.memoryStorage();
// (Tùy chọn) Chỉ cho phép upload file ảnh
const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		// Báo lỗi nếu không phải file ảnh
		cb(new Error('Chỉ chấp nhận file ảnh!'), false);
	}
};
// Tạo middleware upload
const upload = multer({ storage: storage, fileFilter: fileFilter });

// ===== AUTH routes =====
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
// Accept token or email in the URL param; controller handles token/email logic.
router.post("/reset-password/:token", resetPassword);


// Route xem profile
router.get("/profile", authMiddleware, getProfile);

// Route update profile
router.put("/profile", authMiddleware, updateProfile);

router.put('/avatar', authMiddleware, upload.single('avatar'), uploadAvatar);
// ===== USER CRUD routes =====
router.get("/", authMiddleware, roleMiddleware("Admin"), userController.getUsers);
router.post("/", authMiddleware, roleMiddleware("Admin"), userController.addUser);
router.put("/:id", authMiddleware, roleMiddleware("Admin"), userController.updateUser);
router.delete("/:id", authMiddleware, roleMiddleware("Admin"), userController.deleteUser);

module.exports = router;