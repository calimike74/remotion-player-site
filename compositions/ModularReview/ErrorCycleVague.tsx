import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Addresses: Student gave vague or missing cycle definition
// Duration: 540 frames (18 seconds at 30fps)

export const ErrorCycleVague: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  // Waveform animation - draws the wave with key point labels
  const waveProgress = interpolate(frame, [30, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Step-by-step labels
  const step1Progress = interpolate(frame, [220, 260], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const step2Progress = interpolate(frame, [270, 310], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const step3Progress = interpolate(frame, [320, 360], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const step4Progress = interpolate(frame, [370, 410], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Definition reveal
  const definitionProgress = spring({
    frame: frame - 430,
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
  const waveStartX = 350;
  const cycleWidth = 550;
  const centerY = 220;
  const amplitude = 80;

  // Key positions
  const startX = waveStartX;
  const peakX = waveStartX + cycleWidth * 0.25;
  const midX = waveStartX + cycleWidth * 0.5;
  const troughX = waveStartX + cycleWidth * 0.75;
  const endX = waveStartX + cycleWidth;

  // Generate sine wave points
  const generateWavePoints = (progress: number) => {
    const points = [];
    const totalWidth = cycleWidth;
    for (let x = 0; x <= totalWidth * progress; x += 2) {
      const normalizedX = x / cycleWidth;
      const y = centerY - amplitude * Math.sin(normalizedX * Math.PI * 2);
      points.push(`${x + waveStartX},${y}`);
    }
    return points.join(" ");
  };

  // Animated dot position
  const dotProgress = interpolate(frame, [30, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dotX = waveStartX + cycleWidth * dotProgress;
  const dotY = centerY - amplitude * Math.sin(dotProgress * Math.PI * 2);

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
            backgroundColor: "#3b82f6",
            padding: "10px 24px",
            borderRadius: 30,
            fontSize: 22,
            fontWeight: 700,
            color: "#ffffff",
          }}
        >
          KEY CONCEPT
        </div>
        <h2
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
          }}
        >
          What is a Cycle?
        </h2>
      </div>

      {/* Waveform visualization */}
      <div style={{ position: "relative", height: 340, marginBottom: 20 }}>
        <svg width="1920" height="340" style={{ position: "absolute", top: 0, left: 0 }}>
          {/* Grid lines */}
          <line x1={waveStartX - 40} y1={centerY} x2={endX + 80} y2={centerY} stroke="#334155" strokeWidth="2" />
          <line x1={waveStartX - 40} y1={centerY - amplitude} x2={endX + 80} y2={centerY - amplitude} stroke="#334155" strokeWidth="1" strokeDasharray="5,5" />
          <line x1={waveStartX - 40} y1={centerY + amplitude} x2={endX + 80} y2={centerY + amplitude} stroke="#334155" strokeWidth="1" strokeDasharray="5,5" />

          {/* The waveform */}
          <polyline
            points={generateWavePoints(waveProgress)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="5"
          />

          {/* Animated dot tracing the wave */}
          {waveProgress > 0 && waveProgress < 1 && (
            <circle
              cx={dotX}
              cy={dotY}
              r="14"
              fill="#fbbf24"
              stroke="#fff"
              strokeWidth="3"
            />
          )}

          {/* Step 1: Start */}
          {step1Progress > 0 && (
            <>
              <circle cx={startX} cy={centerY} r="12" fill="#22c55e" stroke="#fff" strokeWidth="3" opacity={step1Progress} />
              <text x={startX} y={centerY - 30} fontSize="20" fill="#22c55e" textAnchor="middle" fontWeight="bold" opacity={step1Progress}>1. START</text>
            </>
          )}

          {/* Step 2: Peak */}
          {step2Progress > 0 && (
            <>
              <circle cx={peakX} cy={centerY - amplitude} r="12" fill="#8b5cf6" stroke="#fff" strokeWidth="3" opacity={step2Progress} />
              <text x={peakX} y={centerY - amplitude - 25} fontSize="20" fill="#8b5cf6" textAnchor="middle" fontWeight="bold" opacity={step2Progress}>2. PEAK</text>
            </>
          )}

          {/* Step 3: Trough */}
          {step3Progress > 0 && (
            <>
              <circle cx={troughX} cy={centerY + amplitude} r="12" fill="#ec4899" stroke="#fff" strokeWidth="3" opacity={step3Progress} />
              <text x={troughX} y={centerY + amplitude + 35} fontSize="20" fill="#ec4899" textAnchor="middle" fontWeight="bold" opacity={step3Progress}>3. TROUGH</text>
            </>
          )}

          {/* Step 4: Back to start */}
          {step4Progress > 0 && (
            <>
              <circle cx={endX} cy={centerY} r="12" fill="#22c55e" stroke="#fff" strokeWidth="3" opacity={step4Progress} />
              <text x={endX} y={centerY - 30} fontSize="20" fill="#22c55e" textAnchor="middle" fontWeight="bold" opacity={step4Progress}>4. BACK TO START</text>
            </>
          )}

          {/* Cycle bracket */}
          {step4Progress > 0 && (
            <>
              <line x1={startX} y1={centerY + amplitude + 60} x2={endX} y2={centerY + amplitude + 60} stroke="#4ade80" strokeWidth="3" opacity={step4Progress} />
              <line x1={startX} y1={centerY + amplitude + 50} x2={startX} y2={centerY + amplitude + 70} stroke="#4ade80" strokeWidth="3" opacity={step4Progress} />
              <line x1={endX} y1={centerY + amplitude + 50} x2={endX} y2={centerY + amplitude + 70} stroke="#4ade80" strokeWidth="3" opacity={step4Progress} />
              <text x={(startX + endX) / 2} y={centerY + amplitude + 90} fontSize="22" fill="#4ade80" textAnchor="middle" fontWeight="bold" opacity={step4Progress}>
                ONE COMPLETE CYCLE
              </text>
            </>
          )}
        </svg>
      </div>

      {/* Definition */}
      <div
        style={{
          backgroundColor: "#14532d33",
          border: "2px solid #22c55e",
          borderRadius: 16,
          padding: 24,
          maxWidth: 1000,
          transform: `translateY(${interpolate(definitionProgress, [0, 1], [30, 0])}px)`,
          opacity: definitionProgress,
        }}
      >
        <div style={{ fontSize: 18, color: "#4ade80", fontWeight: 600, marginBottom: 8 }}>
          EXAM DEFINITION
        </div>
        <div style={{ fontSize: 28, color: "#ffffff", lineHeight: 1.5 }}>
          A cycle is <span style={{ color: "#4ade80", fontWeight: 700 }}>one complete oscillation</span> of a waveform.
        </div>
        <div style={{ fontSize: 22, color: "#94a3b8", marginTop: 12 }}>
          Start → Peak → Trough → <span style={{ color: "#4ade80" }}>Back to starting point</span>
        </div>
      </div>
    </div>
  );
};
