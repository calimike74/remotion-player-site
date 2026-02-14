import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

const COLORS = {
  bg: "#1a1a2e",
  accent: "#FF6B35",
  text: "#FFFBF5",
  teal: "#4ECDC4",
  pink: "#E85D75",
  secondary: "rgba(255, 251, 245, 0.6)",
};

// Chart dimensions
const CX = 200; // chart left
const CY = 160; // chart top
const CW = 1520; // chart width
const CH = 600; // chart height
const BOTTOM = CY + CH;

// Frequency log scale: map 0-1 to position
const freqLabels = [
  { hz: "20", pos: 0 },
  { hz: "100", pos: 0.17 },
  { hz: "500", pos: 0.38 },
  { hz: "1k", pos: 0.55 },
  { hz: "5k", pos: 0.76 },
  { hz: "20k", pos: 1 },
];

// Build a low-pass filter curve path
function buildFilterPath(
  cutoffNorm: number,
  resonance: number,
): string {
  const points: string[] = [];
  const steps = 300;

  for (let i = 0; i <= steps; i++) {
    const norm = i / steps; // 0 to 1 across frequency range
    const x = CX + norm * CW;

    // Passband is flat at 0dB up to cutoff, then drops off sharply
    let dbDrop = 0;

    if (norm > cutoffNorm) {
      // Steep rolloff after cutoff (-24dB/octave style)
      const octavesPast = (norm - cutoffNorm) / 0.08;
      dbDrop = -octavesPast * 24;
    }

    // Resonance peak near cutoff
    if (resonance > 0) {
      const distFromCutoff = Math.abs(norm - cutoffNorm);
      const peakWidth = 0.03;
      if (distFromCutoff < peakWidth * 3) {
        const resPeak =
          resonance * 18 * Math.exp(-((distFromCutoff / peakWidth) ** 2));
        dbDrop += resPeak;
      }
    }

    // Clamp
    dbDrop = Math.max(dbDrop, -60);
    dbDrop = Math.min(dbDrop, 20);

    // Map dB to Y: 0dB at 30% from top, -60dB at bottom
    const zeroDbY = CY + CH * 0.15;
    const minDbY = BOTTOM;
    const y = zeroDbY + ((0 - dbDrop) / 60) * (minDbY - zeroDbY);

    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${Math.min(y, BOTTOM).toFixed(1)}`);
  }

  return points.join(" ");
}

export const FilterSweep: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title fade in
  const titleOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Phase 1 (0-7s): Cutoff sweeps from right (1.0) to left (0.3)
  const cutoffNorm = interpolate(frame, [0.5 * fps, 7 * fps], [0.9, 0.25], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Phase 2 (7-10s): Resonance grows
  const resonance = interpolate(frame, [7 * fps, 9.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Resonance label
  const resLabelOpacity = interpolate(frame, [7.5 * fps, 8.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const filterPath = buildFilterPath(cutoffNorm, resonance);

  // Cutoff marker position
  const cutoffX = CX + cutoffNorm * CW;

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: COLORS.bg,
        fontFamily,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        {/* Title */}
        <text
          x={960}
          y={80}
          fill={COLORS.text}
          fontSize={44}
          fontWeight={700}
          textAnchor="middle"
          fontFamily={fontFamily}
          opacity={titleOpacity}
        >
          Low-Pass Filter
        </text>

        {/* Axes */}
        <line
          x1={CX}
          y1={BOTTOM}
          x2={CX + CW}
          y2={BOTTOM}
          stroke="rgba(255,251,245,0.3)"
          strokeWidth={2}
        />
        <line
          x1={CX}
          y1={CY}
          x2={CX}
          y2={BOTTOM}
          stroke="rgba(255,251,245,0.3)"
          strokeWidth={2}
        />

        {/* Y-axis label */}
        <text
          x={CX - 60}
          y={CY + CH / 2}
          fill={COLORS.secondary}
          fontSize={20}
          textAnchor="middle"
          fontFamily={fontFamily}
          transform={`rotate(-90, ${CX - 60}, ${CY + CH / 2})`}
        >
          Amplitude (dB)
        </text>

        {/* X-axis label */}
        <text
          x={CX + CW / 2}
          y={BOTTOM + 70}
          fill={COLORS.secondary}
          fontSize={20}
          textAnchor="middle"
          fontFamily={fontFamily}
        >
          Frequency
        </text>

        {/* Frequency tick labels */}
        {freqLabels.map((f) => {
          const x = CX + f.pos * CW;
          return (
            <g key={f.hz}>
              <line
                x1={x}
                y1={BOTTOM}
                x2={x}
                y2={BOTTOM + 8}
                stroke="rgba(255,251,245,0.3)"
                strokeWidth={1}
              />
              <text
                x={x}
                y={BOTTOM + 35}
                fill={COLORS.secondary}
                fontSize={18}
                textAnchor="middle"
                fontFamily={fontFamily}
              >
                {f.hz}
              </text>
            </g>
          );
        })}

        {/* dB grid lines */}
        {[0, -20, -40, -60].map((db) => {
          const zeroDbY = CY + CH * 0.15;
          const y = zeroDbY + ((0 - db) / 60) * (BOTTOM - zeroDbY);
          return (
            <g key={db}>
              <line
                x1={CX}
                y1={y}
                x2={CX + CW}
                y2={y}
                stroke="rgba(255,251,245,0.08)"
                strokeWidth={1}
              />
              <text
                x={CX - 15}
                y={y + 5}
                fill={COLORS.secondary}
                fontSize={16}
                textAnchor="end"
                fontFamily={fontFamily}
              >
                {db}dB
              </text>
            </g>
          );
        })}

        {/* Filter curve */}
        <path
          d={filterPath}
          fill="none"
          stroke={COLORS.teal}
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* Cutoff marker line */}
        <line
          x1={cutoffX}
          y1={CY}
          x2={cutoffX}
          y2={BOTTOM}
          stroke={COLORS.accent}
          strokeWidth={2}
          strokeDasharray="8,6"
          opacity={0.7}
        />

        {/* Cutoff label */}
        <text
          x={cutoffX}
          y={CY - 15}
          fill={COLORS.accent}
          fontSize={22}
          fontWeight={700}
          textAnchor="middle"
          fontFamily={fontFamily}
        >
          Cutoff
        </text>

        {/* Resonance label */}
        <text
          x={960}
          y={BOTTOM + 120}
          fill={COLORS.pink}
          fontSize={32}
          fontWeight={700}
          textAnchor="middle"
          fontFamily={fontFamily}
          opacity={resLabelOpacity}
        >
          Resonance — boost at cutoff frequency
        </text>
      </svg>
    </div>
  );
};
