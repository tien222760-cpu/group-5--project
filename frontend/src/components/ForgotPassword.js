import React, { useState } from "react";
import axios from "axios";
import "./style.css";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		axios
			.post("http://localhost:5000/users/forgot-password", { email })
			.then(() => alert("Email khôi phục mật khẩu đã được gửi!"))
			.catch(() => alert("Không thể gửi email. Kiểm tra lại thông tin!"));
	};

	return (
		<div className="auth-container">
			<h2>Quên mật khẩu</h2>
			<form onSubmit={ handleSubmit } className="auth-form">
				<input
					type="email"
					placeholder="Nhập email của bạn"
					value={ email }
					onChange={ (e) => setEmail(e.target.value) }
					required
				/>
				<button type="submit">Gửi email khôi phục</button>
			</form>
		</div>
	);
};

export default ForgotPassword;
