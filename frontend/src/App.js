
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ProfilePage from "./components/ProfilePage";
import AdminUserPage from "./components/AdminUserPage";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
	return (
		<Router>
			<div className="app-container">
				<Routes>
					<Route path="/" element={ <LoginForm /> } />
					<Route path="/signup" element={ <SignupForm /> } />
					<Route path="/admin/users" element={ <AdminUserPage /> } />
					<Route path="/forgot-password" element={ <ForgotPassword /> } />
					<Route path="/reset-password/:token" element={ <ResetPassword /> } />
					<Route path="/profile" element={ <ProfilePage /> } />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
