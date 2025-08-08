import React, { useEffect, useState } from "react"; 
import { Settings, Calendar, RotateCcw } from "lucide-react";
import "./resetPeriod.css"; 
export function ResetPeriod(){
  const [resetPeriod, setResetPeriod] = useState("monthly");
  const [lastResetDate, setLastResetDate] = useState(null);

  // Fetch current cards and use the first one to get resetPeriod + last_reset
  useEffect(() => {
    const fetchResetInfo = async () => {
      try {
        const res = await fetch("/api/user_cards", { credentials: "include" });
        const data = await res.json();
        const cards = data.cards;
        if (cards.length > 0) {
          setResetPeriod(cards[0].reset_period);
          setLastResetDate(cards[0].last_reset);
        }
      } catch (err) {
        console.error("Failed to fetch reset info", err);
      }
    };

    fetchResetInfo();
  }, []);

  const onResetPeriodChange = async (period) => {
    if (period === resetPeriod) return;
    try {
      const res = await fetch("/api/update_reset_period", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ resetPeriod: period }),
      });
      if (res.ok) {
        setResetPeriod(period);
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update reset period.");
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const getNextResetDate = () => {
    if (!lastResetDate) return "-";
    const parsed = Date.parse(lastResetDate);
    if (isNaN(parsed)) return "-"; // ✅ Return placeholder if format is wrong

    const date = new Date(parsed);
    if (resetPeriod === "monthly") {
      date.setMonth(date.getMonth() + 1);
    } else {
      date.setFullYear(date.getFullYear() + 1);
    }
    return date.toISOString().split("T")[0];
  };
  return (
    <div className="reset-settings-card">
      <div className="reset-settings-header">
        <h3 className="reset-settings-title">
          <Settings className="reset-settings-icon" />
          Spending Reset Settings
        </h3>
      </div>
      <div className="reset-settings-content">
        <div className="reset-settings-row">
          <div className="reset-settings-info">
            <label className="reset-settings-label">Reset Period:</label>
            <p className="reset-settings-description">
              Choose how often your <strong>spending</strong> amounts should reset across all cards
            </p>
          </div>
          <div className="reset-period-selector">
            <button
              className={`reset-option ${resetPeriod === "monthly" ? "active" : ""}`}
              onClick={() => onResetPeriodChange("monthly")}
            >
              <Calendar className="reset-option-icon" />
              Monthly
            </button>
            <button
              className={`reset-option ${resetPeriod === "yearly" ? "active" : ""}`}
              onClick={() => onResetPeriodChange("yearly")}
            >
              <RotateCcw className="reset-option-icon" />
              Yearly
            </button>
          </div>
        </div>
        <div className="reset-info-row">
          <div className="reset-info-item">
            <span className="reset-info-label">Current Period:</span>
            <span className={`reset-badge ${resetPeriod}`}>{resetPeriod === "monthly" ? "Monthly" : "Yearly"}</span>
          </div>
          <div className="reset-info-item">
            <span className="reset-info-label">Next Reset:</span>
            <span className="reset-info-value">{getNextResetDate()}</span>
          </div>
          {lastResetDate && (
            <div className="reset-info-item">
              <span className="reset-info-label">Last Reset:</span>
              <span className="reset-info-value">{lastResetDate}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

