const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const User = require("../models/user");

// Setup multer for Cloudinary
const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: "user_avatars",
		allowed_formats: ["jpg", "png"]
	}
});

const upload = multer({ storage });

exports.uploadAvatar = [
	upload.single("avatar"),
	async (req, res) => {
		try {
			const user = await User.findById(req.user.id);
			user.avatar = req.file.path; // URL từ Cloudinary
			await user.save();
			res.json({ message: "Avatar uploaded", avatar: user.avatar });
		} catch (err) {
			res.status(500).json({ message: "Server error" });
		}
	}
];
// GET /api/users/profile
exports.getProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		if (!user) return res.status(404).json({ message: "không tìm thấy người dùng" });
		res.json(user);
	} catch (err) {
		res.status(500).json({ message: "Lỗi máy chủ" });
	}
};

// PUT /api/users/profile
exports.updateProfile = async (req, res) => {
	try {
		console.log("REQ BODY:", req.body);  // 👈 Thêm dòng này kiểm tra client gửi gì
		console.log("USER FROM TOKEN:", req.user); // 👈 kiểm tra token decode
		const updateData = req.body;
		const user = await User.findByIdAndUpdate(req.user.id, updateData, {
			new: true,
		}).select("-password");
		if (!user) return res.status(404).json({ message: "không tìm thấy người dùng" });
		res.json({ message: "Cập nhật hồ sơ thành công", user });
	} catch (err) {
		res.status(500).json({ message: "Lỗi máy chủ" });
	}
};
