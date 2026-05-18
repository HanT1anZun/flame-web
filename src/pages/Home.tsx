import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Disclaimer from "../components/Disclaimer";

const EVIDENCE = [
  {
    icon: "🧠",
    title: "基于循证心理干预",
    desc: "数字自导式 CBT 在 154 项 RCT 的元分析中验证有效（g=−0.51），效果持续 12 个月以上",
    source: "Clinical Psychology Review, 2024",
  },
  {
    icon: "✍️",
    title: "表达性写作科学验证",
    desc: "RCT 研究证实表达性写作可显著降低心理病耻感，同时提升希望感和应对能力",
    source: "Perspectives in Psychiatric Care, 2023",
  },
  {
    icon: "💬",
    title: "发疯文学的情绪价值",
    desc: "学术研究确认\"发疯文学\"是中国青年创造性的情绪调节策略，属于适应性应对而非病态发泄",
    source: "人民论坛 / 暨南大学, 2024",
  },
  {
    icon: "🔒",
    title: "匿名降低求助门槛",
    desc: "高污名环境中，匿名模式可显著降低心理求助障碍，且不影响干预效果",
    source: "PRIVATE Trial / JMIR, 2024–2026",
  },
  {
    icon: "🤖",
    title: "多模态 AI 技术支撑",
    desc: "文本+图像融合情绪识别 SOTA 精度达 89–95%，Chinese MentalBERT 开源可用",
    source: "ACL 2024 / EmoVibe 2025",
  },
];

const PARTICLE_COUNT = 80;
const MOUSE_RADIUS = 180;
const TRAIL_COUNT = 12;

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  speed: number;
  opacity: number;
  baseOpacity: number;
  hue: number;
  phase: number;
}

