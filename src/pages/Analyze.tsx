import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useEmotionStore } from "../stores/useEmotionStore";
import { useImageUpload } from "../hooks/useImageUpload";
import AmbientParticles, { PAGE_AMBIENCE } from "../components/AmbientParticles";
import Disclaimer from "../components/Disclaimer";

const EXAMPLES = [
  "哈哈哈哈这个破班一天都上不下去了想鼠",
  "又是内耗的一天，感觉身体被掏空但又不知道在忙什么",
  "没人懂我，朋友圈发了一百条疯也没人理",
];

const AFFIRMATIONS: Record<string, string> = {
  empty: "写下来本身就是一种释放",
  short: "慢慢来，用你自己的方式表达就好",
  medium: "你正在把自己的感受说出来，这很重要",
  long: "你愿意分享这么多，说明你在认真对待自己的感受",
};

function getAffirmation(len: number): string | null {
  if (len === 0) return AFFIRMATIONS.empty;
  if (len < 20) return AFFIRMATIONS.short;
  if (len < 80) return AFFIRMATIONS.medium;
  return AFFIRMATIONS.long;
}

export default function Analyze() {
  const navigate = useNavigate();
  const { inputText, setInputText, isAnalyzing, analyze } = useEmotionStore();
  const { previewUrl, inputRef, openFilePicker, handleFileChange, removeImage } = useImageUpload();
  const [localImage, setLocalImage] = useState<File | null>(null);

  const affirmation = useMemo(() => getAffirmation(inputText.length), [inputText.length]);

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileChange(e);
      if (e.target.files?.[0]) setLocalImage(e.target.files[0]);
    },
    [handleFileChange]
  );

  const handleRemoveImage = useCallback(() => {
    removeImage();
    setLocalImage(null);
  }, [removeImage]);

  async function handleAnalyze() {
    if (!inputText.trim() && !localImage) {
      message.warning("写下你想说的，或者上传一张图片吧");
      return;
    }
    try {
      await analyze(inputText || undefined, localImage || undefined);
      navigate("/result");
    } catch (e: any) {
      message.error(e.response?.data?.detail || "分析失败，请重试");
    }
  }

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <AmbientParticles config={PAGE_AMBIENCE.analyze} />
      <div className="page-accent accent-analyze" />
      {/* Text input */}
      <div className="glass-card" style={{ marginTop: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: "var(--text-primary)" }}>
          把你想说的写下来吧
        </div>
        <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 16, lineHeight: 1.6 }}>
          没有对错，没有评判——这里是一个安全的空间
        </div>
        <textarea
          placeholder="此刻，你想对自己或这个世界说些什么..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          maxLength={500}
          autoFocus
          style={{
            width: "100%",
            minHeight: 140,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(100,100,255,0.15)",
            borderRadius: 12,
            padding: 16,
            color: "var(--text-primary)",
            fontSize: 15,
            lineHeight: 1.6,
            resize: "vertical",
            outline: "none",
            fontFamily: "inherit",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <span style={{ fontSize: 13, color: "var(--neon-cyan)", opacity: 0.8 }}>
            {affirmation}
          </span>
          <span style={{ fontSize: 13, color: "var(--text-dim)" }}>
            {inputText.length}/500
          </span>
        </div>
      </div>

      {/* Image preview */}
      {previewUrl && (
        <div className="glass-card">
          <img
            src={previewUrl}
            alt="预览"
            style={{ width: "100%", maxHeight: 300, objectFit: "contain", borderRadius: 12 }}
          />
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <button
              onClick={handleRemoveImage}
              style={{
                background: "none",
                border: "none",
                color: "var(--neon-pink)",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              ✕ 移除
            </button>
          </div>
        </div>
      )}

      {/* Input methods */}
      <div style={{ display: "flex", gap: 16, justifyContent: "center", margin: "16px 0" }}>
        <button
          className="btn-secondary"
          onClick={openFilePicker}
          style={{ flex: 1, maxWidth: 200 }}
        >
          📷 表情包
        </button>
        <button
          className="btn-secondary"
          disabled
          style={{ flex: 1, maxWidth: 200, opacity: 0.4 }}
        >
          🎤 语音（即将上线）
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={onFileChange}
        />
      </div>

      {/* Submit button */}
      <div style={{ margin: "24px 0" }}>
        {isAnalyzing ? (
          <div style={{ textAlign: "center", padding: 24 }}>
            <div className="loading-spinner" style={{ margin: "0 auto" }} />
            <div style={{ marginTop: 16, color: "var(--text-secondary)", fontSize: 14 }}>
              正在用心感受你的文字...
            </div>
          </div>
        ) : (
          <button className="btn-primary" onClick={handleAnalyze}>
            点燃情绪焰火
          </button>
        )}
      </div>

      {/* Example prompts */}
      <div style={{ marginTop: 32 }}>
        <div style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 12 }}>
          不知道怎么开口？试试这些"发疯文学"：
        </div>
        <div style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 16, opacity: 0.7 }}>
          很多人通过这种方式表达复杂的情绪，你并不孤单
        </div>
        {EXAMPLES.map((text) => (
          <button
            key={text}
            onClick={() => setInputText(text)}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(100,100,255,0.2)",
              borderRadius: 8,
              padding: "12px 16px",
              marginBottom: 8,
              color: "var(--text-secondary)",
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "background 0.2s, border-color 0.2s",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,45,149,0.3)";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(100,100,255,0.2)";
            }}
          >
            "{text}"
          </button>
        ))}
      </div>

      <Disclaimer />
    </div>
  );
}
