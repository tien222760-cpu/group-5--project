import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
	const [users, setUsers] = useState([]);
	const [formData, setFormData] = useState({ name: "", email: "" });
	const [editId, setEditId] = useState(null);

	// Lấy danh sách user
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

	// Gửi form (thêm hoặc cập nhật)
	const handleSubmit = (e) => {
		e.preventDefault();

		if (!formData.name || !formData.email) {
			alert("Vui lòng nhập đủ thông tin!");
			return;
		}

		if (editId) {
			// Cập nhật user
			axios
				.put(`http://localhost:3000/users/${editId}`, formData)
				.then(() => {
					alert("Cập nhật thành công!");
					setFormData({ name: "", email: "" });
					setEditId(null);
					fetchUsers();
				})
				.catch((err) => console.error("Lỗi cập nhật:", err));
		} else {
			// Thêm user mới
			axios
				.post("http://localhost:3000/users", formData)
				.then(() => {
					alert("Thêm thành công!");
					setFormData({ name: "", email: "" });
					fetchUsers();
				})
				.catch((err) => console.error("Lỗi thêm:", err));
		}
	};

	// Xử lý sửa
	const handleEdit = (user) => {
		setFormData({ name: user.name, email: user.email });
		setEditId(user._id);
	};

	// Xử lý xóa
	const handleDelete = (id) => {
		if (window.confirm("Bạn có chắc muốn xóa user này không?")) {
			axios
				.delete(`http://localhost:3000/users/${id}`)
				.then(() => {
					alert("Đã xóa thành công!");
					fetchUsers();
				})
				.catch((err) => console.error("Lỗi xóa:", err));
		}
	};

	return (
		<div style={ { margin: "40px" } }>
			<h2>Quản lý người dùng (CRUD)</h2>

			{/* Form thêm/sửa */ }
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
				<button type="submit">
					{ editId ? "Cập nhật người dùng" : "Thêm người dùng" }
				</button>
				{ editId && (
					<button
						type="button"
						onClick={ () => {
							setEditId(null);
							setFormData({ name: "", email: "" });
						} }
						style={ { marginLeft: "10px" } }
					>
						Hủy
					</button>
				) }
			</form>

			{/* Bảng danh sách */ }
			<table border="1" cellPadding="10">
				<thead>
					<tr>
						<th>Tên</th>
						<th>Email</th>
						<th>Hành động</th>
					</tr>
				</thead>
				<tbody>
					{ users.map((u) => (
						<tr key={ u._id }>
							<td>{ u.name }</td>
							<td>{ u.email }</td>
							<td>
								<button onClick={ () => handleEdit(u) }>Sửa</button>
								<button
									onClick={ () => handleDelete(u._id) }
									style={ { marginLeft: "10px" } }
								>
									Xóa
								</button>
							</td>
						</tr>
					)) }
				</tbody>
			</table>
		</div>
	);
}

export default App;
