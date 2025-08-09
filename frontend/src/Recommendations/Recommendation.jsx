// import { useState } from "react";
// import { getRecommendation } from "../api";

// export default function RecommendationCard() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");

//   const fetchRec = async () => {
//     setLoading(true);
//     setData(null);
//     try {
//       const d = await getRecommendation();
//       setData(d);
//     } catch (e) {
//       setErr(e?.message || "Failed to load");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="card">
//       <button onClick={fetchRec} disabled={loading}>
//         {loading ? "Analyzing..." : "Get Recommendation"}
//       </button>

//       {err && <p style={{ color: "red" }}>{err}</p>}

//       {data && (
//         <div>
//           <p>
//             <b>Status:</b> {data.grade?.toUpperCase()}
//           </p>
//           <p>{data.summary}</p>

//           {Array.isArray(data.quick_tips) && (
//             <ul>
//               {data.quick_tips.map((t, i) => (
//                 <li key={i}>{t}</li>
//               ))}
//             </ul>
//           )}

//           {Array.isArray(data.suggested_actions) && (
//             <ul>
//               {data.suggested_actions.map((a, i) => (
//                 <li key={i}>
//                   <b>{a.label}:</b> {a.impact}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react"
import { Brain, TrendingUp, AlertCircle, CheckCircle, Lightbulb, Target } from "lucide-react"
import "./Recommendations.css"
import { getRecommendation } from "../api";

export default function RecommendationCard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchRec = async () => {
    setLoading(true)
    setData(null)
    setError("")

    try {
      const recommendation = await getRecommendation()
      setData(recommendation)
    } catch (e) {
      setError(e?.message || "Failed to load recommendation")
    } finally {
      setLoading(false)
    }
  }

  const getGradeConfig = (grade) => {
    switch (grade?.toLowerCase()) {
      case "green":
        return {
          color: "#10b981",
          bgColor: "#d1fae5",
          icon: CheckCircle,
          label: "Excellent",
        }
      case "yellow":
        return {
          color: "#f59e0b",
          bgColor: "#fef3c7",
          icon: AlertCircle,
          label: "Caution",
        }
      case "red":
        return {
          color: "#ef4444",
          bgColor: "#fee2e2",
          icon: AlertCircle,
          label: "Attention Needed",
        }
      default:
        return {
          color: "#6b7280",
          bgColor: "#f3f4f6",
          icon: AlertCircle,
          label: "Unknown",
        }
    }
  }

  const gradeConfig = data ? getGradeConfig(data.grade) : null
  const GradeIcon = gradeConfig?.icon

  return (
    <div className="recommendation-container">
      <div className="recommendation-header">
        <div className="recommendation-title">
          <Brain className="recommendation-icon" />
          <h3>AI Financial Insights</h3>
        </div>
        <button onClick={fetchRec} disabled={loading} className={`recommendation-button ${loading ? "loading" : ""}`}>
          {loading ? (
            <>
              <div className="spinner"></div>
              Analyzing...
            </>
          ) : (
            <>
              <TrendingUp size={16} />
              Get Insights
            </>
          )}
        </button>
      </div>
      <div className="recommendation-description">
        <p>Get quick, AI-powered tips to help you stay on track financially.</p>
      </div>

      {error && (
        <div className="recommendation-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {data && (
        <div className="recommendation-content">
          {/* Status Badge */}
          <div className="status-section">
            <div
              className="status-badge"
              style={{
                backgroundColor: gradeConfig.bgColor,
                color: gradeConfig.color,
              }}
            >
              <GradeIcon size={16} />
              <span className="status-label">{gradeConfig.label}</span>
            </div>
          </div>

          {/* Summary */}
          <div className="summary-section">
            <h4>Summary</h4>
            <p className="summary-text">{data.summary}</p>
          </div>

          {/* Quick Tips */}
          {Array.isArray(data.quick_tips) && data.quick_tips.length > 0 && (
            <div className="tips-section">
              <h4>
                <Lightbulb size={16} />
                Quick Tips
              </h4>
              <ul className="tips-list">
                {data.quick_tips.map((tip, index) => (
                  <li key={index} className="tip-item">
                    <CheckCircle size={14} />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggested Actions */}
          {Array.isArray(data.suggested_actions) && data.suggested_actions.length > 0 && (
            <div className="actions-section">
              <h4>
                <Target size={16} />
                Suggested Actions
              </h4>
              <div className="actions-list">
                {data.suggested_actions.map((action, index) => (
                  <div key={index} className="action-item">
                    <div className="action-label">{action.label}</div>
                    {action.impact && <div className="action-impact">{action.impact}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
