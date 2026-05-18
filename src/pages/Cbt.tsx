import { useState } from "react";
import { useEmotionStore } from "../stores/useEmotionStore";
import AmbientParticles, { PAGE_AMBIENCE } from "../components/AmbientParticles";
import { DISTORTIONS } from "../constants";

export default function Cbt() {
  const { lastResult } = useEmotionStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [situation, setSituation] = useState("");
  const [selectedDistortions, setSelectedDistortions] = useState<string[]>([]);
  const [automaticThought, setAutomaticThought] = useState("");
  const [evidenceFor, setEvidenceFor] = useState("");
  const [evidenceAgainst, setEvidenceAgainst] = useState("");
  const [alternativeThought, setAlternativeThought] = useState("");

  function toggleDistortion(key: string) {
    setSelectedDistortions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  function nextStep() {
    if (step < 4) setStep((s) => (s + 1) as 1 | 2 | 3 | 4);
  }

  function prevStep() {
    if (step > 1) setStep((s) => (s - 1) as 1 | 2 | 3 | 4);
  }

  function handleReset() {
    setStep(1);
    setSituation("");
    setSelectedDistortions([]);
    setAutomaticThought("");
    setEvidenceFor("");
    setEvidenceAgainst("");
    setAlternativeThought("");
  }

  function useLastResult() {
    if (!lastResult) return;
    if (lastResult.automatic_thought) setAutomaticThought(lastResult.automatic_thought);
    if (lastResult.cognitive_distortions?.length > 0) {
      setSelectedDistortions(lastResult.cognitive_distortions);
    }
    if (lastResult.alternative_thought) setAlternativeThought(lastResult.alternative_thought);
  }

  const stepLabels = ["描述情境", "自动思维", "检验证据", "替代思维"];
  const stepAffirmations = [
    "愿意面对就已经迈出了第一步",
    "你正在听见自己内心的声音",
    "事实和感受有时并不相同，这没关系",
    "新的视角需要时间，你做得很好",
  ];

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <AmbientParticles config={PAGE_AMBIENCE.cbt} />
      <div className="page-accent accent-cbt" />
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px" }}>
          思维的整理术
        </h2>
        <p style={{ fontSize: 13, color: "var(--text-dim)", margin: 0, lineHeight: 1.6 }}>
          我们的想法有时会欺骗我们，停下来审视它们，是一种对自我的善意
        </p>
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 8 }}>
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: step >= s ? "linear-gradient(135deg, var(--neon-pink), var(--neon-purple))" : "rgba(255,255,255,0.04)",
              border: step >= s ? "none" : "1px solid rgba(255,255,255,0.08)",
              color: step >= s ? "#fff" : "var(--text-dim)",
              fontWeight: 600,
              fontSize: 14,
              boxShadow: step >= s ? "0 0 16px rgba(232, 136, 142, 0.3)" : "none",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {s}
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", fontSize: 12, color: "var(--text-dim)", marginBottom: 24 }}>
        {stepLabels[step - 1]}
      </div>

      {/* Step affirmation */}
      <div className="affirmation-tag" style={{ display: "block", textAlign: "center", marginBottom: 20 }}>
        {stepAffirmations[step - 1]}
      </div>

      {/* Pre-fill hint */}
      {lastResult && step === 1 && (
        <div
          onClick={useLastResult}
          style={{
            padding: "14px 18px",
            marginBottom: 18,
            background: "rgba(232, 136, 142, 0.04)",
            border: "1px solid rgba(232, 136, 142, 0.15)",
            borderRadius: 10,
            cursor: "pointer",
            fontSize: 13,
            color: "var(--neon-pink)",
            textAlign: "center",
            transition: "background 0.3s ease",
          }}
        >
          💡 从上次的分析结果中，把自动思维和替代思维带过来
        </div>
      )}

      {/* Step 1: Situation */}
      {step === 1 && (
        <div className="glass-card cbt-step-enter">
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: "var(--text-primary)" }}>
            第一步：描述情境
          </div>
          <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 12, lineHeight: 1.6 }}>
            发生了什么？放轻松，用你自己的话来讲就好
          </div>
          <textarea
            className="cbt-textarea"
            placeholder="写下具体的情境，比如：'老板在会议上批评了我的方案...'"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            maxLength={500}
            style={{
              width: "100%",
              minHeight: 100,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(100,100,255,0.15)",
              borderRadius: 12,
              padding: 12,
              color: "var(--text-primary)",
              fontSize: 14,
              lineHeight: 1.6,
              resize: "vertical",
              outline: "none",
              fontFamily: "inherit",
            }}
          />
          <div style={{ textAlign: "right", fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>
            {situation.length}/500
          </div>

          <div style={{ marginTop: 16, fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
            识别认知扭曲（可多选）
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {DISTORTIONS.map((d) => (
              <button
                key={d.key}
                onClick={() => toggleDistortion(d.key)}
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: selectedDistortions.includes(d.key)
                    ? "1px solid var(--neon-purple)"
                    : "1px solid rgba(100,100,255,0.1)",
                  background: selectedDistortions.includes(d.key)
                    ? "rgba(179,71,234,0.12)"
                    : "rgba(255,255,255,0.02)",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: selectedDistortions.includes(d.key) ? "var(--neon-purple)" : "var(--text-secondary)" }}>
                  {d.label}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>
                  {d.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Automatic thought */}
      {step === 2 && (
        <div className="glass-card cbt-step-enter">
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: "var(--text-primary)" }}>
            第二步：自动思维
          </div>
          <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 12, lineHeight: 1.6 }}>
            在那个情境下，你脑海里第一个跳出来的念头是什么？不需要评判它，只是把它写下来就好
          </div>
          <textarea
            placeholder="写下你的自动思维，比如：'我什么都做不好，我肯定要被开除了'"
            value={automaticThought}
            onChange={(e) => setAutomaticThought(e.target.value)}
            maxLength={500}
            style={{
              width: "100%",
              minHeight: 100,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(100,100,255,0.15)",
              borderRadius: 12,
              padding: 12,
              color: "var(--text-primary)",
              fontSize: 14,
              lineHeight: 1.6,
              resize: "vertical",
              outline: "none",
              fontFamily: "inherit",
            }}
          />
          <div style={{ textAlign: "right", fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>
            {automaticThought.length}/500
          </div>
        </div>
      )}

      {/* Step 3: Evidence */}
      {step === 3 && (
        <div className="glass-card cbt-step-enter">
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: "var(--text-primary)" }}>
            第三步：检验证据
          </div>
          <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 16, lineHeight: 1.6 }}>
            试试看，像一位友善的侦探那样，分别寻找支持和反对这个想法的证据
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--neon-orange)", marginBottom: 6 }}>
              支持这个想法的证据
            </div>
            <textarea
              placeholder="有什么事实支持这个想法？"
              value={evidenceFor}
              onChange={(e) => setEvidenceFor(e.target.value)}
              maxLength={300}
              style={{
                width: "100%",
                minHeight: 80,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,145,0,0.2)",
                borderRadius: 12,
                padding: 12,
                color: "var(--text-primary)",
                fontSize: 14,
                lineHeight: 1.6,
                resize: "vertical",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--temp-green)", marginBottom: 6 }}>
              反对这个想法的证据
            </div>
            <textarea
              placeholder="有什么事实不支持这个想法？"
              value={evidenceAgainst}
              onChange={(e) => setEvidenceAgainst(e.target.value)}
              maxLength={300}
              style={{
                width: "100%",
                minHeight: 80,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(0,230,118,0.2)",
                borderRadius: 12,
                padding: 12,
                color: "var(--text-primary)",
                fontSize: 14,
                lineHeight: 1.6,
                resize: "vertical",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>
      )}

      {/* Step 4: Alternative thought */}
      {step === 4 && (
        <div className="glass-card cbt-step-enter">
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: "var(--text-primary)" }}>
            第四步：替代思维
          </div>
          <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 12, lineHeight: 1.6 }}>
            基于你找到的证据，尝试写下一个更平衡、更友善的想法——就像你在安慰一位好朋友那样
          </div>
          <textarea
            placeholder="比如：'虽然这一次方案被否决了，但这只代表这一个方案需要调整...'"
            value={alternativeThought}
            onChange={(e) => setAlternativeThought(e.target.value)}
            maxLength={500}
            style={{
              width: "100%",
              minHeight: 100,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(100,100,255,0.15)",
              borderRadius: 12,
              padding: 12,
              color: "var(--text-primary)",
              fontSize: 14,
              lineHeight: 1.6,
              resize: "vertical",
              outline: "none",
              fontFamily: "inherit",
            }}
          />

          {/* Summary */}
          {situation && automaticThought && alternativeThought && (
            <div
              style={{
                marginTop: 24,
                padding: 20,
                background: "rgba(126, 200, 200, 0.03)",
                borderRadius: 12,
                border: "1px solid rgba(126, 200, 200, 0.12)",
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
                你已经完成了思维的整理
              </div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 16 }}>
                这并不容易，但你做到了。每一次练习都是在强化你的心理韧性。
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 4 }}>情境</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{situation}</div>
              </div>

              {selectedDistortions.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 4 }}>认知扭曲</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {selectedDistortions.map((k) => {
                      const d = DISTORTIONS.find((dd) => dd.key === k);
                      return (
                        <span
                          key={k}
                          style={{
                            padding: "3px 10px",
                            borderRadius: 10,
                            fontSize: 12,
                            background: "rgba(179,71,234,0.1)",
                            color: "var(--neon-purple)",
                          }}
                        >
                          {d?.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 4 }}>自动思维</div>
                <div style={{ fontSize: 13, color: "var(--temp-red)" }}>{automaticThought}</div>
              </div>

              <div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 4 }}>替代思维</div>
                <div style={{ fontSize: 13, color: "var(--temp-green)" }}>{alternativeThought}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
        {step > 1 ? (
          <button className="btn-secondary" onClick={prevStep} style={{ flex: 1 }}>
            ← 上一步
          </button>
        ) : (
          <div style={{ flex: 1 }} />
        )}
        {step < 4 ? (
          <button className="btn-primary" onClick={nextStep} style={{ flex: 1, maxWidth: 300 }}>
            继续下一步
          </button>
        ) : (
          <button className="btn-primary" onClick={handleReset} style={{ flex: 1, maxWidth: 300 }}>
            再练习一次
          </button>
        )}
      </div>

      <div style={{ height: 60 }} />
    </div>
  );
}
