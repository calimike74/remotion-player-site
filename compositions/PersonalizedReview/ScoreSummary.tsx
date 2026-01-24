import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface QuestionScore {
  question: string;
  topic: string;
  score: number;
  maxScore: number;
  feedback: string;
  needsReview: boolean;
}

interface ScoreSummaryProps {
  studentName: string;
  questions: QuestionScore[];
}

export const ScoreSummary: React.FC<ScoreSummaryProps> = ({ studentName, questions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header animation
  const headerProgress = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  // Exit animation - starts at frame 320, completes by 360
  const exitProgress = interpolate(frame, [320, 350], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
        opacity: exitOpacity,
      }}
    >
      {/* Header */}
      <h2
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: "#ffffff",
          marginBottom: 60,
          transform: `translateY(${interpolate(headerProgress, [0, 1], [30, 0])}px)`,
          opacity: headerProgress,
        }}
      >
        {studentName}'s Quiz Breakdown
      </h2>

      {/* Question cards */}
      <div
        style={{
          display: "flex",
          gap: 60,
          width: "100%",
          justifyContent: "center",
        }}
      >
        {questions.map((q, index) => {
          const cardProgress = spring({
            frame: frame - 20 - index * 15,
            fps,
            config: { damping: 12 },
          });

          const barProgress = spring({
            frame: frame - 60 - index * 15,
            fps,
            config: { damping: 20 },
          });

          const percentage = (q.score / q.maxScore) * 100;
          const barColor = q.needsReview ? "#f97316" : "#22c55e";

          return (
            <div
              key={index}
              style={{
                backgroundColor: "#1e293b",
                borderRadius: 24,
                padding: 40,
                width: 500,
                transform: `translateY(${interpolate(cardProgress, [0, 1], [50, 0])}px)`,
                opacity: cardProgress,
                border: q.needsReview ? "3px solid #f97316" : "3px solid #22c55e",
              }}
            >
              {/* Question number */}
              <div
                style={{
                  fontSize: 24,
                  color: "#64748b",
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                QUESTION {index + 1}
              </div>

              {/* Topic */}
              <div
                style={{
                  fontSize: 32,
                  color: "#ffffff",
                  fontWeight: 700,
                  marginBottom: 24,
                }}
              >
                {q.topic}
              </div>

              {/* Score */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <span
                  style={{
                    fontSize: 64,
                    fontWeight: 900,
                    color: barColor,
                  }}
                >
                  {q.score}
                </span>
                <span
                  style={{
                    fontSize: 32,
                    color: "#64748b",
                  }}
                >
                  / {q.maxScore}
                </span>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  width: "100%",
                  height: 16,
                  backgroundColor: "#334155",
                  borderRadius: 8,
                  overflow: "hidden",
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    width: `${percentage * barProgress}%`,
                    height: "100%",
                    backgroundColor: barColor,
                    borderRadius: 8,
                  }}
                />
              </div>

              {/* Feedback */}
              <div
                style={{
                  fontSize: 24,
                  color: "#94a3b8",
                  lineHeight: 1.5,
                }}
              >
                {q.feedback}
              </div>

              {/* Status badge */}
              <div
                style={{
                  marginTop: 20,
                  display: "inline-block",
                  padding: "8px 20px",
                  borderRadius: 20,
                  fontSize: 18,
                  fontWeight: 600,
                  backgroundColor: q.needsReview ? "#7c2d1233" : "#14532d33",
                  color: q.needsReview ? "#fb923c" : "#4ade80",
                }}
              >
                {q.needsReview ? "NEEDS REVIEW" : "UNDERSTOOD"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
