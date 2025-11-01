import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminUserPage = () => {
	const [users, setUsers] = useState([]);
	const token = localStorage.getItem("jwtToken");

	useEffect(() => {
		axios
			.get("http://localhost:5000/users", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => setUsers(res.data))
			.catch(() => alert("Không có quyền truy cập hoặc chưa đăng nhập"));
	}, [token]);

	const handleDelete = (id) => {
		if (window.confirm("Bạn có chắc chắn muốn xóa user này?")) {
			axios
				.delete(`http://localhost:5000/users/${id}`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then(() => {
					alert("Xóa thành công!");
					setUsers(users.filter((user) => user._id !== id));
				})
				.catch(() => alert("Lỗi xóa user"));
		}
	};

	return (
		<div className="auth-container">
			<h2>Danh sách người dùng</h2>
			<table className="user-table">
				<thead>
					<tr>
						<th>Tên</th>
						<th>Email</th>
						<th>Quyền</th>
						<th>Hành động</th>
					</tr>
				</thead>
				<tbody>
					{ users.map((user) => (
						<tr key={ user._id }>
							<td>{ user.name }</td>
							<td>{ user.email }</td>
							<td>{ user.role }</td>
							<td>
								<button onClick={ () => handleDelete(user._id) }>Xóa</button>
							</td>
						</tr>
					)) }
				</tbody>
			</table>
		</div>
	);
};

export default AdminUserPage;
