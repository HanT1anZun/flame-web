interface CbtSectionProps {
  automaticThought?: string;
  cognitiveDistortions?: string[];
  alternativeThought?: string;
  behavioralSuggestions?: string[];
}

export default function CbtSection({
  automaticThought,
  cognitiveDistortions,
  alternativeThought,
  behavioralSuggestions,
}: CbtSectionProps) {
  return (
    <div className="glass-card">
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: "var(--text-primary)" }}>
        一起看看你的想法
      </div>
      <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 20, lineHeight: 1.6 }}>
        我们的自动思维有时会偏离事实，看见它们是改变的第一步
      </div>

      {automaticThought && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 4 }}>你当时的自动想法：</div>
          <div style={{ fontSize: 14, color: "var(--text-primary)", lineHeight: 1.6 }}>
            {automaticThought}
          </div>
        </div>
      )}

      {cognitiveDistortions && cognitiveDistortions.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 4 }}>可能存在的思维惯性：</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {cognitiveDistortions.map((d) => (
              <span
                key={d}
                style={{
                  padding: "3px 10px",
                  borderRadius: 12,
                  fontSize: 12,
                  background: "rgba(255, 145, 0, 0.1)",
                  border: "1px solid rgba(255, 145, 0, 0.2)",
                  color: "var(--neon-orange)",
                }}
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      )}

      {alternativeThought && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 4 }}>一个更友善的视角：</div>
          <div
            style={{
              fontSize: 14,
              color: "var(--temp-green)",
              lineHeight: 1.6,
              padding: 12,
              background: "rgba(0, 230, 118, 0.05)",
              borderRadius: 8,
              border: "1px solid rgba(0, 230, 118, 0.15)",
            }}
          >
            {alternativeThought}
          </div>
        </div>
      )}

      {behavioralSuggestions && behavioralSuggestions.length > 0 && (
        <div>
          <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 4 }}>你可以试试这些：</div>
          {behavioralSuggestions.map((s, i) => (
            <div
              key={i}
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.8,
                paddingLeft: 8,
              }}
            >
              {i + 1}. {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
