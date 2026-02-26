"use client";

import type { SessionState } from "../lib/adaptive-engine";
import { calculateLevel, getLevelFeedback } from "../lib/adaptive-engine";

interface Props {
  session: SessionState;
  topic: string;
  onRestart: () => void;
  onBackToLibrary: () => void;
}

export function SessionSummary({ session, topic, onRestart, onBackToLibrary }: Props) {
  const { level, weightedScore, totalCorrect, totalQuestions } = calculateLevel(session);
  const feedback = getLevelFeedback(level, topic);

  // Build per-checkpoint breakdown
  const checkpointBreakdown = session.answers.reduce<
    Record<number, { correct: number; total: number; difficulty: number }>
  >((acc, a) => {
    if (!acc[a.checkpointIndex]) acc[a.checkpointIndex] = { correct: 0, total: 0, difficulty: 0 };
    acc[a.checkpointIndex].total++;
    acc[a.checkpointIndex].difficulty = a.difficulty;
    if (a.correct) acc[a.checkpointIndex].correct++;
    return acc;
  }, {});

  // Level bar segments
  const levelColors = ["", "#ef4444", "#f59e0b", "#eab308", "#22c55e", "#3b82f6"];

  return (
    <div style={{ padding: "40px 20px", maxWidth: "600px", margin: "0 auto" }}>
      {/* Level badge */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ fontSize: "64px", marginBottom: "12px" }}>{feedback.emoji}</div>
        <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#f1f5f9", marginBottom: "4px" }}>
          Level {level}: {feedback.label}
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "15px" }}>{feedback.message}</p>
      </div>

      {/* Level progress bar */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "32px" }}>
        {[1, 2, 3, 4, 5].map((l) => (
          <div
            key={l}
            style={{
              flex: 1,
              height: "8px",
              borderRadius: "4px",
              backgroundColor: l <= level ? levelColors[l] : "rgba(255,255,255,0.1)",
              transition: "background-color 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Score */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "20px",
          backgroundColor: "rgba(255,255,255,0.05)",
          borderRadius: "12px",
          marginBottom: "24px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#f1f5f9" }}>
            {totalCorrect}/{totalQuestions}
          </div>
          <div style={{ fontSize: "13px", color: "#94a3b8" }}>Correct</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#f1f5f9" }}>
            {Math.round(weightedScore * 100)}%
          </div>
          <div style={{ fontSize: "13px", color: "#94a3b8" }}>Weighted Score</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#f1f5f9" }}>
            {session.currentDifficulty}
          </div>
          <div style={{ fontSize: "13px", color: "#94a3b8" }}>Final Difficulty</div>
        </div>
      </div>

      {/* Checkpoint breakdown */}
      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#94a3b8", marginBottom: "12px" }}>
          Checkpoint Breakdown
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {Object.entries(checkpointBreakdown).map(([cp, data]) => (
            <div
              key={cp}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                backgroundColor: "rgba(255,255,255,0.05)",
                borderRadius: "8px",
              }}
            >
              <span style={{ color: "#e2e8f0", fontSize: "14px" }}>Checkpoint {Number(cp) + 1}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{
                    fontSize: "12px",
                    color: ["", "#22c55e", "#f59e0b", "#ef4444"][data.difficulty],
                    opacity: 0.7,
                  }}
                >
                  Lvl {data.difficulty}
                </span>
                <span
                  style={{
                    fontWeight: 600,
                    color: data.correct === data.total ? "#22c55e" : data.correct === 0 ? "#ef4444" : "#f59e0b",
                  }}
                >
                  {data.correct}/{data.total}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next steps */}
      <div
        style={{
          padding: "20px",
          borderRadius: "12px",
          backgroundColor: "rgba(59,130,246,0.1)",
          border: "1px solid rgba(59,130,246,0.2)",
          marginBottom: "32px",
        }}
      >
        <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#93c5fd", marginBottom: "8px" }}>
          What to do next
        </h3>
        <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.6 }}>{feedback.nextSteps}</p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={onRestart}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "10px",
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#e2e8f0",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
        <button
          onClick={onBackToLibrary}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "10px",
            backgroundColor: "#3b82f6",
            border: "none",
            color: "#ffffff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Back to Library
        </button>
      </div>
    </div>
  );
}
