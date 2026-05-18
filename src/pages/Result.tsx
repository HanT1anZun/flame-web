import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmotionStore } from "../stores/useEmotionStore";
import { riskApi } from "../api/risk";
import { EMOTION_LABELS_CN, RISK_COLORS, RISK_LABELS } from "../constants";
import EmotionGauge from "../components/EmotionGauge";
import FlamePersonaCard from "../components/FlamePersonaCard";
import CbtSection from "../components/CbtSection";
import CrisisOverlay from "../components/CrisisOverlay";
import AmbientParticles, { PAGE_AMBIENCE } from "../components/AmbientParticles";
import Disclaimer from "../components/Disclaimer";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";

const VALIDATION_MESSAGES: Record<string, string> = {
  anger: "愤怒是一种正常的情感，它在告诉你某些边界需要被关注",
  sadness: "悲伤是人类情感光谱中最深沉的颜色之一，它见证了你在乎的东西",
  anxiety: "焦虑是你的大脑在试图保护你，即使有时候它会过度工作",
  fear: "恐惧是最古老的情绪之一，它曾保护我们的祖先存活下来",
  joy: "即使只是片刻的快乐，也值得被认真对待",
  surprise: "生活总有意外，你的感受都是真实的",
  disgust: "有些东西本能地让你不适，这是你的边界",
  neutral: "平静也是一种力量，不是每时每刻都需要波澜",
};

function getValidation(emotion: string): string {
  return VALIDATION_MESSAGES[emotion] || "你的每一种情绪都值得被看见，包括现在这一种";
}

export default function Result() {
  const navigate = useNavigate();
  const { lastResult, isAnalyzing } = useEmotionStore();
  const [hotlines, setHotlines] = useState<any[]>([]);

  useEffect(() => {
    if (lastResult?.risk_level === "HIGH" || lastResult?.risk_level === "CRITICAL") {
      riskApi.getHotline().then((res) => setHotlines(res.hotlines || [])).catch(() => {});
    }
  }, [lastResult]);

  if (!lastResult && !isAnalyzing) {
    return (
      <EmptyState
        message="还没有分析结果"
        action={{ text: "去表达", onClick: () => navigate("/analyze") }}
      />
    );
  }

  if (isAnalyzing || !lastResult) {
    return <LoadingSpinner text="正在用心感受你的表达..." />;
  }

  const r = lastResult;
  const riskColor = RISK_COLORS[r.risk_level] || "var(--text-secondary)";
  const riskLabel = RISK_LABELS[r.risk_level] || r.risk_level;
  const isHighRisk = r.risk_level === "HIGH" || r.risk_level === "CRITICAL";
  const emotionLabel = EMOTION_LABELS_CN[r.primary_emotion] || r.primary_emotion;
  const validation = getValidation(r.primary_emotion);

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <AmbientParticles config={PAGE_AMBIENCE.result} />
      <div className="page-accent accent-result" />
      {/* Crisis overlay */}
      <CrisisOverlay visible={isHighRisk} hotlines={hotlines} />

      {/* Emotion temperature gauge */}
      <EmotionGauge
        temperature={r.emotion_temperature}
        riskLevel={r.risk_level}
        riskScore={r.risk_score}
        size="large"
      />

      {/* Main emotion card */}
      <div className="glass-card reveal-card">
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "var(--text-primary)" }}>
          你的主要情绪
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span
            style={{
              padding: "10px 24px",
              borderRadius: 24,
              border: `2px solid ${riskColor}`,
              color: riskColor,
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            {emotionLabel}
          </span>
        </div>
        <div
          style={{
            padding: 14,
            borderRadius: 12,
            background: "rgba(126, 200, 200, 0.04)",
            border: "1px solid rgba(126, 200, 200, 0.12)",
            fontSize: 14,
            color: "var(--neon-cyan)",
            lineHeight: 1.8,
          }}
        >
          {validation}
        </div>
        {r.sub_emotions?.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 8 }}>
              还感受到了这些：
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {r.sub_emotions.map((e: any) => (
                <span
                  key={e.type}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 14,
                    fontSize: 12,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {EMOTION_LABELS_CN[e.type] || e.type} {(e.score * 100).toFixed(0)}%
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Normative feedback */}
      <div className="validation-bubble" style={{ display: "block", margin: "16px 0", textAlign: "center" }}>
        很多人在类似情境下也会有这种感受，你并不孤单
      </div>

      {/* Flame persona */}
      {r.flame_persona && (
        <div className="reveal-card">
          <FlamePersonaCard persona={r.flame_persona} />
        </div>
      )}

      {/* Stigma signal */}
      {r.stigma_type && (
        <div className="glass-card reveal-card">
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: "var(--text-primary)" }}>
            关于你感受到的社会压力
          </div>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            {r.stigma_description}
          </div>
          <div style={{
            marginTop: 12,
            padding: 10,
            borderRadius: 8,
            background: "rgba(200, 160, 180, 0.04)",
            fontSize: 13,
            color: "var(--text-dim)",
            lineHeight: 1.6,
          }}>
            这种感受很普遍，特别是在我们这个时代。它是社会期望在你内心的回响，不是你个人的缺陷。
          </div>
        </div>
      )}

      {/* CBT guidance */}
      {r.automatic_thought && (
        <div className="reveal-card">
          <CbtSection
            automaticThought={r.automatic_thought}
            cognitiveDistortions={r.cognitive_distortions}
            alternativeThought={r.alternative_thought}
            behavioralSuggestions={r.behavioral_suggestions}
          />
        </div>
      )}

      {/* Image-text contradiction */}
      {r.contradiction_index != null && (
        <div className="glass-card reveal-card">
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: "var(--text-primary)" }}>
            你的文字和表情在说不同的话
          </div>
          <div style={{ fontSize: 28, fontWeight: 200, color: "var(--neon-orange)", marginBottom: 8 }}>
            {r.contradiction_index}/100
          </div>
          <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6 }}>
            {r.contradiction_explanation}
          </div>
          <div style={{
            marginTop: 12,
            fontSize: 13,
            color: "var(--text-dim)",
            lineHeight: 1.6,
          }}>
            有时候我们表现出来的和内心真实的感受并不一致，这是很常见的一种心理现象。
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <Disclaimer />

      <div style={{ height: 60 }} />
    </div>
  );
}
