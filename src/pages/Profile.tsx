import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import { useAuthStore } from "../stores/useAuthStore";
import { useEmotionStore } from "../stores/useEmotionStore";
import { emotionApi } from "../api/emotion";
import { EMOTION_LABELS_CN, PERSONA_MAP } from "../constants";
import AmbientParticles, { PAGE_AMBIENCE } from "../components/AmbientParticles";
import FlamePersonaCard from "../components/FlamePersonaCard";

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAnonymous, isLoggedIn, logout } = useAuthStore();
  const { lastResult, historyRecords, loadHistory } = useEmotionStore();
  const [recordCount, setRecordCount] = useState(0);
  const [avgTemp, setAvgTemp] = useState<number | null>(null);
  const [dominantEmotion, setDominantEmotion] = useState<string | null>(null);

  useEffect(() => {
    loadHistory(1);
    emotionApi
      .getTrend(30)
      .then((data) => {
        if (data.trend_data?.length > 0) {
          const temps = data.trend_data.map((d: any) => d.emotion_temperature).filter(Boolean);
          if (temps.length > 0) setAvgTemp(Math.round(temps.reduce((a: number, b: number) => a + b, 0) / temps.length));
          const emotions = data.trend_data.map((d: any) => d.emotion_type).filter(Boolean);
          if (emotions.length > 0) {
            const counts: Record<string, number> = {};
            emotions.forEach((e: string) => { counts[e] = (counts[e] || 0) + 1; });
            setDominantEmotion(Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]);
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (historyRecords.length) setRecordCount(historyRecords.length);
  }, [historyRecords]);

  const persona = lastResult?.flame_persona;
  const personaMeta = persona ? PERSONA_MAP[persona.archetype] : null;

  function handleClearCache() {
    Modal.confirm({
      title: "清除本地数据",
      content: "将清除所有匿名记录和缓存，此操作不可逆。",
      okText: "确认清除",
      cancelText: "取消",
      okButtonProps: { danger: true },
      onOk: () => {
        localStorage.clear();
      },
    });
  }

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <AmbientParticles config={PAGE_AMBIENCE.profile} />
      <div className="page-accent accent-profile" />
      {/* Avatar header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            margin: "0 auto 16px",
            background: "linear-gradient(135deg, var(--neon-pink), var(--neon-purple))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            boxShadow: "0 8px 32px rgba(200, 130, 150, 0.2)",
          }}
        >
          {personaMeta?.emoji || "🔥"}
        </div>
        <div style={{ fontSize: 22, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
          {isAnonymous ? "匿名焰火手" : user?.username || "焰火手"}
        </div>
        <span
          style={{
            padding: "4px 14px",
            borderRadius: 12,
            fontSize: 12,
            background: isAnonymous ? "rgba(232, 168, 124, 0.12)" : "rgba(126, 203, 138, 0.12)",
            color: isAnonymous ? "var(--neon-orange)" : "var(--temp-green)",
            border: `1px solid ${isAnonymous ? "rgba(232, 168, 124, 0.25)" : "rgba(126, 203, 138, 0.25)"}`,
          }}
        >
          {isAnonymous ? "匿名模式 · 你的隐私是首要的" : "已注册"}
        </span>
        {isAnonymous && (
          <div style={{ marginTop: 14, fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6 }}>
            你的情绪数据只保存在本地，没有人能看到
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="glass-card reveal-card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 20, color: "var(--text-secondary)" }}>
          你的情绪质地
        </div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div>
            <div className="neon-text-pink" style={{ fontSize: 32, fontWeight: 200 }}>
              {recordCount}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>次记录</div>
          </div>
          <div>
            <div className="neon-text" style={{ fontSize: 32, fontWeight: 200 }}>
              {avgTemp !== null ? `${avgTemp}°` : "--"}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>平均温度</div>
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 300, color: "var(--neon-purple)" }}>
              {dominantEmotion ? (EMOTION_LABELS_CN[dominantEmotion] || dominantEmotion) : "--"}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>常驻情绪</div>
          </div>
        </div>
      </div>

      {/* Flame persona */}
      {persona && <FlamePersonaCard persona={persona} />}

      {/* Menu items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
        <button
          className="glass-card interactive"
          onClick={() => navigate("/cbt")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
            border: "none",
            width: "100%",
            textAlign: "left",
            fontFamily: "inherit",
            color: "inherit",
          }}
        >
          <span style={{ fontSize: 28 }}>🧠</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>思维的整理术</div>
            <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>用 CBT 的方式重新看见自己的想法</div>
          </div>
          <span style={{ fontSize: 20, color: "var(--text-dim)" }}>›</span>
        </button>

        <button
          className="glass-card interactive"
          onClick={() => navigate("/crisis")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
            border: "none",
            width: "100%",
            textAlign: "left",
            fontFamily: "inherit",
            color: "inherit",
          }}
        >
          <span style={{ fontSize: 28 }}>🕯️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>当你需要一只援手</div>
            <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>热线、呼吸引导与即时支持</div>
          </div>
          <span style={{ fontSize: 20, color: "var(--text-dim)" }}>›</span>
        </button>

        <button
          className="glass-card interactive"
          onClick={handleClearCache}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
            border: "none",
            width: "100%",
            textAlign: "left",
            fontFamily: "inherit",
            color: "inherit",
          }}
        >
          <span style={{ fontSize: 28 }}>🗑️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>清除本地数据</div>
            <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>你的数据你做主</div>
          </div>
          <span style={{ fontSize: 20, color: "var(--text-dim)" }}>›</span>
        </button>
      </div>

      {/* About */}
      <div style={{ textAlign: "center", padding: "36px 0", color: "var(--text-dim)", fontSize: 13, lineHeight: 2 }}>
        <div style={{ fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>
          FLAME 情绪焰火 v0.1.0
        </div>
        基于"发疯文学"的多模态情绪识别与病耻感干预系统
        <br />
        你的隐私是我们的第一优先级
        <br />
        我们相信：每一种情绪都值得被看见
      </div>

      <div style={{ height: 80 }} />
    </div>
  );
}
