export const EMOTION_LABELS_CN: Record<string, string> = {
  anxiety: "焦虑",
  depression: "抑郁",
  anger: "愤怒",
  emptiness: "空虚",
  self_negation: "自我否定",
  catharsis: "情绪宣泄",
  playful_collapse: "戏谑式崩溃",
  rumination: "反刍绝望",
  neutral: "中性",
};

export const RISK_COLORS: Record<string, string> = {
  LOW: "#00e676",
  MEDIUM: "#ffd600",
  HIGH: "#ff9100",
  CRITICAL: "#ff1744",
};

export const RISK_LABELS: Record<string, string> = {
  LOW: "低风险",
  MEDIUM: "中等风险",
  HIGH: "高风险",
  CRITICAL: "⚠ 紧急",
};

export const DISCLAIMER = "本工具仅用于情绪状态参考，不构成医疗建议。";

export const PERSONA_MAP: Record<string, { emoji: string; color: string }> = {
  "戏谑型崩溃者": { emoji: "🎭", color: "var(--neon-cyan)" },
  "预支型焦虑者": { emoji: "⏳", color: "var(--neon-orange)" },
  "暗夜型感受者": { emoji: "🌙", color: "var(--neon-purple)" },
  "火山型表达者": { emoji: "🌋", color: "var(--temp-red)" },
  "镜碎型自我批判者": { emoji: "🪞", color: "var(--neon-pink)" },
  "洪流型释放者": { emoji: "🌊", color: "var(--neon-cyan)" },
};

export const DISTORTIONS: { key: string; label: string; desc: string }[] = [
  { key: "catastrophizing", label: "灾难化", desc: "总是预想最坏的结果" },
  { key: "black_white", label: "非黑即白", desc: "要么完美，要么彻底失败" },
  { key: "overgeneralization", label: "过度概括", desc: "从单次事件得出普遍结论" },
  { key: "mind_reading", label: "读心术", desc: "认为自己知道别人在想什么" },
  { key: "emotional_reasoning", label: "情绪推理", desc: "因为感觉如此，所以就是真的" },
  { key: "should_statement", label: "应该陈述", desc: "\"我应该/必须...\"的自我苛责" },
  { key: "labeling", label: "贴标签", desc: "给自己或他人贴全局性标签" },
  { key: "personalization", label: "个人化", desc: "把外部事件归咎于自己" },
];
