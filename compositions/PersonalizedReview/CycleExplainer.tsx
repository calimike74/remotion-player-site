import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface CycleExplainerProps {
  studentAnswer: string;
}

export const CycleExplainer: React.FC<CycleExplainerProps> = ({ studentAnswer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  // "Your answer" animation
  const yourAnswerProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 15 },
  });

  // Waveform animation progress - draws the wave
  const waveProgress = interpolate(frame, [80, 280], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Half cycle highlight (Elizabeth's error - peak to trough only)
  const halfCycleProgress = interpolate(frame, [300, 360], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Full cycle highlight
  const fullCycleProgress = interpolate(frame, [380, 440], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Correct answer reveal
  const correctProgress = spring({
    frame: frame - 460,
    fps,
    config: { damping: 15 },
  });

  // Exit animation
  const exitProgress = interpolate(frame, [560, 590], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  // Waveform constants - one complete cycle
  const waveStartX = 300;
  const cycleWidth = 600; // One full cycle = 600px
  const centerY = 180; // Center of the waveform area
  const amplitude = 80;

  // Key positions on the wave
  const startX = waveStartX;                           // 0° - start at zero crossing
  const peakX = waveStartX + cycleWidth * 0.25;        // 90° - peak
  const midX = waveStartX + cycleWidth * 0.5;          // 180° - back to zero
  const troughX = waveStartX + cycleWidth * 0.75;      // 270° - trough
  const endX = waveStartX + cycleWidth;                // 360° - end (same as start)

  // Generate sine wave points
  const generateWavePoints = (progress: number) => {
    const points = [];
    const totalWidth = cycleWidth * 1.3; // Draw slightly more than one cycle

    for (let x = 0; x <= totalWidth * progress; x += 2) {
      const normalizedX = x / cycleWidth; // Normalize to cycle width
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
            fontSize: 24,
            fontWeight: 700,
            color: "#ffffff",
          }}
        >
          REVIEW AREA 1
        </div>
        <h2
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
          }}
        >
          What is a Cycle?
        </h2>
      </div>

      {/* Your answer box */}
      <div
        style={{
          backgroundColor: "#7c2d1233",
          border: "2px solid #f97316",
          borderRadius: 16,
          padding: 24,
          marginBottom: 30,
          maxWidth: 800,
          transform: `translateX(${interpolate(yourAnswerProgress, [0, 1], [-50, 0])}px)`,
          opacity: yourAnswerProgress,
        }}
      >
        <div
          style={{
            fontSize: 18,
            color: "#fb923c",
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          YOUR ANSWER
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#fcd34d",
            fontStyle: "italic",
          }}
        >
          "{studentAnswer}"
        </div>
      </div>

      {/* Waveform visualization */}
      <div
        style={{
          position: "relative",
          height: 420,
          marginBottom: 20,
        }}
      >
        <svg width="1920" height="420" style={{ position: "absolute", top: 0, left: 0 }}>
          {/* Background grid */}
          <line x1={waveStartX - 40} y1={centerY} x2={endX + 200} y2={centerY} stroke="#334155" strokeWidth="2" />
          <line x1={waveStartX - 40} y1={centerY - amplitude} x2={endX + 200} y2={centerY - amplitude} stroke="#334155" strokeWidth="1" strokeDasharray="5,5" />
          <line x1={waveStartX - 40} y1={centerY + amplitude} x2={endX + 200} y2={centerY + amplitude} stroke="#334155" strokeWidth="1" strokeDasharray="5,5" />

          {/* Axis labels */}
          <text x={waveStartX - 80} y={centerY - amplitude + 5} fontSize="18" fill="#64748b">Peak</text>
          <text x={waveStartX - 100} y={centerY + 5} fontSize="18" fill="#64748b">Zero line</text>
          <text x={waveStartX - 90} y={centerY + amplitude + 5} fontSize="18" fill="#64748b">Trough</text>

          {/* Half cycle highlight - Peak to Trough (what Elizabeth described) */}
          {halfCycleProgress > 0 && (
            <>
              <rect
                x={peakX}
                y={centerY - amplitude - 20}
                width={(troughX - peakX) * halfCycleProgress}
                height={amplitude * 2 + 40}
                fill="#f9731633"
                stroke="#f97316"
                strokeWidth="2"
                strokeDasharray="8,4"
                rx="8"
              />
              <text
                x={(peakX + troughX) / 2}
                y={centerY + amplitude + 70}
                fontSize="26"
                fill="#fb923c"
                textAnchor="middle"
                fontWeight="bold"
                opacity={halfCycleProgress}
              >
                HALF CYCLE ONLY
              </text>
              <text
                x={(peakX + troughX) / 2}
                y={centerY + amplitude + 100}
                fontSize="20"
                fill="#94a3b8"
                textAnchor="middle"
                opacity={halfCycleProgress}
              >
                (Peak → Trough = what you described)
              </text>
            </>
          )}

          {/* Full cycle highlight */}
          {fullCycleProgress > 0 && (
            <>
              <rect
                x={startX}
                y={centerY - amplitude - 30}
                width={cycleWidth * fullCycleProgress}
                height={amplitude * 2 + 60}
                fill="#22c55e22"
                stroke="#22c55e"
                strokeWidth="3"
                rx="8"
              />
              <text
                x={startX + cycleWidth / 2}
                y={centerY - amplitude - 50}
                fontSize="30"
                fill="#4ade80"
                textAnchor="middle"
                fontWeight="bold"
                opacity={fullCycleProgress}
              >
                ONE FULL CYCLE
              </text>
              <text
                x={startX + cycleWidth / 2}
                y={centerY - amplitude - 20}
                fontSize="20"
                fill="#94a3b8"
                textAnchor="middle"
                opacity={fullCycleProgress}
              >
                (Start → Peak → Trough → Back to Start)
              </text>
            </>
          )}

          {/* The waveform itself */}
          <polyline
            points={generateWavePoints(waveProgress)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="5"
          />

          {/* Key point markers and labels */}
          {waveProgress > 0 && (
            <>
              {/* Start marker */}
              <circle cx={startX} cy={centerY} r="12" fill="#3b82f6" stroke="#fff" strokeWidth="3" />
              <text x={startX} y={centerY + 45} fontSize="20" fill="#3b82f6" textAnchor="middle" fontWeight="bold">START</text>
            </>
          )}

          {waveProgress > 0.25 && (
            <>
              {/* Peak marker */}
              <circle cx={peakX} cy={centerY - amplitude} r="10" fill="#8b5cf6" stroke="#fff" strokeWidth="2" />
              <text x={peakX} y={centerY - amplitude - 25} fontSize="18" fill="#8b5cf6" textAnchor="middle" fontWeight="bold">PEAK</text>
            </>
          )}

          {waveProgress > 0.5 && (
            <>
              {/* Mid-cycle zero crossing */}
              <circle cx={midX} cy={centerY} r="8" fill="#64748b" stroke="#fff" strokeWidth="2" />
            </>
          )}

          {waveProgress > 0.75 && (
            <>
              {/* Trough marker */}
              <circle cx={troughX} cy={centerY + amplitude} r="10" fill="#ec4899" stroke="#fff" strokeWidth="2" />
              <text x={troughX} y={centerY + amplitude + 35} fontSize="18" fill="#ec4899" textAnchor="middle" fontWeight="bold">TROUGH</text>
            </>
          )}

          {waveProgress >= 1 && fullCycleProgress > 0 && (
            <>
              {/* End/Complete cycle marker */}
              <circle cx={endX} cy={centerY} r="12" fill="#22c55e" stroke="#fff" strokeWidth="3" />
              <text x={endX} y={centerY + 45} fontSize="20" fill="#22c55e" textAnchor="middle" fontWeight="bold">END</text>
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
          maxWidth: 1100,
          transform: `translateY(${interpolate(correctProgress, [0, 1], [30, 0])}px)`,
          opacity: correctProgress,
        }}
      >
        <div
          style={{
            fontSize: 18,
            color: "#4ade80",
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          CORRECT DEFINITION
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#ffffff",
            lineHeight: 1.5,
          }}
        >
          A cycle is <span style={{ color: "#4ade80", fontWeight: 700 }}>one complete oscillation</span> —
          starting at zero, up to the peak, back through zero, down to the trough, and
          <span style={{ color: "#4ade80", fontWeight: 700 }}> returning to the starting point</span>.
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#94a3b8",
            marginTop: 12,
          }}
        >
          Peak → Trough covers only <strong>half</strong> the journey. A full cycle returns to where it started!
        </div>
      </div>
    </div>
  );
};
