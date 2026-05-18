import { useEffect, useRef } from "react";

interface AmbientConfig {
  particleCount?: number;
  mouseRadius?: number;
  connectionDistance?: number;
  speedRange?: [number, number];
  sizeRange?: [number, number];
  opacityRange?: [number, number];
  hues: number[];
  glowColor: string;
  trailColor: string;
  connectionColor: string;
  showTrail?: boolean;
  trailCount?: number;
}

const DEFAULT_CONFIG: AmbientConfig = {
  particleCount: 40,
  mouseRadius: 160,
  connectionDistance: 90,
  speedRange: [0.15, 0.6],
  sizeRange: [1.5, 4],
  opacityRange: [0.18, 0.38],
  hues: [320, 340, 30, 180],
  glowColor: "rgba(200,170,200,0.08)",
  trailColor: "rgba(200,170,210,0.2)",
  connectionColor: "rgba(180,160,210,0.12)",
};

interface Particle {
  x: number; y: number;
  baseX: number; baseY: number;
  size: number; speed: number;
  opacity: number; baseOpacity: number;
  hue: number; phase: number;
}

const TRAIL_DEFAULT = 10;

export default function AmbientParticles({ config = {} }: { config?: Partial<AmbientConfig> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -500, y: -500, active: false });
  const trailRef = useRef<Array<{ x: number; y: number; a: number }>>([]);

  useEffect(() => {
    const cfg = { ...DEFAULT_CONFIG, ...config };
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w;
      canvas!.height = h;
    }
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = Array.from({ length: cfg.particleCount! }, () => ({
      x: Math.random() * (w || window.innerWidth),
      y: Math.random() * (h || window.innerHeight),
      baseX: 0, baseY: 0,
      size: cfg.sizeRange![0] + Math.random() * (cfg.sizeRange![1] - cfg.sizeRange![0]),
      speed: cfg.speedRange![0] + Math.random() * (cfg.speedRange![1] - cfg.speedRange![0]),
      opacity: cfg.opacityRange![0] + Math.random() * (cfg.opacityRange![1] - cfg.opacityRange![0]),
      baseOpacity: 0,
      hue: cfg.hues[Math.floor(Math.random() * cfg.hues.length)],
      phase: Math.random() * Math.PI * 2,
    }));

    particles.forEach((p) => { p.baseX = p.x; p.baseY = p.y; p.baseOpacity = p.opacity; });

    const showTrail = cfg.showTrail ?? false;
    const trailMax = cfg.trailCount ?? TRAIL_DEFAULT;

    function onMove(clientX: number, clientY: number) {
      mouseRef.current = { x: clientX, y: clientY, active: true };
      if (showTrail) {
        const trail = trailRef.current;
        trail.push({ x: clientX, y: clientY, a: 1 });
        if (trail.length > trailMax) trail.shift();
      }
    }
    function onLeave() { mouseRef.current.active = false; }

    function onMouseMove(e: MouseEvent) { onMove(e.clientX, e.clientY); }
    function onTouchMove(e: TouchEvent) {
      if (e.touches.length > 0) onMove(e.touches[0].clientX, e.touches[0].clientY);
    }
    function onTouchEnd() { onLeave(); }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    let animId: number;
    let frame = 0;
    const R = cfg.mouseRadius!;
    const connDist = cfg.connectionDistance!;

    function animate() {
      ctx!.clearRect(0, 0, w, h);
      frame++;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const active = mouseRef.current.active;

      // Mouse trail
      if (showTrail) {
        const trail = trailRef.current;
        for (let i = 0; i < trail.length; i++) {
          const t = trail[i];
          t.a *= 0.92;
          if (t.a < 0.02) continue;
          const r = 10 + i * 3;
          const grad = ctx!.createRadialGradient(t.x, t.y, 0, t.x, t.y, r);
          grad.addColorStop(0, cfg.trailColor.replace(/[\d.]+\)$/, `${t.a * 0.35})`));
          grad.addColorStop(0.5, cfg.trailColor.replace(/[\d.]+\)$/, `${t.a * 0.12})`));
          grad.addColorStop(1, "rgba(0,0,0,0)");
          ctx!.beginPath();
          ctx!.arc(t.x, t.y, r, 0, Math.PI * 2);
          ctx!.fillStyle = grad;
          ctx!.fill();
        }
      }

      // Mouse glow
      if (active) {
        const glow = ctx!.createRadialGradient(mx, my, 0, mx, my, R);
        glow.addColorStop(0, cfg.glowColor);
        glow.addColorStop(0.4, cfg.trailColor);
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.beginPath();
        ctx!.arc(mx, my, R, 0, Math.PI * 2);
        ctx!.fillStyle = glow;
        ctx!.fill();
      }

      // Nearby connections
      if (active) {
        const nearby = particles.filter((p) => {
          const dx = mx - p.x, dy = my - p.y;
          return Math.sqrt(dx * dx + dy * dy) < R;
        });
        for (let i = 0; i < nearby.length; i++) {
          for (let j = i + 1; j < nearby.length; j++) {
            const dx = nearby[i].x - nearby[j].x;
            const dy = nearby[i].y - nearby[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < connDist) {
              const alpha = (1 - dist / connDist) * 0.12;
              ctx!.beginPath();
              ctx!.moveTo(nearby[i].x, nearby[i].y);
              ctx!.lineTo(nearby[j].x, nearby[j].y);
              ctx!.strokeStyle = cfg.connectionColor.replace("0.12", String(alpha));
              ctx!.lineWidth = 0.4;
              ctx!.stroke();
            }
          }
          const ddx = mx - nearby[i].x, ddy = my - nearby[i].y;
          const ddist = Math.sqrt(ddx * ddx + ddy * ddy);
          const lineA = (1 - ddist / R) * 0.15;
          ctx!.beginPath();
          ctx!.moveTo(nearby[i].x, nearby[i].y);
          ctx!.lineTo(mx, my);
          ctx!.strokeStyle = `rgba(200,180,210,${lineA})`;
          ctx!.lineWidth = 0.3;
          ctx!.stroke();
        }
      }

      const hueMap: Record<number, string> = {
        320: "rgba(232,136,142,", 340: "rgba(220,150,180,",
        30: "rgba(232,200,120,", 40: "rgba(232,168,124,",
        180: "rgba(126,200,200,", 200: "rgba(140,180,220,",
        260: "rgba(180,160,220,", 160: "rgba(140,200,180,",
      };

      for (const p of particles) {
        p.y -= p.speed;
        p.x += Math.sin(frame * 0.015 + p.phase) * 0.2;

        if (active) {
          const dx = mx - p.x, dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < R) {
            const force = (1 - dist / R) * 0.015;
            p.x += dx * force;
            p.y += dy * force;
            p.opacity = Math.min(p.baseOpacity + (1 - dist / R) * 0.3, 0.7);
          }
        }

        if (p.y < -30) { p.y = h + 30; p.x = Math.random() * w; }
        if (p.x < -30) p.x = w + 30;
        if (p.x > w + 30) p.x = -30;

        if (!active && p.opacity > p.baseOpacity) {
          p.opacity = Math.max(p.baseOpacity, p.opacity - 0.003);
        }

        const base = hueMap[p.hue] || "rgba(200,180,220,";
        const a = p.opacity;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx!.fillStyle = `${base}${a * 0.08})`;
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * 1.3, 0, Math.PI * 2);
        ctx!.fillStyle = `${base}${a * 0.2})`;
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `${base}${a})`;
        ctx!.fill();
      }

      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

