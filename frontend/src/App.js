import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
	const [users, setUsers] = useState([]);
	const [formData, setFormData] = useState({ name: "", email: "" });

	// Lấy danh sách user khi mở trang
	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = () => {
		axios
			.get("http://localhost:3000/users")
			.then((res) => setUsers(res.data))
			.catch((err) => console.error("Lỗi khi lấy dữ liệu:", err));
	};

	// Xử lý nhập form
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Gửi form
	const handleSubmit = (e) => {
		e.preventDefault();

		if (!formData.name || !formData.email) {
			alert("Vui lòng nhập đủ thông tin!");
			return;
		}

		axios
			.post("http://localhost:3000/users", formData)
			.then(() => {
				alert("Thêm người dùng thành công!");
				setFormData({ name: "", email: "" }); // reset form
				fetchUsers(); // tải lại danh sách
			})
			.catch((err) => console.error("Lỗi khi thêm user:", err));
	};

	return (
		<div style={ { margin: "40px" } }>
			<h2>Danh sách người dùng</h2>

			{/* Form thêm user */ }
			<form onSubmit={ handleSubmit } style={ { marginBottom: "20px" } }>
				<input
					type="text"
					name="name"
					placeholder="Nhập tên"
					value={ formData.name }
					onChange={ handleChange }
					style={ { marginRight: "10px", padding: "5px" } }
				/>
				<input
					type="email"
					name="email"
					placeholder="Nhập email"
					value={ formData.email }
					onChange={ handleChange }
					style={ { marginRight: "10px", padding: "5px" } }
				/>
				<button type="submit">Thêm người dùng</button>
			</form>

			{/* Bảng danh sách */ }
			<table border="1" cellPadding="10">
				<thead>
					<tr>
						<th>ID</th>
						<th>Tên</th>
						<th>Email</th>
					</tr>
				</thead>
				<tbody>
					{ users.map((u) => (
						<tr key={ u.id }>
							<td>{ u.id }</td>
							<td>{ u.name }</td>
							<td>{ u.email }</td>
						</tr>
					)) }
				</tbody>
			</table>
		</div>
	);
}

export default App;
