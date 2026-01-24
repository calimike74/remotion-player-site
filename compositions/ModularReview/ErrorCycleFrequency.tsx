import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Addresses: Student confused cycle with frequency (cycles per second)
// Duration: 540 frames (18 seconds at 30fps)

export const ErrorCycleFrequency: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  // Single cycle demonstration
  const singleCycleProgress = interpolate(frame, [30, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Multiple cycles for frequency
  const multiCycleProgress = interpolate(frame, [180, 320], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Labels appear
  const labelProgress = spring({
    frame: frame - 340,
    fps,
    config: { damping: 15 },
  });

  // Comparison reveal
  const comparisonProgress = spring({
    frame: frame - 400,
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
  const centerY1 = 150; // Single cycle
  const centerY2 = 340; // Multiple cycles
  const amplitude = 60;
  const cycleWidth = 200;
  const startX = 200;

  // Generate wave for single cycle
  const generateSingleCycle = (progress: number) => {
    const points = [];
    for (let x = 0; x <= cycleWidth * progress; x += 2) {
      const normalizedX = x / cycleWidth;
      const y = centerY1 - amplitude * Math.sin(normalizedX * Math.PI * 2);
      points.push(`${x + startX},${y}`);
    }
    return points.join(" ");
  };

  // Generate wave for multiple cycles (5 cycles in 1 second = 5Hz example)
  const generateMultipleCycles = (progress: number, numCycles: number) => {
    const points = [];
    const totalWidth = cycleWidth * numCycles;
    for (let x = 0; x <= totalWidth * progress; x += 2) {
      const normalizedX = x / cycleWidth;
      const y = centerY2 - amplitude * Math.sin(normalizedX * Math.PI * 2);
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
          Cycle vs Frequency
        </h2>
      </div>

      {/* Visualization area */}
      <div style={{ position: "relative", height: 430, marginBottom: 20 }}>
        <svg width="1920" height="430" style={{ position: "absolute", top: 0, left: 0 }}>
          {/* SINGLE CYCLE SECTION */}
          {/* Label */}
          <text x={startX - 40} y={centerY1 - 80} fontSize="24" fill="#3b82f6" fontWeight="bold" opacity={singleCycleProgress > 0.1 ? 1 : 0}>
            ONE CYCLE:
          </text>

          {/* Axis */}
          <line x1={startX - 20} y1={centerY1} x2={startX + cycleWidth + 60} y2={centerY1} stroke="#334155" strokeWidth="2" />

          {/* Single wave */}
          <polyline
            points={generateSingleCycle(singleCycleProgress)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="4"
          />

          {/* Cycle markers */}
          {singleCycleProgress > 0 && (
            <circle cx={startX} cy={centerY1} r="8" fill="#22c55e" stroke="#fff" strokeWidth="2" />
          )}
          {singleCycleProgress >= 1 && (
            <>
              <circle cx={startX + cycleWidth} cy={centerY1} r="8" fill="#22c55e" stroke="#fff" strokeWidth="2" />
              <line x1={startX} y1={centerY1 + 50} x2={startX + cycleWidth} y2={centerY1 + 50} stroke="#22c55e" strokeWidth="2" />
              <line x1={startX} y1={centerY1 + 40} x2={startX} y2={centerY1 + 60} stroke="#22c55e" strokeWidth="2" />
              <line x1={startX + cycleWidth} y1={centerY1 + 40} x2={startX + cycleWidth} y2={centerY1 + 60} stroke="#22c55e" strokeWidth="2" />
              <text x={startX + cycleWidth / 2} y={centerY1 + 75} fontSize="18" fill="#22c55e" textAnchor="middle" fontWeight="bold">
                1 cycle
              </text>
            </>
          )}

          {/* MULTIPLE CYCLES SECTION (Frequency) */}
          {/* Label */}
          {multiCycleProgress > 0.1 && (
            <text x={startX - 40} y={centerY2 - 80} fontSize="24" fill="#ec4899" fontWeight="bold">
              FREQUENCY (cycles per second):
            </text>
          )}

          {/* Axis */}
          <line x1={startX - 20} y1={centerY2} x2={startX + cycleWidth * 5 + 60} y2={centerY2} stroke="#334155" strokeWidth="2" />

          {/* Multiple waves */}
          <polyline
            points={generateMultipleCycles(multiCycleProgress, 5)}
            fill="none"
            stroke="#ec4899"
            strokeWidth="4"
          />

          {/* Time bracket for 1 second */}
          {multiCycleProgress >= 1 && (
            <>
              <line x1={startX} y1={centerY2 + 50} x2={startX + cycleWidth * 5} y2={centerY2 + 50} stroke="#fbbf24" strokeWidth="2" />
              <line x1={startX} y1={centerY2 + 40} x2={startX} y2={centerY2 + 60} stroke="#fbbf24" strokeWidth="2" />
              <line x1={startX + cycleWidth * 5} y1={centerY2 + 40} x2={startX + cycleWidth * 5} y2={centerY2 + 60} stroke="#fbbf24" strokeWidth="2" />
              <text x={startX + cycleWidth * 2.5} y={centerY2 + 75} fontSize="18" fill="#fbbf24" textAnchor="middle" fontWeight="bold">
                5 cycles in 1 second = 5 Hz
              </text>
            </>
          )}

          {/* Cycle count indicators */}
          {multiCycleProgress >= 1 && labelProgress > 0 && (
            <>
              {[0, 1, 2, 3, 4].map((i) => (
                <text
                  key={i}
                  x={startX + cycleWidth * (i + 0.5)}
                  y={centerY2 - amplitude - 15}
                  fontSize="20"
                  fill="#ec4899"
                  textAnchor="middle"
                  fontWeight="bold"
                  opacity={labelProgress}
                >
                  {i + 1}
                </text>
              ))}
            </>
          )}
        </svg>
      </div>

      {/* Comparison boxes */}
      <div
        style={{
          display: "flex",
          gap: 40,
          transform: `translateY(${interpolate(comparisonProgress, [0, 1], [30, 0])}px)`,
          opacity: comparisonProgress,
        }}
      >
        <div
          style={{
            flex: 1,
            backgroundColor: "#1e3a5f33",
            border: "2px solid #3b82f6",
            borderRadius: 16,
            padding: 24,
          }}
        >
          <div style={{ fontSize: 22, color: "#3b82f6", fontWeight: 700, marginBottom: 8 }}>
            CYCLE
          </div>
          <div style={{ fontSize: 24, color: "#ffffff" }}>
            One complete oscillation
          </div>
          <div style={{ fontSize: 18, color: "#94a3b8", marginTop: 8 }}>
            (Just ONE wave)
          </div>
        </div>

        <div
          style={{
            flex: 1,
            backgroundColor: "#4a1d4633",
            border: "2px solid #ec4899",
            borderRadius: 16,
            padding: 24,
          }}
        >
          <div style={{ fontSize: 22, color: "#ec4899", fontWeight: 700, marginBottom: 8 }}>
            FREQUENCY
          </div>
          <div style={{ fontSize: 24, color: "#ffffff" }}>
            Number of cycles per second
          </div>
          <div style={{ fontSize: 18, color: "#94a3b8", marginTop: 8 }}>
            (Measured in Hz)
          </div>
        </div>
      </div>
    </div>
  );
};
