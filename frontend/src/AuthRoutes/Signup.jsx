import React, {useState} from "react";
import "./Auth.css"
const Signup = ({onSignupClick}) => {
    const [fullName, setFullName] = useState("")
    const [usrName, setUsrName] = useState("")
    const [email, setEmail] = useState("")
    const onSubmit = async (e) => {
        e.preventDefault()
        // Clear any previous session
        await fetch("/api/logout", { method: "POST", credentials: "include" });

        const data = {
            fullName,
            usrName,
            email,
        }
        const url = '/api/sign_up'
        const options = {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: 'include'
        }
        const response = await fetch(url, options)
        if (response.status !== 201 && response.status !== 200){
            const data = await response.json()
            alert(data.message)
        } else {
            onSignupClick()
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