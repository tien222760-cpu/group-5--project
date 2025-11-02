import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./style.css";

const ResetPassword = () => {
	const { token } = useParams();
	const [password, setPassword] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		axios
			.post(`http://localhost:5000/users/reset-password/${token}`, { password })
			.then(() => alert("Đổi mật khẩu thành công!"))
			.catch(() => alert("Token không hợp lệ hoặc đã hết hạn."));
	};

	return (
		<div className="auth-container">
			<h2>Đặt lại mật khẩu</h2>
			<form onSubmit={ handleSubmit } className="auth-form">
				<input
					type="password"
					placeholder="Nhập mật khẩu mới"
					value={ password }
					onChange={ (e) => setPassword(e.target.value) }
					required
				/>
				<button type="submit">Xác nhận</button>
			</form>
		</div>
	);
};

export default ResetPassword;
