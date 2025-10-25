import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
	const [users, setUsers] = useState([]);
	const [formData, setFormData] = useState({ name: "", email: "" });
	const [editId, setEditId] = useState(null);
	const [errors, setErrors] = useState({});
	const [message, setMessage] = useState("");

	// Lấy danh sách user từ backend
	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = () => {
		axios
			.get("http://localhost:3000/users")
			.then((res) => setUsers(res.data))
			.catch((err) => {
				console.error("❌ Lỗi tải dữ liệu:", err);
				showMessage("❌ Không thể tải danh sách người dùng!", true);
			});
	};

	// ✅ Hiển thị thông báo ngắn
	const showMessage = (msg, isError = false) => {
		setMessage(msg);
		setTimeout(() => setMessage(""), 3000);
		if (isError) console.warn(msg);
	};

	// ✅ Validation dữ liệu nhập
	const validate = () => {
		const newErrors = {};
		if (!formData.name.trim()) newErrors.name = "Tên không được để trống!";
		if (!formData.email.trim()) newErrors.email = "Email không được để trống!";
		else if (!/\S+@\S+\.\S+/.test(formData.email))
			newErrors.email = "Email không hợp lệ!";
		setErrors(newErrors);

		// ✅ Trả về true nếu hợp lệ
		return Object.keys(newErrors).length === 0;
	};

	// ✅ Xử lý khi thay đổi input
	const handleChange = (e) => {
		const { name, value } = e.target;

		// Cập nhật giá trị form
		setFormData((prev) => ({ ...prev, [name]: value }));

		// Validation từng trường khi nhập (live validation)
		setErrors((prev) => {
			const newErrors = { ...prev };

			if (name === "name") {
				if (!value.trim()) newErrors.name = "Tên không được để trống!";
				else if (value.trim().length < 3)
					newErrors.name = "Tên phải có ít nhất 3 ký tự!";
				else delete newErrors.name;
			}

			if (name === "email") {
				if (!value.trim()) newErrors.email = "Email không được để trống!";
				else if (!/\S+@\S+\.\S+/.test(value))
					newErrors.email = "Email không hợp lệ!";
				else delete newErrors.email;
			}

			return newErrors;
		});
	};

	// ✅ Gửi form thêm/cập nhật user
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Submit form:", formData);

		if (!validate()) return; // Nếu lỗi, dừng lại

		if (editId) {
			// Cập nhật user
			axios
				.put(`http://localhost:3000/users/${editId}`, formData)
				.then(() => {
					showMessage("✅ Cập nhật thành công!");
					setFormData({ name: "", email: "" });
					setEditId(null);
					fetchUsers();
				})
				.catch(() => showMessage("❌ Lỗi khi cập nhật!", true));
		} else {
			// Thêm mới user
			axios
				.post("http://localhost:3000/users", formData)
				.then(() => {
					showMessage("✅ Thêm người dùng thành công!");
					setFormData({ name: "", email: "" });
					fetchUsers();
				})
				.catch(() => showMessage("❌ Lỗi khi thêm người dùng!", true));
		}
	};

	// ✅ Sửa user
	const handleEdit = (user) => {
		setFormData({ name: user.name, email: user.email });
		setEditId(user._id);
		setErrors({});
	};

	// ✅ Xóa user
	const handleDelete = (id) => {
		if (window.confirm("Bạn có chắc muốn xóa người dùng này không?")) {
			axios
				.delete(`http://localhost:3000/users/${id}`)
				.then(() => {
					showMessage("🗑️ Đã xóa thành công!");
					fetchUsers();
				})
				.catch(() => showMessage("❌ Lỗi khi xóa người dùng!", true));
		}
	};

	// ✅ Reset form
	const resetForm = () => {
		setFormData({ name: "", email: "" });
		setEditId(null);
		setErrors({});
	};

	// Trạng thái form hợp lệ để enable nút submit
	const isFormValid =
		formData.name.trim() !== "" &&
		formData.email.trim() !== "" &&
		Object.keys(errors).length === 0;

	return (
		<div style={ { margin: "40px", fontFamily: "Arial, sans-serif" } }>
			<h2>Quản lý người dùng (Hoạt động 8)</h2>

			{/* Thông báo */ }
			{ message && (
				<div
					style={ {
						background: message.includes("❌") ? "#ffdada" : "#d7ffd7",
						border: "1px solid #ccc",
						borderRadius: "8px",
						padding: "10px",
						marginBottom: "15px",
					} }
				>
					{ message }
				</div>
			) }

			{/* Form */ }
			<form
				onSubmit={ handleSubmit }
				style={ {
					marginBottom: "20px",
					background: "#f8f8f8",
					padding: "20px",
					borderRadius: "10px",
					width: "400px",
				} }
			>
				<div style={ { marginBottom: "10px" } }>
					<label style={ { display: "block", fontWeight: "bold" } }>Tên:</label>
					<input
						type="text"
						name="name"
						value={ formData.name }
						onChange={ handleChange }
						placeholder="Nhập tên"
						style={ { width: "100%", padding: "8px" } }
					/>
					{ errors.name && (
						<small style={ { color: "red" } }>{ errors.name }</small>
					) }
				</div>

				<div style={ { marginBottom: "10px" } }>
					<label style={ { display: "block", fontWeight: "bold" } }>Email:</label>
					<input
						type="email"
						name="email"
						value={ formData.email }
						onChange={ handleChange }
						placeholder="Nhập email"
						style={ { width: "100%", padding: "8px" } }
					/>
					{ errors.email && (
						<small style={ { color: "red" } }>{ errors.email }</small>
					) }
				</div>

				<div>
					<button
						type="submit"
						disabled={ !isFormValid }
						style={ {
							backgroundColor: editId ? "#f0ad4e" : "#007bff",
							color: "white",
							border: "none",
							padding: "8px 16px",
							borderRadius: "6px",
							cursor: "pointer",
						} }
					>
						{ editId ? "Cập nhật" : "Thêm người dùng" }
					</button>
					{ editId && (
						<button
							type="button"
							onClick={ resetForm }
							style={ {
								marginLeft: "10px",
								padding: "8px 16px",
								borderRadius: "6px",
								cursor: "pointer",
							} }
						>
							Hủy
						</button>
					) }
				</div>
			</form>

			{/* Danh sách user */ }
			<table
				border="1"
				cellPadding="10"
				style={ { borderCollapse: "collapse", width: "600px" } }
			>
				<thead style={ { background: "#e8e8e8" } }>
					<tr>
						<th>Tên</th>
						<th>Email</th>
						<th>Hành động</th>
					</tr>
				</thead>
				<tbody>
					{ users.length === 0 ? (
						<tr>
							<td colSpan="3" style={ { textAlign: "center" } }>
								Chưa có người dùng nào
							</td>
						</tr>
					) : (
						users.map((u) => (
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
						))
					) }
				</tbody>
			</table>
		</div>
	);
}

export default App;
