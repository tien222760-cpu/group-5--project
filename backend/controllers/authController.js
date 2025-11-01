const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
