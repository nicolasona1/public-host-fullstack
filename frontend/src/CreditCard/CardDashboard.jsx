import React, {useState} from "react";

const CardDashboard = ({cards, updateCard, updateCallBack}) => {
    const onDelete = async (id) => {
        try {
            const options = {
                method: "DELETE",
                credentials: "include"
            }
            const response = await fetch(`http://127.0.0.1:5002/delete_cards/${id}`, options)
            if (response.status === 200){
                updateCallBack()
            } else {
                console.error("Failed to delete")
            }
        } catch (error) {
            alert(error)
        }
    }
    return (
        <>
        <h2>Dashboard</h2>
        <p>Add the cards you plan to use, define your monthly budget or spending limits, and track everything in one place.</p>
        <div>
        <table>
            <thead>
                <tr>
                    <th>Card Name</th>
                    <th>Bank</th>
                    <th>Budget</th>
                    <th>Spent</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {cards.map((card) => (
                    <tr key={card.id}>
                        <td>{card.cardName}</td>
                        <td>{card.bank}</td>
                        <td>{card.budget}</td>
                        <td>{card.spent}</td>
                        <td>
                            <button onClick={() => updateCard(card)}>Update</button>
                            <button onClick={() => onDelete(card.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
        </>
    )
}

export default CardDashboard;