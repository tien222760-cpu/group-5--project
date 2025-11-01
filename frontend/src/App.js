
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ProfilePage from "./components/ProfilePage";
import AdminUserPage from "./components/AdminUserPage";

function App() {
	return (
		<Router>
			<div className="app-container">
				<Routes>
					<Route path="/" element={ <LoginForm /> } />
					<Route path="/signup" element={ <SignupForm /> } />
					<Route path="/profile" element={ <ProfilePage /> } />
					<Route path="/admin/users" element={ <AdminUserPage /> } />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
