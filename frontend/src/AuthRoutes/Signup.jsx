import React, {useState} from "react";

const Signup = ({onSignupClick}) => {
    const [fullName, setFullName] = useState("")
    const [usrName, setUsrName] = useState("")
    const [email, setEmail] = useState("")
    const onSubmit = async (e) => {
        e.preventDefault()

        const data = {
            fullName,
            usrName,
            email,
        }
        const url = 'http://127.0.0.1:5002/sign_up'
        const options = {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data),
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
            <h2>Sign Up</h2>
            <p>New here? Create a free account and start buidling your dashboard!</p>
        <div>
            <label htmlFor="fullName">Name:</label>
            <input 
            type="text" 
            id="fullName" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)}
            />
        </div>
        <div>
            <label htmlFor="usrName">User Name:</label>
            <input 
            type="text" 
            id="usrName" 
            value={usrName} 
            onChange={(e) => setUsrName(e.target.value)}
            />
        </div>
        <div>
            <label htmlFor="email">Email:</label>
            <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            />
        </div>
        <button type="submit">Create Account</button>
    </form>
    )
}

export default Signup;