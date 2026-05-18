import { PERSONA_MAP } from "../constants";

interface FlamePersonaCardProps {
  persona: {
    archetype: string;
    description: string;
    traits: string[];
  };
}

export default function FlamePersonaCard({ persona }: FlamePersonaCardProps) {
  const meta = PERSONA_MAP[persona.archetype];

  return (
    <div className="glass-card">
      <div style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 12 }}>
        🔥 你的火焰人格
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 8,
          color: meta?.color || "var(--neon-pink)",
          textShadow: `0 0 15px ${meta?.color || "var(--neon-pink)"}`,
        }}
      >
        {meta?.emoji ? `${meta.emoji} ` : ""}{persona.archetype}
      </div>
      <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>
        {persona.description}
      </div>
      {persona.traits?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {persona.traits.map((trait) => (
            <span
              key={trait}
              style={{
                padding: "4px 14px",
                borderRadius: 20,
                fontSize: 12,
                background: "rgba(255, 45, 149, 0.1)",
                border: "1px solid rgba(255, 45, 149, 0.25)",
                color: "var(--neon-pink)",
              }}
            >
              {trait}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
