"use client";

import { useState, useCallback, useRef } from "react";
import type { CheckpointQuestion } from "../lib/checkpoint-questions";

interface Props {
  question: CheckpointQuestion;
  checkpointIndex: number;
  totalCheckpoints: number;
  currentDifficulty: number;
  onAnswer: (selectedIndex: number, correct: boolean, timeTakenMs: number) => void;
}

export function AdaptiveQuizOverlay({
  question,
  checkpointIndex,
  totalCheckpoints,
  currentDifficulty,
  onAnswer,
}: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const startTimeRef = useRef(Date.now());

  const handleSelect = useCallback(
    (index: number) => {
      if (revealed) return;
      setSelected(index);
    },
    [revealed],
  );

  const handleConfirm = useCallback(() => {
    if (selected === null) return;
    const timeTaken = Date.now() - startTimeRef.current;
    const correct = selected === question.correctIndex;
    setRevealed(true);

    // Short delay so the student sees the feedback before moving on
    setTimeout(() => {
      onAnswer(selected, correct, timeTaken);
    }, 2200);
  }, [selected, question.correctIndex, onAnswer]);

  const difficultyLabel = ["", "Foundation", "Intermediate", "Advanced"][currentDifficulty] ?? "";
  const difficultyColor = ["", "#22c55e", "#f59e0b", "#ef4444"][currentDifficulty] ?? "#f59e0b";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      <div
        style={{
          backgroundColor: "#1e293b",
          borderRadius: "16px",
          padding: "32px",
          maxWidth: "640px",
          width: "90%",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <span style={{ fontSize: "14px", color: "#94a3b8" }}>
            Checkpoint {checkpointIndex + 1} of {totalCheckpoints}
          </span>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "9999px",
              backgroundColor: `${difficultyColor}20`,
              color: difficultyColor,
              border: `1px solid ${difficultyColor}40`,
            }}
          >
            {difficultyLabel}
          </span>
        </div>

        {/* Question */}
        <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#f1f5f9", lineHeight: 1.5, marginBottom: "24px" }}>
          {question.question}
        </h3>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
          {question.options.map((option, i) => {
            let bgColor = "rgba(255,255,255,0.05)";
            let borderColor = "rgba(255,255,255,0.1)";
            let textColor = "#e2e8f0";

            if (revealed) {
              if (i === question.correctIndex) {
                bgColor = "rgba(34,197,94,0.15)";
                borderColor = "#22c55e";
                textColor = "#22c55e";
              } else if (i === selected && i !== question.correctIndex) {
                bgColor = "rgba(239,68,68,0.15)";
                borderColor = "#ef4444";
                textColor = "#ef4444";
              }
            } else if (i === selected) {
              bgColor = "rgba(59,130,246,0.15)";
              borderColor = "#3b82f6";
              textColor = "#93c5fd";
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={revealed}
                style={{
                  textAlign: "left",
                  padding: "14px 18px",
                  borderRadius: "10px",
                  backgroundColor: bgColor,
                  border: `1px solid ${borderColor}`,
                  color: textColor,
                  fontSize: "15px",
                  cursor: revealed ? "default" : "pointer",
                  transition: "all 0.15s ease",
                  lineHeight: 1.4,
                }}
              >
                <span style={{ fontWeight: 600, marginRight: "10px", opacity: 0.5 }}>
                  {String.fromCharCode(65 + i)}.
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {/* Explanation (shown after reveal) */}
        {revealed && (
          <div
            style={{
              padding: "16px",
              borderRadius: "10px",
              backgroundColor: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.2)",
              marginBottom: "20px",
              animation: "fadeIn 0.3s ease-out",
            }}
          >
            <p style={{ fontSize: "14px", color: "#93c5fd", lineHeight: 1.5 }}>
              {question.explanation}
            </p>
          </div>
        )}

        {/* Confirm button (before reveal) */}
        {!revealed && (
          <button
            onClick={handleConfirm}
            disabled={selected === null}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              backgroundColor: selected !== null ? "#3b82f6" : "#334155",
              color: selected !== null ? "#ffffff" : "#64748b",
              fontWeight: 600,
              fontSize: "15px",
              border: "none",
              cursor: selected !== null ? "pointer" : "not-allowed",
              transition: "all 0.15s ease",
            }}
          >
            {selected !== null ? "Check Answer" : "Select an answer"}
          </button>
        )}

        {/* Feedback (after reveal) */}
        {revealed && (
          <div style={{ textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>
            {selected === question.correctIndex ? "✓ Correct!" : "✗ Not quite."} Continuing...
          </div>
        )}
      </div>
    </div>
  );
}
