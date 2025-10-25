const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./router/users");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Kết nối MongoDB Atlas
mongoose
	.connect("mongodb+srv://nguyen221598_db_user:hanhnguyen%4004@cluster0.dv9qyaq.mongodb.net/group5DB")
	.then(() => console.log("✅ Đã kết nối MongoDB Atlas"))
	.catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err))
	.then(() => console.log("✅ Đã kết nối MongoDB Atlas"))
	.catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// Routes
app.use("/users", userRoutes);

// Test route
app.get("/", (req, res) => res.send("Welcome to User API (MongoDB Connected)"));

app.listen(PORT, () => console.log(`Server đang chạy tại http://localhost:${PORT}`));
