import HotlineCard from "./HotlineCard";

interface CrisisOverlayProps {
  visible: boolean;
  hotlines: Array<{ name: string; number: string }>;
}

export default function CrisisOverlay({ visible, hotlines }: CrisisOverlayProps) {
  if (!visible) return null;

  const displayHotlines =
    hotlines.length > 0
      ? hotlines
      : [
          { name: "全国心理援助热线", number: "400-161-9995" },
          { name: "希望24热线", number: "400-161-9995" },
        ];

  return (
    <div
      style={{
        background: "linear-gradient(180deg, rgba(255, 23, 68, 0.15), rgba(10, 10, 15, 0.95))",
        border: "2px solid rgba(255, 23, 68, 0.5)",
        borderRadius: 16,
        padding: 32,
        marginBottom: 24,
        animation: "pulse-red 2s infinite",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 12 }}>🆘</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: "var(--temp-red)", marginBottom: 12 }}>
        请关注你的情绪信号
      </div>
      <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 20 }}>
        你可能正在经历非常困难的时刻。请记住：你不需要独自面对。
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {displayHotlines.map((h) => (
          <HotlineCard key={h.number} name={h.name} number={h.number} />
        ))}
      </div>
      <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.8 }}>
        如果有立即危险，请拨打 110 或 120
        <br />
        你是有价值的，你的感受是重要的。
      </div>
    </div>
  );
}
