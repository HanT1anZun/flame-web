import { useState, useEffect } from "react";

export default function BreathingGuide() {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [seconds, setSeconds] = useState(4);

  useEffect(() => {
    const cycle = [4, 4, 6];
    const phases: ("inhale" | "hold" | "exhale")[] = ["inhale", "hold", "exhale"];
    let step = 0;
    let count = cycle[step];

    const timer = setInterval(() => {
      count--;
      setSeconds(count);

      if (count <= 0) {
        step = (step + 1) % 3;
        count = cycle[step];
        setSeconds(count);
        setPhase(phases[step]);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const labels: Record<string, string> = {
    inhale: "吸",
    hold: "屏息",
    exhale: "呼",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 40,
      }}
    >
      <div style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 8 }}>
        跟着节奏，慢慢呼吸
      </div>
      <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 24 }}>
        你不需要做什么，只是吸气、停顿、呼气
      </div>
      <div
        style={{
          width: 130,
          height: 130,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232, 136, 142, 0.15), rgba(200, 160, 180, 0.04))",
          border: "2px solid rgba(232, 136, 142, 0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "breath-anim 4s ease-in-out infinite",
        }}
      >
        <span
          style={{
            fontSize: 32,
            fontWeight: 300,
            color: "var(--neon-pink)",
          }}
        >
          {labels[phase]}
        </span>
      </div>
      <div style={{ fontSize: 14, color: "var(--text-dim)", marginTop: 16 }}>
        {seconds} 秒
      </div>
    </div>
  );
}
