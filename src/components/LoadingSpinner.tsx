interface LoadingSpinnerProps {
  text?: string;
}

export default function LoadingSpinner({ text = "加载中..." }: LoadingSpinnerProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 60 }}>
      <div className="loading-spinner" />
      {text && (
        <div style={{ marginTop: 20, fontSize: 14, color: "var(--text-secondary)" }}>{text}</div>
      )}
    </div>
  );
}
