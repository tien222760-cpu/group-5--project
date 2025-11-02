const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

exports.signup = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		const existUser = await User.findOne({ email });
		if (existUser) return res.status(400).json({ message: "Vui lòng sử dụng email khác" });

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({ name, email, password: hashedPassword });
		res.status(201).json({ message: "Tạo người dùng thành công", user });
	} catch (err) {
		res.status(500).json({ message: "Lỗi server" });
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ message: "Email hoặc mật khẩu không hợp lệ" });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(400).json({ message: "Email hoặc mật khẩu không hợp lệ" });

		const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
		res.json({ message: "Đăng nhập thành công", token });
	} catch (err) {
		res.status(500).json({ message: "Lỗi server" });
	}
};

exports.logout = (req, res) => {
	res.json({ message: "Đăng xuất thành công. Vui lòng xóa token ở phía client." });
};

exports.forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

		// Tạo token reset
		const resetToken = crypto.randomBytes(20).toString("hex");
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
		await user.save();

		// build frontend reset URL (frontend handles the token route)
		const frontendBase = process.env.FRONTEND_URL || "http://localhost:3000";
		const resetURL = `${frontendBase}/reset-password/${resetToken}`;

		// Gửi email (setup transport)
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS
			}
		});

		await transporter.sendMail({
			to: user.email,
			subject: "Đặt lại mật khẩu",
			// prefer an HTML link so user can click through to frontend reset page
			html: `<p>Click vào liên kết bên dưới để đặt lại mật khẩu (hết hạn sau 15 phút):</p>
				   <p><a href="${resetURL}">${resetURL}</a></p>`
		});

		res.json({ message: "Đã gửi email để đặt lại mật khẩu" });
	} catch (err) {
		res.status(500).json({ message: "Lỗi server" });
	}
};
exports.resetPassword = async (req, res) => {
	const { token } = req.params;
	const { password } = req.body;

	try {
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpire: { $gt: Date.now() }
		});

		if (!user) return res.status(400).json({ message: "Token invalid or expired" });

		user.password = await bcrypt.hash(password, 10);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save();
		res.json({ message: "Đặt lại mật khẩu thành công" });
	} catch (err) {
		res.status(500).json({ message: "Lỗi server" });
	}
};
