import React, {useState} from "react";
import "./Auth.css"
const Signup = ({onSignupClick}) => {
    const [fullName, setFullName] = useState("")
    const [usrName, setUsrName] = useState("")
    const [email, setEmail] = useState("")
    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            await logout(); // CHANGE: clear any existing session
            await signUp({ fullName, usrName, email }); // CHANGE
            onSignupClick(); // CHANGE
          } catch (err) {
            alert(err.message || "Sign up failed"); // CHANGE
          }
    }
    return(
        <form onSubmit={onSubmit}>
        <div className="signup-page">
            <div className="signup-box">
            <h2 className="signup-header">Sign Up</h2>
            <p className="signup-header">New here? Create a free account and start buidling your dashboard!</p>
        <div>
            <input 
            type="text" 
            id="fullName"
            placeholder="Full Name" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)}
            />
        </div>
        <div>
            <input 
            type="text" 
            id="usrName" 
            placeholder="User name"
            value={usrName} 
            onChange={(e) => setUsrName(e.target.value)}
            />
        </div>
        <div>
            <input 
            type="email" 
            id="email"
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            />
        </div>
        <button type="submit">Create Account</button>
        </div>
        </div>
    </form>
    )
}

export default Signup;