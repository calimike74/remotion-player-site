import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { eduTheme } from "../shared/EducationalBackground";

export const CompressionGraph: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const graphSize = 500;
  const padding = 80;

  // Animations
  const axesProgress = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  const unityLineProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 20 },
  });

  const thresholdProgress = spring({
    frame: frame - 50,
    fps,
    config: { damping: 15 },
  });

  const compressionCurveProgress = spring({
    frame: frame - 80,
    fps,
    config: { damping: 12 },
  });

  // Moving dot animation
  const dotProgress = interpolate(frame, [120, 170], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Threshold at -20dB (normalized to 0-1 where 0 is -60dB and 1 is 0dB)
  const thresholdNorm = 0.67; // approximately -20dB
  const ratio = 4;

  // Calculate compression curve points
  const getOutputLevel = (input: number) => {
    if (input <= thresholdNorm) {
      return input; // Below threshold: unity gain
    }
    // Above threshold: compressed
    const excess = input - thresholdNorm;
    return thresholdNorm + excess / ratio;
  };

  // Generate SVG path for compression curve
  const generateCurvePath = () => {
    const segments: string[] = [];
    const steps = 50;

    for (let i = 0; i <= steps; i++) {
      const input = i / steps;
      const output = getOutputLevel(input);

      const x = padding + input * graphSize;
      const y = padding + graphSize - output * graphSize;

      if (i === 0) {
        segments.push(`M ${x} ${y}`);
      } else {
        segments.push(`L ${x} ${y}`);
      }
    }

    return segments.join(" ");
  };

  // Moving dot position
  const dotInput = dotProgress;
  const dotOutput = getOutputLevel(dotInput);
  const dotX = padding + dotInput * graphSize;
  const dotY = padding + graphSize - dotOutput * graphSize;

  // Gain reduction visualization
  const unityOutput = dotInput;
  const gainReduction = unityOutput - dotOutput;
  const gainReductionDB = dotInput > thresholdNorm ? Math.round(gainReduction * 60) : 0;

  // Exit animation
  const exitOpacity = interpolate(frame, [160, 180], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 80,
        opacity: exitOpacity,
      }}
    >
      {/* Graph Card */}
      <div
        style={{
          position: "relative",
          backgroundColor: eduTheme.card.background,
          borderRadius: 16,
          border: `1px solid ${eduTheme.card.border}`,
          boxShadow: eduTheme.card.shadow,
          padding: 20,
        }}
      >
        <svg width={graphSize + padding * 2} height={graphSize + padding * 2}>
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((tick) => (
            <g key={tick} opacity={axesProgress * 0.3}>
              <line
                x1={padding}
                y1={padding + graphSize * (1 - tick)}
                x2={padding + graphSize}
                y2={padding + graphSize * (1 - tick)}
                stroke="#e2e8f0"
                strokeWidth={1}
              />
              <line
                x1={padding + graphSize * tick}
                y1={padding}
                x2={padding + graphSize * tick}
                y2={padding + graphSize}
                stroke="#e2e8f0"
                strokeWidth={1}
              />
            </g>
          ))}

          {/* Axes */}
          <g opacity={axesProgress}>
            {/* Y axis */}
            <line
              x1={padding}
              y1={padding}
              x2={padding}
              y2={padding + graphSize}
              stroke={eduTheme.text.secondary}
              strokeWidth={2}
            />
            {/* X axis */}
            <line
              x1={padding}
              y1={padding + graphSize}
              x2={padding + graphSize}
              y2={padding + graphSize}
              stroke={eduTheme.text.secondary}
              strokeWidth={2}
            />
          </g>

          {/* Unity gain line (1:1) */}
          <line
            x1={padding}
            y1={padding + graphSize}
            x2={padding + graphSize * unityLineProgress}
            y2={padding + graphSize * (1 - unityLineProgress)}
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="10,10"
            opacity={unityLineProgress}
          />

          {/* Threshold vertical line */}
          <line
            x1={padding + thresholdNorm * graphSize}
            y1={padding}
            x2={padding + thresholdNorm * graphSize}
            y2={padding + graphSize}
            stroke="#dc2626"
            strokeWidth={2}
            strokeDasharray="8,8"
            opacity={thresholdProgress}
          />

          {/* Compression curve */}
          <path
            d={generateCurvePath()}
            fill="none"
            stroke={eduTheme.accent.primary}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={graphSize * 2}
            strokeDashoffset={(1 - compressionCurveProgress) * graphSize * 2}
          />

          {/* Moving dot */}
          {dotProgress > 0 && (
            <>
              {/* Vertical line from dot to x-axis */}
              <line
                x1={dotX}
                y1={dotY}
                x2={dotX}
                y2={padding + graphSize}
                stroke="#16a34a"
                strokeWidth={2}
                strokeDasharray="4,4"
                opacity={0.6}
              />
              {/* Horizontal line from dot to y-axis */}
              <line
                x1={padding}
                y1={dotY}
                x2={dotX}
                y2={dotY}
                stroke="#16a34a"
                strokeWidth={2}
                strokeDasharray="4,4"
                opacity={0.6}
              />
              {/* The dot */}
              <circle cx={dotX} cy={dotY} r={10} fill="#16a34a" />
            </>
          )}
        </svg>

        {/* Axis labels */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            left: padding + 20,
            right: padding + 20,
            textAlign: "center",
            color: eduTheme.text.secondary,
            fontSize: 20,
            fontWeight: 600,
            opacity: axesProgress,
          }}
        >
          INPUT LEVEL (dB)
        </div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: -20,
            transform: "rotate(-90deg) translateX(-50%)",
            color: eduTheme.text.secondary,
            fontSize: 20,
            fontWeight: 600,
            opacity: axesProgress,
            whiteSpace: "nowrap",
          }}
        >
          OUTPUT LEVEL (dB)
        </div>

        {/* Threshold label */}
        <div
          style={{
            position: "absolute",
            top: padding,
            left: padding + thresholdNorm * graphSize - 40,
            color: "#dc2626",
            fontSize: 18,
            fontWeight: 600,
            opacity: thresholdProgress,
          }}
        >
          -20dB
        </div>
      </div>

      {/* Info panel */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          maxWidth: 400,
        }}
      >
        <h2
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: eduTheme.text.primary,
            margin: 0,
            opacity: axesProgress,
          }}
        >
          Compression Curve
        </h2>

        <div style={{ opacity: unityLineProgress }}>
          <div style={{ color: "#94a3b8", fontSize: 20, marginBottom: 6 }}>
            ─ ─ Unity (1:1)
          </div>
          <p style={{ color: eduTheme.text.secondary, fontSize: 18, margin: 0 }}>No compression</p>
        </div>

        <div style={{ opacity: thresholdProgress }}>
          <div style={{ color: "#dc2626", fontSize: 20, marginBottom: 6 }}>
            ┊ Threshold: -20dB
          </div>
          <p style={{ color: eduTheme.text.secondary, fontSize: 18, margin: 0 }}>
            Compression begins here
          </p>
        </div>

        <div style={{ opacity: compressionCurveProgress }}>
          <div style={{ color: eduTheme.accent.primary, fontSize: 20, marginBottom: 6 }}>
            ━ Ratio: 4:1
          </div>
          <p style={{ color: eduTheme.text.secondary, fontSize: 18, margin: 0 }}>
            4dB input → 1dB output above threshold
          </p>
        </div>

        {dotProgress > 0 && gainReductionDB > 0 && (
          <div
            style={{
              backgroundColor: "#f0fdf4",
              padding: "16px 24px",
              borderRadius: 10,
              border: "2px solid #16a34a",
            }}
          >
            <div style={{ color: "#16a34a", fontSize: 24, fontWeight: 700 }}>
              Gain Reduction: -{gainReductionDB}dB
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
