import React, { useState, useEffect } from "react";
import {CreditCard, X} from "lucide-react";
import "./CardForm.css"

const CardForm = ({isOpen, existingCard={}, updateCallBack, onClose, showToast}) => {
    const [cardName, setCardName] = useState(existingCard.cardName || '')
    const [budget, setBudget] = useState(existingCard.budget || '')
    const [bank, setBank] = useState(existingCard.bank || '')
    const [spent, setSpent] = useState(existingCard.spent || '')
    useEffect(() => {
        setCardName(existingCard.cardName || '')
        setBudget(existingCard.budget || '')
        setBank(existingCard.bank || '')
        setSpent(existingCard.spent || '')
    }, [existingCard, isOpen]);
    const updating = Object.entries(existingCard).length !== 0
    const onSubmit = async (e) => {
        e.preventDefault()

        const data = {
            cardName,
            budget,
            bank,
            spent,
        }
        const url = '/api/' + (updating ? `update_spent/${existingCard.id}`: "add_cards")
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
            showToast(data.message, 'success')
            updateCallBack()
        } else {
            const data = await response.json()
            showToast(data.message || 'An error occurred', 'error')
        }        
    }
    const modalTitle = updating ? "Edit Card" : "Add New Card";
    return (
        <>
        <div className={`modal-overlay ${isOpen ? "open" : ""}`}> 
            <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <div className="modal-header">
                    <h2 id="modal-title" className="modal-title">
                        <CreditCard className="card-icon"/>{modalTitle}
                    </h2>
                    <button className="modal-close-button" onClick={onClose} aria-label="Close">
                        <X className="modal-close-icon"/>
                    </button>
                </div>
                <form onSubmit={onSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="cardName" className="form-label">Card Name:</label>
                        <input
                        type="text"
                        id="cardName"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="e.g., Black Card 1"
                        className="form-input"
                        required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bank" className="form-label">Bank Issuer:</label>
                        <input
                        type="text"
                        id="bank"
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                        placeholder="e.g., Chase Bank"
                        className="form-input"
                        required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="budget" className="form-label">Budget:</label>
                        <input
                        type="text"
                        id="budget"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="form-input"
                        placeholder="e.g., 5000"
                        required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="spent" className="form-label">Spent:</label>
                        <input
                        type="text"
                        id="spent"
                        value={spent}
                        onChange={(e) => setSpent(e.target.value)}
                        placeholder="e.g., 0"
                        className="form-input"
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="submit-button">
                            {updating ? "Update": "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}

export default CardForm;