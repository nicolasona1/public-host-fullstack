import React, {useState} from "react";
import "./Auth.css"
const Login = ({onLoginSuccess, onSignupClick}) => {
    const [usrName, setUsrName] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // CHANGE: reset error
        try {
          await logout(); // CHANGE: clear previous session
          const data = await login({ usrName, email }); // CHANGE
          onLoginSuccess(data.user); // CHANGE
        } catch (err) {
          setError(err.message || "Login failed"); // CHANGE
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