// Pre-built page configs
export const PAGE_AMBIENCE: Record<string, AmbientConfig> = {
  analyze: {
    particleCount: 45,
    hues: [320, 340, 260],
    mouseRadius: 170,
    glowColor: "rgba(220,150,180,0.09)",
    trailColor: "rgba(210,160,190,0.22)",
    connectionColor: "rgba(200,160,200,0.12)",
    opacityRange: [0.2, 0.42],
  },
  result: {
    particleCount: 35,
    hues: [180, 200, 160],
    mouseRadius: 150,
    speedRange: [0.1, 0.4],
    glowColor: "rgba(140,200,200,0.08)",
    trailColor: "rgba(160,200,210,0.18)",
    connectionColor: "rgba(150,190,200,0.1)",
    opacityRange: [0.16, 0.34],
  },
  history: {
    particleCount: 40,
    hues: [260, 200, 180],
    mouseRadius: 150,
    speedRange: [0.1, 0.4],
    sizeRange: [1.5, 3.5],
    glowColor: "rgba(180,160,210,0.06)",
    trailColor: "rgba(190,170,220,0.18)",
    connectionColor: "rgba(180,160,210,0.07)",
    opacityRange: [0.16, 0.32],
    connectionDistance: 70,
    showTrail: true,
    trailCount: 8,
  },
  profile: {
    particleCount: 38,
    hues: [40, 30, 320],
    mouseRadius: 160,
    glowColor: "rgba(220,170,140,0.08)",
    trailColor: "rgba(220,180,150,0.2)",
    connectionColor: "rgba(210,175,155,0.1)",
    opacityRange: [0.18, 0.4],
  },
  cbt: {
    particleCount: 30,
    hues: [160, 180, 200],
    mouseRadius: 140,
    speedRange: [0.1, 0.35],
    glowColor: "rgba(140,190,180,0.07)",
    trailColor: "rgba(160,200,190,0.16)",
    connectionColor: "rgba(150,190,180,0.08)",
    opacityRange: [0.15, 0.3],
    connectionDistance: 75,
  },
  crisis: {
    particleCount: 25,
    hues: [30, 40, 320],
    mouseRadius: 130,
    speedRange: [0.08, 0.3],
    sizeRange: [1.5, 3.5],
    glowColor: "rgba(220,160,140,0.06)",
    trailColor: "rgba(210,170,150,0.14)",
    connectionColor: "rgba(200,165,150,0.07)",
    opacityRange: [0.14, 0.28],
    connectionDistance: 65,
  },
};
