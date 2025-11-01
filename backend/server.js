const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./router/users");

// load .env into process.env (if .env exists)
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Kết nối MongoDB Atlas
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!mongoUri) {
	console.error(
		"❌ MONGO URI không được cấu hình. Vui lòng đặt MONGO_URI (hoặc MONGODB_URI) trong .env or env vars"
	);
} else {
	mongoose
		// Note: recent MongoDB Node driver (v4+) ignores useNewUrlParser/useUnifiedTopology
		.connect(mongoUri)
		.then(() => console.log("✅ Đã kết nối MongoDB Atlas"))
		.catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));
}

// Routes
app.use("/users", userRoutes);

// Test route
app.get("/", (req, res) => res.send("Welcome to User API (MongoDB Connected)"));

app.listen(PORT, () => console.log(`Server đang chạy tại http://localhost:${PORT}`));