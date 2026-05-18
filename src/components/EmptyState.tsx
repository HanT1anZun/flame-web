interface EmptyStateProps {
  icon?: string;
  message: string;
  action?: {
    text: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon = "🔥", message, action }: EmptyStateProps) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 56, marginBottom: 24, opacity: 0.7 }}>{icon}</div>
      <div style={{ fontSize: 16, color: "#cfc8e0", marginBottom: 8, lineHeight: 1.6, fontWeight: 500 }}>{message}</div>
      <div style={{ fontSize: 14, color: "#b0a8c4", marginBottom: 28 }}>
        每一种情绪都值得被看见
      </div>
      {action && (
        <button className="btn-secondary" onClick={action.onClick}>
          {action.text}
        </button>
      )}
    </div>
  );
}
