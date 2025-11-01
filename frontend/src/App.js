import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import "./index.css";

function App() {
	const [isSignup, setIsSignup] = useState(false);

	return (
		<div className="app-container">
			{ isSignup ? (
				<SignupForm switchToLogin={ () => setIsSignup(false) } />
			) : (
				<LoginForm switchToSignup={ () => setIsSignup(true) } />
			) }
		</div>
	);
}

export default App;
