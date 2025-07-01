import { useState } from "react";

const UserForm = ({existingUser={}, updateCallBack}) => {
    const [fullName, setFullName] = useState(existingUser.fullName || "")
    const [usrName, setUsrName] = useState(existingUser.usrName || "")
    const [email, setEmail] = useState(existingUser.email || "")

    const updating = Object.entries(existingUser).length !== 0
    const onSubmit = async (e) =>{
        e.preventDefault()

        const data = {
            fullName,
            usrName,
            email,
        }
        const url = 'http://127.0.0.1:5002/' + (updating ? `update_user/${existingUser.id}`: "create_users")
        const options = { 
            method: updating ? "PATCH": "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data),
        }
        const response = await fetch (url, options)
        if (response.status!== 201 && response !== 200){
            const data = await response.json()
            alert(data.message)
        } else{
            updateCallBack()
        }
    }
    return <form onSubmit={onSubmit}>
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
            type="text" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            />
        </div>
        <button type="submit">{updating ? "Update": "Create"}</button>
    </form>
}

export default UserForm