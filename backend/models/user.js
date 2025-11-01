const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	password: { type: String, required: true },
	role: { type: String, enum: ["User", "Admin"], default: "User" },
	email: { type: String, required: true },
	resetPasswordToken: String,
	resetPasswordExpire: Date
});

module.exports = mongoose.model("User", userSchema);


module.exports = mongoose.model("User", userSchema);

