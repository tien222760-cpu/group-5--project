// Import các thư viện
const express = require('express');
const dotenv = require('dotenv'); 

// Khởi tạo ứng dụng express
const app = express();

// Cấu hình dotenv để đọc file .env
dotenv.config();

// Middleware cho phép express đọc và gửi JSON
app.use(express.json());

// Lấy cổng (PORT) từ file .env, nếu không có thì mặc định là 3000
const PORT = process.env.PORT || 3000;

// Khởi chạy server và lắng nghe ở cổng đã định
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
});