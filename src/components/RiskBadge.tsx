import { Tag } from "antd";
import { RISK_LABELS } from "../constants";

const RISK_TAG_COLORS: Record<string, string> = {
  LOW: "green",
  MEDIUM: "gold",
  HIGH: "orange",
  CRITICAL: "red",
};

interface RiskBadgeProps {
  level: string;
  score?: number;
}

export default function RiskBadge({ level, score }: RiskBadgeProps) {
  const label = RISK_LABELS[level] || level;
  const text = score != null ? `${label} · ${score}分` : label;
  return <Tag color={RISK_TAG_COLORS[level] || "default"}>{text}</Tag>;
}
