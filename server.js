const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User.js'); // Import model User từ file kia

const app = express();
app.use(express.json()); // Bắt buộc phải có dòng này để server hiểu được JSON

// --- 1. KẾT NỐI VÀO MONGODB ATLAS ---

const MONGO_URI = "mongodb+srv://nguyen221598_db_user:hanhnguyen%4004@cluster0.dv9qyaq.mongodb.net/group5DB?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("===> KẾT NỐI MONGODB THÀNH CÔNG! <===");
  })
  .catch((err) => {
    console.error("xxx KẾT NỐI MONGODB THẤT BẠI xxx", err);
  });

// --- 2. TẠO API (ROUTES) ---

// API để TẠO user mới (dùng phương thức POST)
app.post('/users', async (req, res) => {
  try {
    // Lấy 'name' và 'email' từ body của request
    const { name, email } = req.body; 
    
    // Tạo một user mới dựa trên Model
    const newUser = new User({ name, email }); 
    
    // Lưu user mới vào database
    await newUser.save(); 
    
    // Trả về thông báo thành công
    res.status(201).json(newUser); 
  } catch (error) {
    // Nếu lỗi (ví dụ: trùng email)
    res.status(400).json({ message: error.message });
  }
});

// API để LẤY TẤT CẢ user (dùng phương thức GET)
app.get('/users', async (req, res) => {
  try {
    // Tìm tất cả tài liệu trong collection 'users'
    const users = await User.find(); 
    
    // Trả về danh sách users
    res.status(200).json(users); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- 3. KHỞI ĐỘNG SERVER ---
const PORT = 3000; // Server sẽ chạy ở cổng 3000
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng http://localhost:${PORT}`);
});