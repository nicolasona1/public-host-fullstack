import React, {useState} from "react";

const Login = ({onLoginSuccess}) => {
    const [usrName, setUsrName] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch("http://127.0.0.1:5002/login", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usrName, email }),
                credentials:"include",
            })
            const data = await response.json();
            
            if (response.ok) {
                // Login successful
                onLoginSuccess(data.user);
            } else {
                // Login failed
                setError(data.message || "Login failed");
            }
        } catch (err){
            console.error("Login error", err)
            setError("Something went wrong. Try again.");
        }
    }
    return (
        <div className="login-container">
          <h2>Log In</h2>
          <p>Already have an account? Log in below.</p>
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
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    )
}

export default Login;