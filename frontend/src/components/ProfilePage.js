import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Auth.css";

const ProfilePage = () => {
	const [user, setUser] = useState({});
	const [editMode, setEditMode] = useState(false);

	const token = localStorage.getItem("jwtToken");

	useEffect(() => {
		axios
			.get("http://localhost:5000/users/profile", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then(console.log(token))
			.then((res) => setUser(res.data))
			.catch(() => alert("Vui lòng đăng nhập"));
	}, [token]);

	const handleSubmit = (e) => {
		e.preventDefault();
		axios
			.put("http://localhost:5000/users/profile", user, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				alert("Cập nhật thành công!");
				setEditMode(false);
				setUser(res.data.user);
			})
			.catch(() => alert("Lỗi cập nhật"));
	};

	return (
		<div className="auth-container">
			<h2>Thông tin cá nhân</h2>

			{ editMode ? (
				<form onSubmit={ handleSubmit } className="auth-form">
					<input
						type="text"
						name="name"
						value={ user.name }
						onChange={ (e) => setUser({ ...user, name: e.target.value }) }
					/>
					<input
						type="text"
						name="email"
						value={ user.email }
						onChange={ (e) => setUser({ ...user, email: e.target.value }) }
					/>
					<button type="submit">Lưu</button>
				</form>
			) : (
				<div>
					<p><strong>Tên:</strong> { user.name }</p>
					<p><strong>Email:</strong> { user.email }</p>
					<button onClick={ () => setEditMode(true) }>Sửa thông tin</button>
				</div>
			) }
		</div>
	);
};

export default ProfilePage;
