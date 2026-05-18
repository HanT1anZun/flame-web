import TemperatureBar from "./TemperatureBar";
import RiskBadge from "./RiskBadge";
import { RISK_COLORS } from "../constants";

interface EmotionGaugeProps {
  temperature: number;
  riskLevel: string;
  riskScore: number;
  size?: "default" | "large";
}

export default function EmotionGauge({ temperature, riskLevel, riskScore, size = "default" }: EmotionGaugeProps) {
  const riskColor = RISK_COLORS[riskLevel] || "#00e676";
  const flameSize = size === "large" ? 80 : 56;
  const tempFontSize = size === "large" ? 56 : 40;

  return (
    <div className="glass-card" style={{ textAlign: "center" }}>
      <div
        className="flame"
        style={{
          fontSize: flameSize,
          opacity: Math.max(temperature / 100, 0.15),
          transition: "opacity 0.6s ease",
        }}
      >
        🔥
      </div>
      <div
        style={{
          fontSize: tempFontSize,
          fontWeight: 700,
          color: riskColor,
          marginBottom: 4,
          textShadow: `0 0 20px ${riskColor}`,
        }}
      >
        {temperature}°
      </div>
      <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
        情绪温度
      </div>
      <TemperatureBar value={temperature} riskLevel={riskLevel} size={size} />
      <div style={{ marginTop: 16 }}>
        <RiskBadge level={riskLevel} score={riskScore} />
      </div>
    </div>
  );
}
