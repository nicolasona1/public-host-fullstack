import React, { useState } from "react";

const CardForm = ({existingCard={}, updateCallBack}) => {
    const [cardName, setCardName] = useState(existingCard.cardName || '')
    const [budget, setBudget] = useState(existingCard.budget || '')
    const [bank, setBank] = useState(existingCard.bank || '')
    const [spent, setSpent] = useState(existingCard.spent || 0)

    const updating = Object.entries(existingCard).length !== 0
    const onSubmit = async (e) => {
        e.preventDefault()

        const data = {
            cardName,
            budget,
            bank,
            spent,
        }
        const url = 'http://127.0.0.1:5002/' + (updating ? `update_spent/${existingCard.id}`: "add_cards")
        const options = {
            method: updating ? "PATCH": "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        }
        const response = await fetch(url, options)
        if (response.status === 200 || response.status === 201){
            const data = await response.json()
            alert(data.message)
        } else{
            updateCallBack()
        }
    }
    return (
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="cardName">Card Name:</label>
                <input
                type="text"
                id="cardName"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
                />
            </div>
            <div>
                <label htmlFor="bank">Bank Issuer:</label>
                <input
                type="text"
                id="bank"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                required
                />
            </div>
            <div>
                <label htmlFor="budget">Budget:</label>
                <input
                type="text"
                id="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
                />
            </div>
            <div>
                <label htmlFor="spent">Spent:</label>
                <input
                type="text"
                id="spent"
                value={spent}
                onChange={(e) => setSpent(e.target.value)}
                />
            </div>
            <button type="submit">{updating ? "Update": "Create"}</button>
        </form>
    )
}

export default CardForm;