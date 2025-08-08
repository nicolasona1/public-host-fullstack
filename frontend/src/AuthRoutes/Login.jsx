import React, {useState} from "react";
import "./Auth.css"
const Login = ({onLoginSuccess, onSignupClick}) => {
    const [usrName, setUsrName] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            //Clear the previous session
            await fetch('/api/logout', {method: "POST", credentials: "include"})
            
            const response = await fetch("/api/login", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usrName, email }),
                credentials:"include",
            })
            
            if (response.ok) {
                const data = await response.json();
                // Login successful
                onLoginSuccess(data.user);
            } else {
                // Login failed
                try {
                    const data = await response.json();
                    setError(data.message || "Login failed");
                } catch (parseError) {
                    setError("Login failed. Please try again.");
                }
            }
        } catch (err){
            console.error("Login error", err)
            setError("Something went wrong. Try again.");
        }
    }
    return (
        <div className="login-page">
          <div className="login-box">
          <h2 className="login-header">Welcome Back</h2>
          <p className='login-header'>Enter your credentials to access your SmartSpend account.</p>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={usrName}
              onChange={(e) => setUsrName(e.target.value)}
              required
            />
            <br></br>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <br></br>
            <button type="submit">Login</button>
            <p className="signup-redirect">
              Don't have an account?{' '}
              <span className="signup-link" onClick={onSignupClick}>Sign Up</span>
            </p>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
    )
}

export default Login;


