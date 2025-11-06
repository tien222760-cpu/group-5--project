import React, { useState } from "react";
import axios from "axios";
import "./style.css";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		axios
			.post("http://localhost:5000/users/login", { email, password })
			.then((res) => {
				localStorage.setItem("jwtToken", res.data.token);
				window.location = "/profile";
			})
			.catch(() => alert("Đăng nhập thất bại!"));
	};

	return (
		<div className="auth-container">
			<h2>Đăng nhập</h2>
			<form onSubmit={ handleSubmit } className="auth-form">
				<input
					type="email"
					placeholder="Nhập email"
					value={ email }
					onChange={ (e) => setEmail(e.target.value) }
					required
				/>
				<input
					type="password"
					placeholder="Nhập mật khẩu"
					value={ password }
					onChange={ (e) => setPassword(e.target.value) }
					required
				/>

				<button type="submit">Đăng nhập</button>
			</form>

			<div style={ { marginTop: "15px", textAlign: "center", display: "block" } }>
				<a href="/forgot-password">Quên mật khẩu?</a>
				<a href="/signup">Tạo tài khoản?</a>
			</div>
		</div>
	);
};

export default Login;
