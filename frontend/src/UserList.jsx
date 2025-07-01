import React from "react"

const UserList = ({users, updateUser, updateCallback}) => {
    const onDelete = async (id) =>{
        try{
            const options = {
                method: "DELETE"
            }
            const response = await fetch(`http://127.0.0.1:5002/delete_user/${id}`, options)
            if (response.status === 200){
                updateCallback()
            }else{
                console.error("Failed to delete")
            }
        } catch(error){
            alert(error)        
        }
    }
    return <div>
        <h2>Users</h2>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.fullName}</td>
                        <td>{user.usrName}</td>
                        <td>{user.email}</td>
                        <td>
                            <button onClick={() => updateUser(user)}>Update</button>
                            <button onClickCapture={() => onDelete(user.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}

export default UserList