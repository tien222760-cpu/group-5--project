import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";

const SignupForm = ({ switchToLogin }) => {
	const [formData, setFormData] = useState({ name: "", email: "", password: "" });
	const [message, setMessage] = useState("");

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post("http://localhost:5000/users/signup", formData);
			setMessage(response.data.message);
		} catch (error) {
			setMessage(error.response?.data?.message || "Lỗi trong quá trình đăng ký");
		}
	};

	return (
		<div className="auth-container">
			<h2>Tạo Tài Khoản</h2>
			<form onSubmit={ handleSubmit } className="auth-form">
				<input name="name" placeholder="Họ và tên" onChange={ handleChange } required />
				<input type="email" name="email" placeholder="Email" onChange={ handleChange } required />
				<input type="password" name="password" placeholder="Mật khẩu" onChange={ handleChange } required />
				<button type="submit">Đăng Ký</button>
				<p className="switch-link">
					Đã có tài khoản? <span onClick={ switchToLogin }>Đăng nhập ngay</span>
				</p>
			</form>
			<p className="auth-message">{ message }</p>
		</div>
	);
};

export default SignupForm;
