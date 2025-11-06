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

		const user = await User.create({ name, email, password: password });
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

		const isMatch = password === user.password;
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

		// Tạo token reset (raw) và lưu dạng hashed trong DB
		const resetToken = crypto.randomBytes(20).toString("hex");
		const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
		user.resetPasswordToken = hashedToken;
		user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
		await user.save();

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

		// dev: log reset token and URL so developer can test without email delivery
		// Only log the raw token in non-production environments
		if (process.env.NODE_ENV !== 'production') {
			console.log("[authController] Generated reset token (raw):", resetToken);
			console.log("[authController] Reset URL:", resetURL);
		} else {
			console.log('[authController] Reset URL created (production)');
		}

		res.json({ message: "Đã gửi email để đặt lại mật khẩu" });
	} catch (err) {
		res.status(500).json({ message: "Lỗi server" });
	}
};
exports.resetPassword = async (req, res) => {
	try {
		// 1. Get the hashed token from URL parameter
		const resetPasswordToken = crypto
			.createHash('sha256')
			.update(req.params.token) // Hash the raw token from the URL
			.digest('hex');

		// 2. Find user by the hashed token and check expiry date
		const user = await User.findOne({
			resetPasswordToken,
			resetPasswordExpire: { $gt: Date.now() },
		});

		// 3. If token is invalid or expired
		if (!user) {
			return res.status(400).json({ message: 'Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn' });
		}

		// Get new password from request body and validate
		const { password } = req.body;
		if (!password || typeof password !== 'string' || password.length < 6) {
			return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		user.password = hashedPassword;
		if (process.env.NODE_ENV !== 'production') {
			console.log('[authController] user.password now type:', typeof user.password, 'len:', (user.password || '').length);
		}
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save();

		res.status(200).json({ success: true, message: 'Đặt lại mật khẩu thành công' });

	} catch (error) {
		console.error("Lỗi resetPassword:", error);
		res.status(500).json({ message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' });
	}
};

