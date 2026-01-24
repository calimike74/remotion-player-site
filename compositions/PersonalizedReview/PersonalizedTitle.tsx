import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface PersonalizedTitleProps {
  studentName: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
}

export const PersonalizedTitle: React.FC<PersonalizedTitleProps> = ({
  studentName,
  totalScore,
  maxScore,
  percentage,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Name animation
  const nameProgress = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  // "Your Review" animation (delayed)
  const reviewProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12 },
  });

  // Score badge animation
  const scoreProgress = spring({
    frame: frame - 40,
    fps,
    config: { damping: 15 },
  });

  // Decorative line
  const lineWidth = interpolate(scoreProgress, [0, 1], [0, 300]);

  // Exit animation - starts at frame 170, completes by 210
  const exitProgress = interpolate(frame, [170, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitY = interpolate(exitProgress, [0, 1], [0, -80]);
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  // Color based on percentage
  const getScoreColor = () => {
    if (percentage >= 80) return "#22c55e"; // Green
    if (percentage >= 60) return "#eab308"; // Yellow
    return "#f97316"; // Orange
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 32,
        transform: `translateY(${exitY}px)`,
        opacity: exitOpacity,
      }}
    >
      {/* Greeting */}
      <div
        style={{
          fontSize: 48,
          fontWeight: 500,
          color: "#94a3b8",
          transform: `translateY(${interpolate(nameProgress, [0, 1], [30, 0])}px)`,
          opacity: nameProgress,
        }}
      >
        Hi {studentName}
      </div>

      {/* Main title */}
      <h1
        style={{
          fontSize: 100,
          fontWeight: 900,
          color: "#ffffff",
          margin: 0,
          letterSpacing: -2,
          transform: `translateY(${interpolate(reviewProgress, [0, 1], [50, 0])}px)`,
          opacity: reviewProgress,
          textShadow: "0 4px 40px rgba(139, 92, 246, 0.5)",
        }}
      >
        YOUR WAVEFORM REVIEW
      </h1>

      {/* Score badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          transform: `scale(${scoreProgress})`,
        }}
      >
        <div
          style={{
            backgroundColor: getScoreColor(),
            color: "#ffffff",
            padding: "16px 40px",
            borderRadius: 50,
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: 2,
            boxShadow: `0 0 30px ${getScoreColor()}88`,
          }}
        >
          {totalScore}/{maxScore}
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#94a3b8",
            fontWeight: 500,
          }}
        >
          ({percentage}%)
        </div>
      </div>

      {/* Decorative line */}
      <div
        style={{
          width: lineWidth,
          height: 4,
          background: "linear-gradient(90deg, transparent, #8b5cf6, #3b82f6, transparent)",
          borderRadius: 2,
        }}
      />

      {/* Encouragement text */}
      <div
        style={{
          fontSize: 32,
          color: "#94a3b8",
          marginTop: 20,
          opacity: scoreProgress,
        }}
      >
        Let's review the areas that tripped you up
      </div>
    </div>
  );
};
