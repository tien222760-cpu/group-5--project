const User = require("../models/User");

// 📌 GET /users
exports.getUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (err) {
		console.error("Lỗi lấy dữ liệu:", err);
		res.status(500).json({ message: "Lỗi server" });

	}
};

// 📌 POST /users
exports.addUser = async (req, res) => {
	try {
		const { name, email } = req.body;
		const newUser = new User({ name, email });
		await newUser.save();
		res.status(201).json(newUser);
	} catch (err) {
		console.error("Lỗi thêm người dùng:", err);
		res.status(500).json({ message: "Lỗi server" });
	}
};
exports.updateUser = async (req, res) => {
	try {
		console.log("Body nhận được:", req.body); // 👈 Thêm dòng này
		const { id } = req.params;
		const { name, email } = req.body;

		const updatedUser = await User.findByIdAndUpdate(
			id,
			{ name, email },
			{ new: true }
		);

		if (!updatedUser)
			return res.status(404).json({ message: "Không tìm thấy user" });

		res.json(updatedUser);
	} catch (err) {
		console.error("Lỗi cập nhật:", err);
		res.status(500).json({ message: "Lỗi server" });
	}
};


// 📌 POST /users
exports.addUser = async (req, res) => {
	try {
		const { name, email } = req.body;
		const newUser = new User({ name, email });
		await newUser.save();
		res.status(201).json(newUser);
	} catch (err) {
		console.error("Lỗi thêm người dùng:", err);
		res.status(500).json({ message: "Lỗi server" });
	}
};

// 📌 PUT /users/:id
exports.updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, email } = req.body;

		const updatedUser = await User.findByIdAndUpdate(
			id,
			{ name, email },
			{ new: true }
		);


		if (!updatedUser)
			return res.status(404).json({ message: "Không tìm thấy user" });

		res.json(updatedUser);
	} catch (err) {
		console.error("Lỗi cập nhật:", err);
		res.status(500).json({ message: "Lỗi server" });
	}
};

// 📌 DELETE /users/:id
exports.deleteUser = async (req, res) => {
	try {
		const { id } = req.params;
		const deletedUser = await User.findByIdAndDelete(id);

		if (!deletedUser)
			return res.status(404).json({ message: "Không tìm thấy user" });

		res.json({ message: "Đã xóa người dùng thành công" });
	} catch (err) {
		console.error("Lỗi xóa:", err);
		res.status(500).json({ message: "Lỗi server" });
	}
};
