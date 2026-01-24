import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Addresses: Student thinks pitch = loudness
// Duration: 540 frames (18 seconds at 30fps)

export const ErrorPitchLoudness: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  // High frequency wave animation
  const highFreqProgress = interpolate(frame, [30, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Low frequency wave animation
  const lowFreqProgress = interpolate(frame, [160, 280], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Labels animation
  const pitchLabelProgress = spring({
    frame: frame - 300,
    fps,
    config: { damping: 15 },
  });

  // Amplitude demonstration
  const amplitudeProgress = interpolate(frame, [340, 420], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Comparison cards
  const comparisonProgress = spring({
    frame: frame - 440,
    fps,
    config: { damping: 15 },
  });

  // Exit animation - extended to match longer segment duration
  const exitProgress = interpolate(frame, [590, 620], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  // Wave generation
  const centerY = 160;
  const startX = 150;
  const waveLength = 400;

  const generateWave = (progress: number, frequency: number, amplitude: number, yOffset: number) => {
    const points = [];
    for (let x = 0; x <= waveLength * progress; x += 2) {
      const normalizedX = x / waveLength;
      const y = yOffset - amplitude * Math.sin(normalizedX * Math.PI * 2 * frequency);
      points.push(`${x + startX},${y}`);
    }
    return points.join(" ");
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        padding: 60,
        opacity: exitOpacity,
        backgroundColor: "#0a0a1a",
      }}
    >
      {/* Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginBottom: 30,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [30, 0])}px)`,
          opacity: titleProgress,
        }}
      >
        <div
          style={{
            backgroundColor: "#f97316",
            padding: "10px 24px",
            borderRadius: 30,
            fontSize: 22,
            fontWeight: 700,
            color: "#ffffff",
          }}
        >
          COMMON ERROR
        </div>
        <h2
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
          }}
        >
          Pitch vs Loudness
        </h2>
      </div>

      {/* Visualization */}
      <div style={{ display: "flex", gap: 60 }}>
        {/* Left side: Frequency → Pitch */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 22,
              color: "#8b5cf6",
              fontWeight: 700,
              marginBottom: 15,
              opacity: titleProgress,
            }}
          >
            FREQUENCY → PITCH
          </div>

          <svg width="550" height="300" style={{ backgroundColor: "#0f172a", borderRadius: 12 }}>
            {/* High frequency wave (high pitch) */}
            <text x={20} y={60} fontSize="18" fill="#4ade80">High frequency = High pitch</text>
            <line x1={startX - 20} y1={100} x2={startX + waveLength + 20} y2={100} stroke="#334155" strokeWidth="1" />
            <polyline
              points={generateWave(highFreqProgress, 4, 35, 100)}
              fill="none"
              stroke="#4ade80"
              strokeWidth="3"
            />

            {/* Low frequency wave (low pitch) */}
            <text x={20} y={180} fontSize="18" fill="#3b82f6">Low frequency = Low pitch</text>
            <line x1={startX - 20} y1={220} x2={startX + waveLength + 20} y2={220} stroke="#334155" strokeWidth="1" />
            <polyline
              points={generateWave(lowFreqProgress, 1, 35, 220)}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
            />

            {/* Label */}
            {pitchLabelProgress > 0 && (
              <text
                x={275}
                y={280}
                fontSize="20"
                fill="#8b5cf6"
                textAnchor="middle"
                fontWeight="bold"
                opacity={pitchLabelProgress}
              >
                More waves = Higher pitch
              </text>
            )}
          </svg>
        </div>

        {/* Right side: Amplitude → Loudness */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 22,
              color: "#ec4899",
              fontWeight: 700,
              marginBottom: 15,
              opacity: amplitudeProgress > 0.1 ? 1 : 0,
            }}
          >
            AMPLITUDE → LOUDNESS
          </div>

          <svg width="550" height="300" style={{ backgroundColor: "#0f172a", borderRadius: 12, opacity: amplitudeProgress > 0.1 ? 1 : 0.3 }}>
            {/* High amplitude wave (loud) */}
            <text x={20} y={45} fontSize="18" fill="#f97316">High amplitude = Loud</text>
            <line x1={startX - 20} y1={100} x2={startX + waveLength + 20} y2={100} stroke="#334155" strokeWidth="1" />
            <polyline
              points={generateWave(amplitudeProgress, 2, 50, 100)}
              fill="none"
              stroke="#f97316"
              strokeWidth="3"
            />

            {/* Low amplitude wave (quiet) */}
            <text x={20} y={180} fontSize="18" fill="#fbbf24">Low amplitude = Quiet</text>
            <line x1={startX - 20} y1={220} x2={startX + waveLength + 20} y2={220} stroke="#334155" strokeWidth="1" />
            <polyline
              points={generateWave(amplitudeProgress, 2, 15, 220)}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="3"
            />

            {/* Label */}
            {amplitudeProgress >= 1 && (
              <text
                x={275}
                y={280}
                fontSize="20"
                fill="#ec4899"
                textAnchor="middle"
                fontWeight="bold"
              >
                Taller waves = Louder sound
              </text>
            )}
          </svg>
        </div>
      </div>

      {/* Comparison cards */}
      <div
        style={{
          display: "flex",
          gap: 40,
          marginTop: 30,
          transform: `translateY(${interpolate(comparisonProgress, [0, 1], [30, 0])}px)`,
          opacity: comparisonProgress,
        }}
      >
        <div
          style={{
            flex: 1,
            backgroundColor: "#1e1b4b33",
            border: "2px solid #8b5cf6",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <div style={{ fontSize: 28, color: "#8b5cf6", fontWeight: 700 }}>
            PITCH
          </div>
          <div style={{ fontSize: 20, color: "#ffffff", marginTop: 8 }}>
            How high or low a sound is
          </div>
          <div style={{ fontSize: 18, color: "#a5b4fc", marginTop: 4 }}>
            Determined by <strong>frequency</strong>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            backgroundColor: "#4a1d4633",
            border: "2px solid #ec4899",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <div style={{ fontSize: 28, color: "#ec4899", fontWeight: 700 }}>
            LOUDNESS
          </div>
          <div style={{ fontSize: 20, color: "#ffffff", marginTop: 8 }}>
            How quiet or loud a sound is
          </div>
          <div style={{ fontSize: 18, color: "#f9a8d4", marginTop: 4 }}>
            Determined by <strong>amplitude</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