export default function Home() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -500, y: -500, active: false });
  const trailRef = useRef<Array<{ x: number; y: number; a: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w;
      canvas!.height = h;
    }
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * (w || window.innerWidth),
      y: Math.random() * (h || window.innerHeight),
      baseX: 0,
      baseY: 0,
      size: 2 + Math.random() * 5,
      speed: 0.2 + Math.random() * 0.8,
      opacity: 0.25 + Math.random() * 0.45,
      baseOpacity: 0,
      hue: [320, 340, 30, 40, 180, 200][Math.floor(Math.random() * 6)], // rose, peach, teal
      phase: Math.random() * Math.PI * 2,
    }));

    // Store base positions
    particles.forEach((p) => {
      p.baseX = p.x;
      p.baseY = p.y;
      p.baseOpacity = p.opacity;
    });

    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
      // Add to trail
      const trail = trailRef.current;
      trail.push({ x: e.clientX, y: e.clientY, a: 1 });
      if (trail.length > TRAIL_COUNT) trail.shift();
    }

    function onMouseLeave() {
      mouseRef.current.active = false;
    }

    function onTouchMove(e: TouchEvent) {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        mouseRef.current = { x: t.clientX, y: t.clientY, active: true };
        const trail = trailRef.current;
        trail.push({ x: t.clientX, y: t.clientY, a: 1 });
        if (trail.length > TRAIL_COUNT) trail.shift();
      }
    }

    function onTouchEnd() {
      mouseRef.current.active = false;
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    let animId: number;
    let frame = 0;
    function animate() {
      ctx!.clearRect(0, 0, w, h);
      frame++;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mouseActive = mouseRef.current.active;

      // Draw mouse trail
      const trail = trailRef.current;
      for (let i = 0; i < trail.length; i++) {
        const t = trail[i];
        t.a *= 0.92; // fade
        if (t.a < 0.02) continue;
        const r = 12 + i * 3;
        const grad = ctx!.createRadialGradient(t.x, t.y, 0, t.x, t.y, r);
        grad.addColorStop(0, `rgba(255,200,180,${t.a * 0.35})`);
        grad.addColorStop(0.5, `rgba(220,180,240,${t.a * 0.15})`);
        grad.addColorStop(1, "rgba(180,200,240,0)");
        ctx!.beginPath();
        ctx!.arc(t.x, t.y, r, 0, Math.PI * 2);
        ctx!.fillStyle = grad;
        ctx!.fill();
      }

      // Mouse glow orb
      if (mouseActive) {
        const glow = ctx!.createRadialGradient(mx, my, 0, mx, my, MOUSE_RADIUS);
        glow.addColorStop(0, "rgba(255,200,180,0.12)");
        glow.addColorStop(0.3, "rgba(220,170,210,0.06)");
        glow.addColorStop(1, "rgba(180,160,220,0)");
        ctx!.beginPath();
        ctx!.arc(mx, my, MOUSE_RADIUS, 0, Math.PI * 2);
        ctx!.fillStyle = glow;
        ctx!.fill();
      }

      // Draw connections near mouse
      if (mouseActive) {
        const nearby = particles.filter((p) => {
          const dx = mx - p.x;
          const dy = my - p.y;
          return Math.sqrt(dx * dx + dy * dy) < MOUSE_RADIUS;
        });

        for (let i = 0; i < nearby.length; i++) {
          for (let j = i + 1; j < nearby.length; j++) {
            const dx = nearby[i].x - nearby[j].x;
            const dy = nearby[i].y - nearby[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
              const alpha = (1 - dist / 100) * 0.2;
              ctx!.beginPath();
              ctx!.moveTo(nearby[i].x, nearby[i].y);
              ctx!.lineTo(nearby[j].x, nearby[j].y);
              ctx!.strokeStyle = `rgba(200,175,220,${alpha})`;
              ctx!.lineWidth = 0.6;
              ctx!.stroke();
            }
          }
          // Connect each nearby particle to mouse
          const ddx = mx - nearby[i].x;
          const ddy = my - nearby[i].y;
          const ddist = Math.sqrt(ddx * ddx + ddy * ddy);
          const lineAlpha = (1 - ddist / MOUSE_RADIUS) * 0.25;
          ctx!.beginPath();
          ctx!.moveTo(nearby[i].x, nearby[i].y);
          ctx!.lineTo(mx, my);
          ctx!.strokeStyle = `rgba(220,190,210,${lineAlpha})`;
          ctx!.lineWidth = 0.5;
          ctx!.stroke();
        }
      }

      // Update and draw particles
      for (const p of particles) {
        // Slow upward float with sinuous drift
        p.y -= p.speed;
        p.x += Math.sin(frame * 0.02 + p.phase) * 0.3;

        // Mouse attraction
        if (mouseActive) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS) {
            const force = (1 - dist / MOUSE_RADIUS) * 0.02;
            p.x += dx * force;
            p.y += dy * force;
            p.opacity = Math.min(p.baseOpacity + (1 - dist / MOUSE_RADIUS) * 0.4, 0.92);
          }
        }

        // Wrap around
        if (p.y < -30) {
          p.y = h + 30;
          p.x = Math.random() * w;
        }
        if (p.x < -30) p.x = w + 30;
        if (p.x > w + 30) p.x = -30;

        // Decay opacity when idle
        if (!mouseActive && p.opacity > p.baseOpacity) {
          p.opacity = Math.max(p.baseOpacity, p.opacity - 0.004);
        }

        // Draw glow halo
        const alpha = p.opacity;
        const hueColors: Record<number, string> = {
          320: `rgba(232,136,142,`,  // rose
          340: `rgba(220,150,180,`,  // soft pink
          30: `rgba(232,200,120,`,   // warm gold
          40: `rgba(232,168,124,`,   // peach
          180: `rgba(126,200,200,`,  // teal
          200: `rgba(140,180,220,`,  // soft blue
        };
        const base = hueColors[p.hue] || `rgba(200,180,220,`;

        // Outer glow
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx!.fillStyle = `${base}${alpha * 0.12})`;
        ctx!.fill();

        // Inner glow
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
        ctx!.fillStyle = `${base}${alpha * 0.3})`;
        ctx!.fill();

        // Core
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `${base}${alpha})`;
        ctx!.fill();
      }

      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div style={{ textAlign: "center", position: "relative", minHeight: "80vh" }}>
      {/* Canvas particle system */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Hero section */}
      <div style={{ position: "relative", zIndex: 1, padding: "60px 20px 0" }}>
        <div className="flame" style={{ fontSize: 84, marginBottom: 16 }}>
          🔥
        </div>
        <h1
          className="neon-text-pink"
          style={{
            fontSize: 56,
            fontWeight: 800,
            margin: "0 0 8px",
            letterSpacing: 2,
          }}
        >
          FLAME
        </h1>
        <h2
          className="neon-text"
          style={{
            fontSize: 32,
            fontWeight: 300,
            margin: "0 0 24px",
            letterSpacing: 4,
          }}
        >
          情绪焰火
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "var(--text-secondary)",
            lineHeight: 2,
            marginBottom: 48,
          }}
        >
          把你的感受说给我听
          <br />
          每一种情绪都值得被看见
        </p>

        {/* CTA */}
        <button className="btn-primary" onClick={() => navigate("/analyze")}>
          🔥 开始表达
        </button>
        <div style={{ marginTop: 16, fontSize: 14, color: "var(--text-dim)" }}>
          匿名模式 · 无需注册 · 在这里，你可以完全做自己
        </div>
      </div>

      {/* Evidence section */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "60px auto 0", padding: "0 16px" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#cfc8e0", marginBottom: 6 }}>
            学术研究支撑
          </div>
          <div style={{ fontSize: 12, color: "#b0a8c4" }}>
            FLAME 的设计建立在心理学、精神病学与人工智能交叉领域的循证研究之上
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {EVIDENCE.map((item) => (
            <div
              key={item.title}
              className="glass-card"
              style={{
                display: "flex",
                gap: 14,
                padding: "16px 18px",
                margin: 0,
              }}
            >
              <div style={{ fontSize: 28, flexShrink: 0, lineHeight: 1 }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#e8e0f8", marginBottom: 4 }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 13, color: "#cfc8e0", lineHeight: 1.6, marginBottom: 4 }}>
                  {item.desc}
                </div>
                <div style={{ fontSize: 11, color: "#9a92b8" }}>
                  {item.source}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#9a92b8", lineHeight: 1.8 }}>
          FLAME 定位为心理支持工具，不提供医疗诊断
          <br />
          参考共计 300+ 项 RCT 及 336 万条中文社交媒体数据的学术研究
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}
