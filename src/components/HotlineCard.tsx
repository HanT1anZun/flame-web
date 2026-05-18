interface HotlineCardProps {
  name: string;
  number: string;
}

export default function HotlineCard({ name, number }: HotlineCardProps) {
  function handleClick() {
    window.open(`tel:${number}`);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(number).catch(() => {});
    }
  }

  return (
    <button
      onClick={handleClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        padding: "14px 20px",
        background: "rgba(255, 23, 68, 0.08)",
        border: "1px solid rgba(255, 23, 68, 0.3)",
        borderRadius: 12,
        cursor: "pointer",
        transition: "background 0.2s",
      }}
      onMouseOver={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(255, 23, 68, 0.15)";
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(255, 23, 68, 0.08)";
      }}
    >
      <span style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>{name}</span>
      <span style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>{number}</span>
    </button>
  );
}
