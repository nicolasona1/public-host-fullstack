import React, {useState} from "react";
import { Edit, Trash2, CreditCard } from "lucide-react"
import StatsCards from "../StatsCards/statsCards";
import { ResetPeriod } from "../resetPeriod/resetPeriod";
import "./Dashboard.css"

const CardDashboard = ({cards, updateCard, updateCallBack, showToast}) => {
    const onDelete = async (id) => {
        try {
            const options = {
                method: "DELETE",
                credentials: "include"
            }
            const response = await fetch(`/api/delete_cards/${id}`, options)
            if (response.status === 200){
                updateCallBack()
                showToast("Card deleted successfully", "success")
            } else {
                console.error("Failed to delete")
            }
        } catch (error) {
            alert(error)
        }
    }
    // Calculate totals from cards
    const totalBudget = cards.reduce((sum, card) => sum + Number(card.budget || 0), 0);
    const totalSpent = cards.reduce((sum, card) => sum + Number(card.spent || 0), 0);
    const totalCards = cards.length;

    return (
        <>
            <div className="dashboard-section">
                <h2 className="page-title">Dashboard</h2>
                <p className="page-description">
                    Add the cards you plan to use, define your monthly budget or spending limits, and track everything in one place.
                </p>
            </div>
            <div className="download-container">
                <button 
                    className="export-button" 
                    onClick={async () => {
                        try {
                            const response = await fetch('/api/download_excel', {
                                method: 'GET',
                                credentials: 'include'
                            });
                            
                            if (response.ok) {
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `SmartSpend_${new Date().toISOString().split('T')[0]}.xlsx`;
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                                document.body.removeChild(a);
                            } else {
                                console.error('Download failed:', response.status);
                                alert('Download failed. Please try again.');
                            }
                        } catch (error) {
                            console.error('Download error:', error);
                            alert('Download failed. Please check your connection and try again.');
                        }
                    }}
                >
                    Download Excel
                </button>
            </div>
            <StatsCards
                totalBudget={totalBudget}
                totalSpent={totalSpent}
                totalCards={totalCards}
            />
            <ResetPeriod/>
            <div className="card-table-container">
                <div className="card-table-header">
                    <div className="card-table-title">
                        <CreditCard className="card-table-icon" />
                        Your Cards
                    </div>
                </div>
                <div className="card-table-content">
                    <table className="table">
                        <thead className="table-header">
                            <tr>
                                <th className="table-header-cell">Card Name</th>
                                <th className="table-header-cell">Bank</th>
                                <th className="table-header-cell">Budget & Spending</th>
                                <th className="table-header-cell">Spent</th>
                                <th className="table-header-cell right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cards.map((card) => (
                                <tr key={card.id} className="table-row">
                                    <td className="table-cell font-medium">{card.cardName}</td>
                                    
                                    <td className="bank-container">
                                        <span className="bank-cell">{card.bank}</span>
                                        </td>
                                    <td className="table-cell">${card.budget}</td>
                                    <td className="table-cell">${card.spent}</td>
                                    <td className="table-cell right">
                                        <div className="actions-container">
                                            <button onClick={() => updateCard(card)} className="action-button">
                                                <Edit className="action-icon" /> Update
                                            </button>
                                            <button onClick={() => onDelete(card.id)} className="action-button delete">
                                                <Trash2 className="action-icon" /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default CardDashboard;