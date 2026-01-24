import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Addresses: Student thinks peak→trough is a full cycle
// Duration: 540 frames (18 seconds at 30fps)

export const ErrorCycleHalf: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  // Waveform animation - draws the wave
  const waveProgress = interpolate(frame, [30, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Half cycle highlight (the wrong answer)
  const halfCycleProgress = interpolate(frame, [200, 260], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Full cycle highlight (the correct answer)
  const fullCycleProgress = interpolate(frame, [300, 360], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Correct answer text reveal
  const correctProgress = spring({
    frame: frame - 380,
    fps,
    config: { damping: 15 },
  });

  // Exit animation - extended to match longer segment duration
  const exitProgress = interpolate(frame, [590, 620], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  // Waveform constants
  const waveStartX = 300;
  const cycleWidth = 600;
  const centerY = 200;
  const amplitude = 90;

  // Key positions
  const startX = waveStartX;
  const peakX = waveStartX + cycleWidth * 0.25;
  const midX = waveStartX + cycleWidth * 0.5;
  const troughX = waveStartX + cycleWidth * 0.75;
  const endX = waveStartX + cycleWidth;

  // Generate sine wave points
  const generateWavePoints = (progress: number) => {
    const points = [];
    const totalWidth = cycleWidth * 1.2;
    for (let x = 0; x <= totalWidth * progress; x += 2) {
      const normalizedX = x / cycleWidth;
      const y = centerY - amplitude * Math.sin(normalizedX * Math.PI * 2);
      points.push(`${x + waveStartX},${y}`);
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
          Understanding a Full Cycle
        </h2>
      </div>

      {/* The common error description */}
      <div
        style={{
          backgroundColor: "#7c2d1233",
          border: "2px solid #f97316",
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          maxWidth: 900,
          opacity: titleProgress,
        }}
      >
        <div style={{ fontSize: 18, color: "#fb923c", fontWeight: 600, marginBottom: 8 }}>
          THE MISTAKE
        </div>
        <div style={{ fontSize: 24, color: "#fcd34d" }}>
          Describing peak to trough as a complete cycle
        </div>
      </div>

      {/* Waveform visualization */}
      <div style={{ position: "relative", height: 380, marginBottom: 20 }}>
        <svg width="1920" height="380" style={{ position: "absolute", top: 0, left: 0 }}>
          {/* Grid lines */}
          <line x1={waveStartX - 40} y1={centerY} x2={endX + 100} y2={centerY} stroke="#334155" strokeWidth="2" />
          <line x1={waveStartX - 40} y1={centerY - amplitude} x2={endX + 100} y2={centerY - amplitude} stroke="#334155" strokeWidth="1" strokeDasharray="5,5" />
          <line x1={waveStartX - 40} y1={centerY + amplitude} x2={endX + 100} y2={centerY + amplitude} stroke="#334155" strokeWidth="1" strokeDasharray="5,5" />

          {/* Axis labels */}
          <text x={waveStartX - 70} y={centerY - amplitude + 5} fontSize="16" fill="#64748b">Peak</text>
          <text x={waveStartX - 50} y={centerY + 5} fontSize="16" fill="#64748b">0</text>
          <text x={waveStartX - 85} y={centerY + amplitude + 5} fontSize="16" fill="#64748b">Trough</text>

          {/* Half cycle highlight - WRONG */}
          {halfCycleProgress > 0 && (
            <>
              <rect
                x={peakX}
                y={centerY - amplitude - 15}
                width={(troughX - peakX) * halfCycleProgress}
                height={amplitude * 2 + 30}
                fill="#f9731633"
                stroke="#f97316"
                strokeWidth="2"
                strokeDasharray="8,4"
                rx="8"
              />
              <text
                x={(peakX + troughX) / 2}
                y={centerY + amplitude + 55}
                fontSize="24"
                fill="#fb923c"
                textAnchor="middle"
                fontWeight="bold"
                opacity={halfCycleProgress}
              >
                HALF CYCLE ONLY
              </text>
            </>
          )}

          {/* Full cycle highlight - CORRECT */}
          {fullCycleProgress > 0 && (
            <>
              <rect
                x={startX}
                y={centerY - amplitude - 25}
                width={cycleWidth * fullCycleProgress}
                height={amplitude * 2 + 50}
                fill="#22c55e22"
                stroke="#22c55e"
                strokeWidth="3"
                rx="8"
              />
              <text
                x={startX + cycleWidth / 2}
                y={centerY - amplitude - 40}
                fontSize="28"
                fill="#4ade80"
                textAnchor="middle"
                fontWeight="bold"
                opacity={fullCycleProgress}
              >
                ONE FULL CYCLE
              </text>
            </>
          )}

          {/* The waveform */}
          <polyline
            points={generateWavePoints(waveProgress)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="5"
          />

          {/* Key point markers */}
          {waveProgress > 0 && (
            <circle cx={startX} cy={centerY} r="10" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
          )}
          {waveProgress > 0.25 && (
            <>
              <circle cx={peakX} cy={centerY - amplitude} r="10" fill="#8b5cf6" stroke="#fff" strokeWidth="2" />
              <text x={peakX} y={centerY - amplitude - 20} fontSize="16" fill="#8b5cf6" textAnchor="middle" fontWeight="bold">PEAK</text>
            </>
          )}
          {waveProgress > 0.75 && (
            <>
              <circle cx={troughX} cy={centerY + amplitude} r="10" fill="#ec4899" stroke="#fff" strokeWidth="2" />
              <text x={troughX} y={centerY + amplitude + 30} fontSize="16" fill="#ec4899" textAnchor="middle" fontWeight="bold">TROUGH</text>
            </>
          )}
          {waveProgress >= 1 && fullCycleProgress > 0 && (
            <>
              <circle cx={endX} cy={centerY} r="10" fill="#22c55e" stroke="#fff" strokeWidth="2" />
              <text x={endX} y={centerY + 35} fontSize="16" fill="#22c55e" textAnchor="middle" fontWeight="bold">BACK TO START</text>
            </>
          )}
        </svg>
      </div>

      {/* Correct answer */}
      <div
        style={{
          backgroundColor: "#14532d33",
          border: "2px solid #22c55e",
          borderRadius: 16,
          padding: 24,
          maxWidth: 1000,
          transform: `translateY(${interpolate(correctProgress, [0, 1], [30, 0])}px)`,
          opacity: correctProgress,
        }}
      >
        <div style={{ fontSize: 18, color: "#4ade80", fontWeight: 600, marginBottom: 8 }}>
          REMEMBER
        </div>
        <div style={{ fontSize: 26, color: "#ffffff", lineHeight: 1.5 }}>
          A full cycle returns to the <span style={{ color: "#4ade80", fontWeight: 700 }}>starting point</span>.
          Peak → Trough is only half the journey!
        </div>
      </div>
    </div>
  );
};
