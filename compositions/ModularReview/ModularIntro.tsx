import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Personalized intro - 330 frames (11 seconds at 30fps, includes buffer)

interface ModularIntroProps {
  studentName: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  errorCount: number;
}

export const ModularIntro: React.FC<ModularIntroProps> = ({
  studentName,
  totalScore,
  maxScore,
  percentage,
  errorCount,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  // Score animation
  const scoreProgress = spring({
    frame: frame - 60,
    fps,
    config: { damping: 15 },
  });

  // Message animation
  const messageProgress = spring({
    frame: frame - 120,
    fps,
    config: { damping: 15 },
  });

  // Exit animation - extended for buffer
  const exitProgress = interpolate(frame, [290, 320], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  // Score color based on percentage
  const getScoreColor = () => {
    if (percentage >= 60) return "#22c55e";
    if (percentage >= 40) return "#f97316";
    return "#ef4444";
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
        gap: 40,
        opacity: exitOpacity,
        backgroundColor: "#0a0a1a",
      }}
    >
      {/* Welcome message */}
      <div
        style={{
          transform: `translateY(${interpolate(titleProgress, [0, 1], [30, 0])}px)`,
          opacity: titleProgress,
        }}
      >
        <h1
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
            textAlign: "center",
          }}
        >
          Hi {studentName}
        </h1>
        <p
          style={{
            fontSize: 28,
            color: "#94a3b8",
            margin: 0,
            marginTop: 10,
            textAlign: "center",
          }}
        >
          Let's review your waveform quiz
        </p>
      </div>

      {/* Score display */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 30,
          transform: `scale(${interpolate(scoreProgress, [0, 1], [0.8, 1])})`,
          opacity: scoreProgress,
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            backgroundColor: "#1e293b",
            border: `6px solid ${getScoreColor()}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 700, color: getScoreColor() }}>
            {percentage}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: 32, color: "#ffffff", fontWeight: 600 }}>
            {totalScore} / {maxScore}
          </div>
          <div style={{ fontSize: 20, color: "#94a3b8" }}>
            Topic 2.5 Waveforms
          </div>
        </div>
      </div>

      {/* Review message */}
      <div
        style={{
          backgroundColor: "#1e3a5f33",
          border: "2px solid #3b82f6",
          borderRadius: 16,
          padding: 24,
          maxWidth: 700,
          textAlign: "center",
          transform: `translateY(${interpolate(messageProgress, [0, 1], [30, 0])}px)`,
          opacity: messageProgress,
        }}
      >
        <div style={{ fontSize: 24, color: "#ffffff" }}>
          We'll focus on <span style={{ color: "#3b82f6", fontWeight: 700 }}>{errorCount} key concept{errorCount !== 1 ? 's' : ''}</span> that need attention
        </div>
      </div>
    </div>
  );
};
