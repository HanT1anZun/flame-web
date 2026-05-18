import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmotionStore } from "../stores/useEmotionStore";
import { EMOTION_LABELS_CN, RISK_COLORS, RISK_LABELS } from "../constants";
import AmbientParticles, { PAGE_AMBIENCE } from "../components/AmbientParticles";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";

const MOOD_DOTS: Record<string, string> = {
  LOW: "🟢",
  MEDIUM: "🟡",
  HIGH: "🟠",
  CRITICAL: "🔴",
};

export default function History() {
  const navigate = useNavigate();
  const { historyRecords, historyTotal, loadHistory } = useEmotionStore();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadHistory(page).finally(() => setLoading(false));
  }, [page]);

  if (loading) {
    return <LoadingSpinner text="正在回顾你的情绪旅程..." />;
  }

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <AmbientParticles config={PAGE_AMBIENCE.history} />
      <div className="page-accent accent-history" />
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "#f0e8ff", margin: "0 0 10px", letterSpacing: 1 }}>
          你的情绪旅程
        </h2>
        <p style={{ fontSize: 15, color: "#c8c0e0", margin: 0, lineHeight: 1.6 }}>
          每一次表达，都是在更靠近自己
        </p>
      </div>

      {historyRecords.length === 0 ? (
        <EmptyState
          message="你的情绪旅程才刚刚开始"
          action={{ text: "写下第一次感受", onClick: () => navigate("/analyze") }}
        />
      ) : (
        <>
          {historyRecords.length > 0 && (
            <div style={{
              textAlign: "center",
              marginBottom: 24,
              padding: "14px 20px",
              borderRadius: 20,
              background: "rgba(160, 210, 210, 0.08)",
              border: "1px solid rgba(160, 210, 210, 0.18)",
              fontSize: 15,
              fontWeight: 600,
              color: "#a0e8e8",
            }}>
              你已经记录了 {historyRecords.length} 次感受，每一次都很珍贵
            </div>
          )}

          {historyRecords.map((record: any, i: number) => {
            const riskColor = RISK_COLORS[record.risk_level] || "#c8b8e8";
            const label = EMOTION_LABELS_CN[record.emotion_type] || record.emotion_type || "未知";
            const moodDot = MOOD_DOTS[record.risk_level] || "⚪";
            return (
              <div
                key={record.id || i}
                className="glass-card interactive reveal-card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 14,
                  cursor: "pointer",
                  animationDelay: `${i * 0.05}s`,
                  background: "rgba(35, 25, 55, 0.85)",
                  border: "1px solid rgba(200, 180, 240, 0.18)",
                  padding: "20px 20px",
                }}
                onClick={() => navigate(`/result`)}
              >
                <div style={{ fontSize: 32, flexShrink: 0 }}>{moodDot}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, color: "#ede4f8", fontWeight: 600 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 13, color: "#b8aed0", marginTop: 4 }}>
                    {record.created_at || ""}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 400,
                    color: riskColor,
                    minWidth: 48,
                    textAlign: "right",
                  }}
                >
                  {record.emotion_temperature != null ? `${record.emotion_temperature}°` : "--"}
                </div>
              </div>
            );
          })}

          {historyTotal > 20 && (
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <button
                className="btn-secondary"
                onClick={() => setPage((p) => p + 1)}
                style={{ fontSize: 15, padding: "14px 36px" }}
              >
                回顾更早的记录
              </button>
            </div>
          )}
        </>
      )}

      <div style={{ height: 60 }} />
    </div>
  );
}
