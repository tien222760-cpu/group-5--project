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


const uploadAvatarHandler = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		user.avatar = req.file.path; // URL từ Cloudinary
		await user.save();
		res.json({ message: "Cập nhật avatar thành công", avatar: user.avatar });
	} catch (err) {
		res.status(500).json({ message: "Lỗi máy chủ" });
	}
};
// GET /api/users/profile
const getProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		if (!user) return res.status(404).json({ message: "không tìm thấy người dùng" });
		res.json(user);
	} catch (err) {
		res.status(500).json({ message: "Lỗi máy chủ" });
	}
};

// PUT /api/users/profile
const updateProfile = async (req, res) => {
	try {
		console.log("REQ BODY:", req.body);
		console.log("USER FROM TOKEN:", req.user);
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
// Export đúng cách
module.exports = {
	getProfile,
	updateProfile,
	upload,
	uploadAvatarHandler
};