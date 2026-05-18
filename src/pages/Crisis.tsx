import { useEffect, useState } from "react";
import { riskApi } from "../api/risk";
import BreathingGuide from "../components/BreathingGuide";
import HotlineCard from "../components/HotlineCard";
import AmbientParticles, { PAGE_AMBIENCE } from "../components/AmbientParticles";
import LoadingSpinner from "../components/LoadingSpinner";

const GROUNDING_STEPS = [
  {
    num: 5,
    sense: "看",
    instruction: "环顾四周，找到 5 样你能看到的东西",
    icon: "👀",
    color: "var(--neon-cyan)",
  },
  {
    num: 4,
    sense: "触",
    instruction: "感受 4 样你能触摸到的东西",
    icon: "🤲",
    color: "var(--neon-purple)",
  },
  {
    num: 3,
    sense: "听",
    instruction: "仔细聆听 3 种你能听到的声音",
    icon: "👂",
    color: "var(--neon-pink)",
  },
  {
    num: 2,
    sense: "闻",
    instruction: "寻找 2 种你能闻到的气味",
    icon: "👃",
    color: "var(--neon-orange)",
  },
  {
    num: 1,
    sense: "尝",
    instruction: "感受 1 种你能尝到的味道",
    icon: "😋",
    color: "var(--temp-yellow)",
  },
];

export default function Crisis() {
  const [hotlines, setHotlines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGrounding, setActiveGrounding] = useState<number | null>(null);

  useEffect(() => {
    riskApi
      .getHotline()
      .then((res) => setHotlines(res.hotlines || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner text="正在为你寻找身边的帮助..." />;
  }

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <AmbientParticles config={PAGE_AMBIENCE.crisis} />
      <div className="page-accent accent-crisis" />
      {/* Header — warm, not alarming */}
      <div
        style={{
          background: "linear-gradient(180deg, rgba(232, 136, 142, 0.1), rgba(26, 16, 40, 0.9))",
          borderRadius: 16,
          padding: "32px 24px",
          textAlign: "center",
          marginBottom: 24,
          border: "1px solid rgba(232, 136, 142, 0.2)",
        }}
      >
        <div style={{ fontSize: 56, marginBottom: 12 }}>🕯️</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
          你不需要独自承担这一切
        </div>
        <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
          有时候，最勇敢的事就是允许自己接受帮助
        </div>
      </div>

      {/* Grounding exercise */}
      <div className="glass-card" style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: "var(--text-primary)" }}>
          先让自己回到当下
        </div>
        <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 20, lineHeight: 1.6 }}>
          试一试 5-4-3-2-1 感官接地练习，它能帮助你从强烈的情绪中暂时抽离
        </div>
        <div>
          {GROUNDING_STEPS.map((step, i) => (
            <div
              key={step.num}
              className="grounding-step"
              onClick={() => setActiveGrounding(activeGrounding === i ? null : i)}
              style={{ cursor: "pointer" }}
            >
              <div
                className="grounding-number"
                style={{
                  background: activeGrounding === i ? step.color : "rgba(255,255,255,0.04)",
                  color: activeGrounding === i ? "#fff" : "var(--text-secondary)",
                  border: `2px solid ${activeGrounding === i ? step.color : "rgba(255,255,255,0.06)"}`,
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: activeGrounding === i ? "scale(1.1)" : "scale(1)",
                }}
              >
                {step.num}
              </div>
              <div style={{ fontSize: 20 }}>{step.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>
                  {step.sense}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.5 }}>
                  {step.instruction}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Breathing guide */}
      <div className="glass-card" style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, color: "var(--text-primary)", textAlign: "center" }}>
          跟随节奏呼吸
        </div>
        <BreathingGuide />
      </div>

      {/* Hotlines */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", marginBottom: 16 }}>
          有人愿意倾听你
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {hotlines.map((h) => (
            <HotlineCard key={h.number} name={h.name} number={h.number} />
          ))}
        </div>
      </div>

      {/* Emergency buttons — larger, clearer */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <a
          href="tel:110"
          style={{
            flex: 1,
            display: "block",
            textAlign: "center",
            padding: "20px 24px",
            background: "linear-gradient(135deg, #d44, #b33)",
            color: "#fff",
            borderRadius: 48,
            fontSize: 18,
            fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 4px 20px rgba(200, 60, 60, 0.3)",
            letterSpacing: 2,
          }}
        >
          拨打 110
        </a>
        <a
          href="tel:120"
          style={{
            flex: 1,
            display: "block",
            textAlign: "center",
            padding: "20px 24px",
            background: "linear-gradient(135deg, #e87, #c55)",
            color: "#fff",
            borderRadius: 48,
            fontSize: 18,
            fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 4px 20px rgba(200, 120, 80, 0.3)",
            letterSpacing: 2,
          }}
        >
          拨打 120
        </a>
      </div>

      {/* Supportive message */}
      <div
        style={{
          textAlign: "center",
          padding: "32px 0",
          fontSize: 14,
          color: "var(--text-secondary)",
          lineHeight: 2.4,
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        你感受到的痛苦是真实的
        <br />
        但它不能定义你是谁
        <br />
        你是有价值的，你是被爱的
        <br />
        请伸出手，有人会握住
      </div>

      <div style={{ height: 60 }} />
    </div>
  );
}
