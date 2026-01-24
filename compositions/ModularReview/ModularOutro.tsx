import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ErrorType } from "../../lib/error-segments";

// Personalized outro - 270 frames (9 seconds at 30fps)

interface ModularOutroProps {
  studentName: string;
  errors: ErrorType[];
}

export const ModularOutro: React.FC<ModularOutroProps> = ({
  studentName,
  errors,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card animation
  const cardProgress = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  // Checkmark animation
  const checkmarkProgress = spring({
    frame: frame - 40,
    fps,
    config: { damping: 10 },
  });

  // Key points animation
  const keyPointsProgress = spring({
    frame: frame - 80,
    fps,
    config: { damping: 15 },
  });

  // Badge animation
  const badgeProgress = spring({
    frame: frame - 140,
    fps,
    config: { damping: 15 },
  });

  // Exit animation - extended for longer outro
  const exitProgress = interpolate(frame, [230, 260], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  // Generate key points based on errors
  const getKeyPoints = () => {
    const points: string[] = [];

    if (errors.includes('cycle-half') || errors.includes('cycle-vague') || errors.includes('cycle-frequency')) {
      points.push('A cycle is one complete oscillation');
    }
    if (errors.includes('cycle-frequency')) {
      points.push('Frequency = cycles per second (Hz)');
    }
    if (errors.includes('pitch-loudness')) {
      points.push('Frequency → Pitch, Amplitude → Loudness');
    }
    if (errors.includes('hearing-range')) {
      points.push('Human hearing: 20Hz to 20kHz');
    }

    return points;
  };

  const keyPoints = getKeyPoints();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 30,
        opacity: exitOpacity,
        backgroundColor: "#0a0a1a",
      }}
    >
      {/* Checkmark circle */}
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          backgroundColor: "#22c55e",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${checkmarkProgress})`,
          boxShadow: "0 0 60px #22c55e66",
          opacity: cardProgress,
        }}
      >
        <svg width="60" height="60" viewBox="0 0 24 24">
          <path
            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
            fill="white"
          />
        </svg>
      </div>

      {/* Encouragement message */}
      <h2
        style={{
          fontSize: 52,
          fontWeight: 700,
          color: "#ffffff",
          margin: 0,
          textAlign: "center",
          opacity: cardProgress,
        }}
      >
        Keep at it, {studentName}!
      </h2>

      {/* Key points to remember */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          alignItems: "center",
          transform: `translateY(${interpolate(keyPointsProgress, [0, 1], [20, 0])}px)`,
          opacity: keyPointsProgress,
        }}
      >
        <p style={{ fontSize: 22, color: "#94a3b8", margin: 0 }}>
          Remember:
        </p>
        {keyPoints.map((point, index) => (
          <p
            key={index}
            style={{
              fontSize: 26,
              color: "#4ade80",
              margin: 0,
              fontWeight: 600,
            }}
          >
            {point}
          </p>
        ))}
      </div>

      {/* Topic badge */}
      <div
        style={{
          backgroundColor: "#3b82f6",
          color: "#ffffff",
          padding: "12px 32px",
          borderRadius: 50,
          fontSize: 22,
          fontWeight: 600,
          transform: `scale(${interpolate(badgeProgress, [0, 1], [0.8, 1])})`,
          opacity: badgeProgress,
        }}
      >
        Topic 2.5 Waveforms
      </div>
    </div>
  );
};
