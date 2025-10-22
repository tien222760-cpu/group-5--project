const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa cấu trúc (Schema) cho User
const userSchema = new Schema({
    name: { 
        type: String, 
        required: true // Bắt buộc phải có tên
    },
    email: { 
        type: String, 
        required: true, // Bắt buộc phải có email
        unique: true     // Email này không được trùng
    }
}, {
    timestamps: true, // Tự động thêm 2 trường: createdAt và updatedAt
});

// Biên dịch Schema thành Model
// MongoDB sẽ tự động tạo một collection tên là 'users' (số nhiều, viết thường của 'User')
const User = mongoose.model('User', userSchema);

// Xuất Model ra để các file khác có thể dùng
module.exports = User;