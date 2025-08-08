import { TrendingUp, TrendingDown, DollarSign, CreditCard } from "lucide-react"
import "./statCards.css"

export function StatsCards({ totalCards = 0, totalBudget = 0, totalSpent = 0 }) {
  // Ensure numbers
  const budget = Number(totalBudget) || 0;
  const spent = Number(totalSpent) || 0;
  const remaining = budget - spent;

  // Calculate percentages safely
  const spentPercent = budget > 0 ? ((spent / budget) * 100).toFixed(1) : 0;
  const remainingPercent = budget > 0 ? (100 - spentPercent).toFixed(1) : 100;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-card-header">
          <h3 className="stat-card-title">Total Budget</h3>
          <DollarSign className="stat-card-icon" />
        </div>
        <div className="stat-card-content">
          <p className="stat-card-value">${budget}</p>
          <p className="stat-card-description">Across all cards</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card-header">
          <h3 className="stat-card-title">Total Spent</h3>
          <TrendingUp className="stat-card-icon" />
        </div>
        <div className="stat-card-content">
          <p className="stat-card-value">${spent}</p>
          <p className="stat-card-description">{spentPercent}% of total budget</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card-header">
          <h3 className="stat-card-title">Remaining</h3>
          <TrendingDown className="stat-card-icon" />
        </div>
        <div className="stat-card-content">
          <p className="stat-card-value">${remaining}</p>
          <p className="stat-card-description">{remainingPercent}% remaining</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card-header">
          <h3 className="stat-card-title">Active Cards</h3>
          <CreditCard className="stat-card-icon" />
        </div>
        <div className="stat-card-content">
          <p className="stat-card-value">{totalCards}</p>
          <p className="stat-card-description">Cards being tracked</p>
        </div>
      </div>
    </div>
  )
}
export default StatsCards;