import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";

const LoginForm = ({ switchToSignup }) => {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [message, setMessage] = useState("");

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post("http://localhost:5000/users/login", formData);
			localStorage.setItem("jwtToken", response.data.token);
			setMessage("Đăng nhập thành công!");
		} catch (error) {
			setMessage(error.response?.data?.message || "Đăng nhập thất bại");
		}
	};

	return (
		<div className="auth-container">
			<h2>Đăng Nhập</h2>
			<form onSubmit={ handleSubmit } className="auth-form">
				<input type="email" name="email" placeholder="Email" onChange={ handleChange } required />
				<input type="password" name="password" placeholder="Mật khẩu" onChange={ handleChange } required />
				<button type="submit">Đăng Nhập</button>
				<p className="switch-link">
					Bạn chưa có tài khoản? <span onClick={ switchToSignup }>Đăng ký ngay</span>
				</p>
			</form>
			<p className="auth-message">{ message }</p>
		</div>
	);
};

export default LoginForm;
