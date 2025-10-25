const fs = require("fs");
const path = require("path");

// Đường dẫn file JSON
const dataPath = path.join(__dirname, "../data/users.json");

// 📌 Lấy danh sách user
exports.getUsers = (req, res) => {
	try {
		const data = fs.readFileSync(dataPath, "utf-8");
		const users = JSON.parse(data);
		res.json(users);
	} catch (err) {
		console.error("Lỗi đọc users.json:", err);
		res.status(500).json({ error: "Không thể đọc dữ liệu người dùng" });
	}
};

// 📌 Thêm user mới
exports.addUser = (req, res) => {
	try {
		const data = fs.readFileSync(dataPath, "utf-8");
		const users = JSON.parse(data);

		const newUser = {
			id: users.length + 1,
			name: req.body.name,
			email: req.body.email
		};

		users.push(newUser);
		fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
		res.status(201).json(newUser);
	} catch (err) {
		console.error("Lỗi ghi users.json:", err);
		res.status(500).json({ error: "Không thể thêm người dùng" });
	}
};
