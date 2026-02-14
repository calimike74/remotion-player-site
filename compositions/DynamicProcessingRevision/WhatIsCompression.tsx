import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

const COLORS = {
  bg: "#1a1a2e",
  accent: "#FF6B35",
  text: "#FFFBF5",
  threshold: "#E85D75",
  secondary: "rgba(255, 251, 245, 0.6)",
};

// Generate a waveform with varying amplitude (loud and quiet sections)
function generateWaveform(
  numPoints: number,
  compressionAmount: number,
  thresholdY: number,
): string {
  const points: string[] = [];
  const width = 700;
  const centerY = 200;

  for (let i = 0; i < numPoints; i++) {
    const x = (i / numPoints) * width;
    const t = i / numPoints;

    // Varying amplitude: loud-quiet-loud pattern
    let amplitude: number;
    if (t < 0.3) {
      amplitude = 140; // loud
    } else if (t < 0.55) {
      amplitude = 50; // quiet
    } else {
      amplitude = 130; // loud again
    }

    // Apply compression to parts above threshold
    if (amplitude > thresholdY) {
      const excess = amplitude - thresholdY;
      amplitude = thresholdY + excess * (1 - compressionAmount);
    }

    const y = centerY + Math.sin(t * Math.PI * 16) * amplitude;
    points.push(`${x},${y}`);
  }

  return points.join(" ");
}

export const WhatIsCompression: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (0-4s): Waveform draws in
  const waveformDraw = interpolate(frame, [0, 1.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Phase 2 (3-6s): Dynamic range bracket appears
  const bracketOpacity = interpolate(
    frame,
    [2.5 * fps, 3.5 * fps],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );

  const bracketScale = spring({
    frame: Math.max(0, frame - 2.5 * fps),
    fps,
    config: { damping: 200 },
  });

  // Phase 3 (6-9s): Threshold line appears
  const thresholdOpacity = interpolate(
    frame,
    [5.5 * fps, 6.5 * fps],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );

  // Phase 4 (8-12s): Compression happens
  const compressionAmount = interpolate(
    frame,
    [7.5 * fps, 10 * fps],
    [0, 0.55],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );

  // Label for threshold
  const thresholdLabelOpacity = interpolate(
    frame,
    [6.5 * fps, 7.5 * fps],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );

  // "Compressed" label
  const compressedLabelOpacity = interpolate(
    frame,
    [10 * fps, 11 * fps],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );

  const thresholdAmplitude = 80;
  const waveformPoints = generateWaveform(200, compressionAmount, thresholdAmplitude);

  // SVG dimensions for the waveform area
  const svgWidth = 700;
  const svgHeight = 400;
  const centerY = 200;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.bg,
        fontFamily,
        width: "100%",
        height: "100%",
        gap: 80,
      }}
    >
      {/* Waveform area */}
      <div style={{ position: "relative" }}>
        <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          {/* Waveform */}
          <polyline
            points={waveformPoints}
            fill="none"
            stroke={compressionAmount > 0 ? COLORS.accent : COLORS.text}
            strokeWidth={2.5}
            strokeDasharray={svgWidth * 3}
            strokeDashoffset={svgWidth * 3 * (1 - waveformDraw)}
          />

          {/* Threshold line */}
          <line
            x1={0}
            y1={centerY - thresholdAmplitude}
            x2={svgWidth}
            y2={centerY - thresholdAmplitude}
            stroke={COLORS.threshold}
            strokeWidth={2}
            strokeDasharray="8,6"
            opacity={thresholdOpacity}
          />
          <line
            x1={0}
            y1={centerY + thresholdAmplitude}
            x2={svgWidth}
            y2={centerY + thresholdAmplitude}
            stroke={COLORS.threshold}
            strokeWidth={2}
            strokeDasharray="8,6"
            opacity={thresholdOpacity}
          />

          {/* Dynamic range bracket (right side) */}
          <g
            opacity={bracketOpacity}
            transform={`translate(${svgWidth + 15}, ${centerY}) scale(1, ${bracketScale})`}
          >
            {/* Top bracket arm */}
            <line x1={0} y1={-140} x2={15} y2={-140} stroke={COLORS.text} strokeWidth={2} />
            {/* Vertical line */}
            <line x1={15} y1={-140} x2={15} y2={140} stroke={COLORS.text} strokeWidth={2} />
            {/* Bottom bracket arm */}
            <line x1={0} y1={140} x2={15} y2={140} stroke={COLORS.text} strokeWidth={2} />
          </g>
        </svg>

        {/* Bracket label */}
        <div
          style={{
            position: "absolute",
            right: -140,
            top: "50%",
            transform: "translateY(-50%) rotate(90deg)",
            color: COLORS.text,
            fontSize: 22,
            fontWeight: 700,
            opacity: bracketOpacity,
            whiteSpace: "nowrap",
          }}
        >
          Dynamic Range
        </div>

        {/* Threshold label */}
        <div
          style={{
            position: "absolute",
            left: -10,
            top: centerY - thresholdAmplitude - 35,
            color: COLORS.threshold,
            fontSize: 22,
            fontWeight: 700,
            opacity: thresholdLabelOpacity,
          }}
        >
          Threshold
        </div>
      </div>

      {/* Text area */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 30,
          maxWidth: 420,
        }}
      >
        <div
          style={{
            color: COLORS.text,
            fontSize: 36,
            fontWeight: 700,
            opacity: interpolate(frame, [0, 0.8 * fps], [0, 1], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            }),
          }}
        >
          What is Compression?
        </div>
        <div
          style={{
            color: COLORS.secondary,
            fontSize: 26,
            lineHeight: 1.5,
            opacity: interpolate(frame, [3 * fps, 4 * fps], [0, 1], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            }),
          }}
        >
          Reduces the <span style={{ color: COLORS.text, fontWeight: 700 }}>dynamic range</span> by
          attenuating signals above a set threshold.
        </div>
        <div
          style={{
            color: COLORS.accent,
            fontSize: 26,
            fontWeight: 700,
            opacity: compressedLabelOpacity,
          }}
        >
          Loud parts come down → smaller dynamic range
        </div>
      </div>
    </div>
  );
};
