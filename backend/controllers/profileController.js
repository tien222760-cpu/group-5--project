const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const User = require("../models/user");


const uploadAvatar = async (req, res) => {
	try {
		// 1. Check if file exists (Multer puts the file in req.file)
		if (!req.file) {
			return res.status(400).json({ message: 'Vui lòng chọn một file ảnh để tải lên.' });
		}
		const b64 = Buffer.from(req.file.buffer).toString("base64");
		let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

		// 3. Upload image to Cloudinary
		const result = await cloudinary.uploader.upload(dataURI, {
			folder: "group2-project-avatars",
		});

		const user = await User.findById(req.user.id);
		if (!user) {
			// This should rarely happen if 'protect' middleware works
			return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
		}

		user.avatar = result.secure_url; // Use the secure HTTPS URL
		await user.save();

		// 5. Send success response
		res.status(200).json({
			message: 'Tải lên avatar thành công!',
			avatarUrl: result.secure_url,
		});

	} catch (error) {
		console.error("Lỗi upload avatar:", error);
		// Provide more specific error messages if possible
		if (error.message.includes("File size too large")) {
			return res.status(400).json({ message: 'Kích thước file quá lớn.' });
		}
		res.status(500).json({ message: 'Đã xảy ra lỗi server khi tải lên ảnh.' });
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
	uploadAvatar
};