// src/components/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000';

function ProfilePage() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const [avatar, setAvatar] = useState('');       // State mới lưu URL avatar
	const [uploading, setUploading] = useState(false); // State mới cho biết đang upload

	// Hàm lấy token từ local storage
	const getToken = () => localStorage.getItem("jwtToken");

	// Hàm lấy thông tin profile
	const fetchProfile = async () => {
		setError('');
		try {
			const token = getToken();
			if (!token) {
				setError('Vui lòng đăng nhập để xem thông tin.');
				return;
			}
			const config = {
				headers: { 'Authorization': `Bearer ${token}` }
			};
			const { data } = await axios.get(`${BACKEND_URL}/users/profile`, config);
			setName(data.name);
			setEmail(data.email);
			setAvatar(data.avatar || 'https://i.imgur.com/6VBx3io.png'); // Lấy avatar hoặc dùng ảnh mặc định
		} catch (err) {
			setError(err.response?.data?.message || 'Không thể tải thông tin profile.');
		}
	};

	// Tự động gọi khi component được tải
	useEffect(() => {
		fetchProfile();
	}, []);

	// Hàm xử lý cập nhật thông tin (tên, email, password)
	const handleProfileUpdate = async (e) => {
		e.preventDefault();
		setMessage('');
		setError('');
		try {
			const token = getToken();
			const config = {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				}
			};
			const body = { name, email };
			if (password) { // Chỉ gửi password nếu người dùng nhập
				body.password = password;
			}
			const { data } = await axios.put(`${BACKEND_URL}/users/profile`, body, config);
			setMessage(data.message || 'Cập nhật thông tin thành công!');
			setPassword(''); // Xóa ô password
		} catch (err) {
			setError(err.response?.data?.message || 'Cập nhật thất bại.');
		}
	};

	// --- HOẠT ĐỘNG 4: HÀM XỬ LÝ UPLOAD AVATAR ---
	const handleAvatarUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// Kiểm tra loại file (chỉ cho phép ảnh)
		if (!file.type.startsWith('image/')) {
			alert('Vui lòng chỉ chọn file ảnh.');
			return;
		}

		const formData = new FormData();
		formData.append('avatar', file); // 'avatar' phải khớp với backend

		setUploading(true);
		setMessage('');
		setError('');
		try {
			const token = getToken();
			const config = {
				headers: {
					'Content-Type': 'multipart/form-data', // Quan trọng!
					'Authorization': `Bearer ${token}`
				}
			};

			// Gọi API PUT /users/profile/avatar
			const { data } = await axios.put(`${BACKEND_URL}/users/avatar`, formData, config);

			setAvatar(data.avatarUrl); // Cập nhật ảnh ngay lập tức
			setMessage(data.message); // Hiển thị thông báo thành công
		} catch (err) {
			setError(err.response?.data?.message || 'Upload ảnh thất bại.');
		} finally {
			setUploading(false); // Dừng trạng thái loading
		}
	};
	// -------------------------------------------

	return (
		<div style={ { display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '720px', margin: '0 auto', padding: '20px' } }>
			<h2>Thông tin cá nhân</h2>

			{/* Phần hiển thị và upload Avatar */ }
			<div style={ { marginBottom: '20px' } }>
				<img
					src={ avatar }
					alt="Avatar"
					style={ { width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ccc' } }
				/>
				<div style={ { marginTop: '10px' } }>
					<label htmlFor="avatar-upload" style={ { cursor: 'pointer', background: '#eee', padding: '5px 10px', border: '1px solid #ccc' } }>
						Chọn ảnh mới
					</label>
					<input
						id="avatar-upload"
						type="file"
						accept="image/*" // Chỉ cho chọn file ảnh
						onChange={ handleAvatarUpload }
						style={ { display: 'none' } } // Ẩn input gốc
					/>
					{ uploading && <span style={ { marginLeft: '10px' } }>Đang tải lên...</span> }
				</div>
			</div>

			{/* Form cập nhật thông tin */ }
			<form onSubmit={ handleProfileUpdate }>
				<div>
					<label>Tên:</label>
					<input
						type="text"
						value={ name }
						onChange={ (e) => setName(e.target.value) }
						required
						style={ { marginLeft: '5px', marginBottom: '10px' } }
					/>
				</div>
				<div>
					<label>Email:</label>
					<input
						type="email"
						value={ email }
						onChange={ (e) => setEmail(e.target.value) }
						required
						style={ { marginLeft: '5px', marginBottom: '10px' } }
					/>
				</div>
				<div>
					<label>Mật khẩu mới:</label>
					<input
						type="password"
						placeholder="(Bỏ trống nếu không đổi)"
						value={ password }
						onChange={ (e) => setPassword(e.target.value) }
						style={ { marginLeft: '5px', marginBottom: '10px' } }
					/>
				</div>
				<button type="submit">Lưu thay đổi</button>
			</form>

			{/* Hiển thị thông báo */ }
			{ message && <p style={ { color: 'green' } }>{ message }</p> }
			{ error && <p style={ { color: 'red' } }>{ error }</p> }
		</div>
	);
}

export default ProfilePage;