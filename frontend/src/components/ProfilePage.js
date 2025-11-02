import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

const ProfilePage = () => {
	const [profile, setProfile] = useState({});
	const [avatar, setAvatar] = useState(null);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const token = localStorage.getItem("jwtToken");

	// Load profile on mount
	useEffect(() => {
		axios
			.get("http://localhost:5000/users/profile", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				setProfile(res.data);
				setName(res.data.name);
				setEmail(res.data.email);
			})
			.catch(() => alert("Lỗi tải thông tin người dùng"));
	}, [token]);

	// Submit profile updates
	const handleUpdateProfile = (e) => {
		e.preventDefault();
		axios
			.put(
				"http://localhost:5000/users/profile",
				{ name, email },
				{ headers: { Authorization: `Bearer ${token}` } }
			)
			.then(() => alert("Cập nhật thông tin thành công!"))
			.catch(() => alert("Lỗi khi cập nhật thông tin"));
	};

	// Upload avatar
	const handleAvatarUpload = () => {
		const formData = new FormData();
		formData.append("avatar", avatar);

		axios.post("http://localhost:5000/users/upload-avatar", formData, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "multipart/form-data",
			},
		})
			.then((res) => {
				alert("Cập nhật avatar thành công!");
				setProfile({ ...profile, avatar: res.data.avatar });
			})
			.catch(() => alert("Cập nhật avatar thành công!"));
	};

	return (
		<div className="profile-container">
			<h2>Thông tin tài khoản</h2>
			{ profile.avatar && <img src={ profile.avatar } alt="Avatar" className="avatar-img" /> }

			<form onSubmit={ handleUpdateProfile }>
				<input
					type="text"
					value={ name || "" }
					onChange={ (e) => setName(e.target.value) }
					placeholder="Họ và tên"
				/>
				<input
					type="email"
					value={ email || "" }
					onChange={ (e) => setEmail(e.target.value) }
					placeholder="Email"
				/>
				<button type="submit">Cập nhật thông tin</button>
			</form>

			<h3>Ảnh đại diện</h3>
			<input type="file" onChange={ (e) => setAvatar(e.target.files[0]) } />
			<button onClick={ handleAvatarUpload }>Upload Avatar</button>

			<br />
			<a href="/reset-password">Đổi mật khẩu?</a>
		</div>
	);
};

export default ProfilePage;
