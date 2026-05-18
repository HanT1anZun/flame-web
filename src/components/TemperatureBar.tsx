import { RISK_COLORS } from "../constants";

interface TemperatureBarProps {
  value: number;
  riskLevel: string;
  size?: "default" | "large";
}

export default function TemperatureBar({ value, riskLevel, size = "default" }: TemperatureBarProps) {
  const height = size === "large" ? 12 : 8;
  const color = RISK_COLORS[riskLevel] || "#00e676";
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div
      style={{
        width: "100%",
        height,
        background: "rgba(255,255,255,0.06)",
        borderRadius: height / 2,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${clampedValue}%`,
          height: "100%",
          background: color,
          borderRadius: height / 2,
          transition: "width 0.6s ease",
        }}
      />
    </div>
  );
}
