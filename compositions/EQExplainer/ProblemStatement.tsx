import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { eqTheme, freqToX, getFreqColor } from "./eqTheme";

/**
 * Section 2: The Problem EQ Solves
 * Shows an unbalanced frequency spectrum with problem areas highlighted
 */
export const ProblemStatement: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const graphWidth = 1400;
  const graphHeight = 400;
  const padding = { left: 80, right: 40, top: 60, bottom: 80 };

  // Animation progress
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const spectrumProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12, stiffness: 60 },
  });

  const problemHighlight = spring({
    frame: frame - 60,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const labelProgress = spring({
    frame: frame - 90,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  // Exit animation (section duration: 330 frames)
  const exitOpacity = interpolate(frame, [300, 330], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Generate "problematic" spectrum data
  const spectrumData = generateProblematicSpectrum();

  // Frequency labels for X axis
  const freqLabels = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];

  // Problem areas to highlight
  const problemAreas = [
    { freq: 200, label: "Muddy buildup", type: "resonance" },
    { freq: 3000, label: "Harsh presence", type: "resonance" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
        opacity: exitOpacity,
      }}
    >
      {/* Section title */}
      <h2
        style={{
          fontSize: 44,
          fontWeight: 600,
          color: eqTheme.text.primary,
          margin: 0,
          marginBottom: 40,
          opacity: titleProgress,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [20, 0])}px)`,
        }}
      >
        The Problem: Unbalanced Frequency Response
      </h2>

      {/* Spectrum analyzer card */}
      <div
        style={{
          backgroundColor: eqTheme.card.background,
          borderRadius: 16,
          border: `1px solid ${eqTheme.card.border}`,
          boxShadow: eqTheme.card.shadow,
          padding: 24,
        }}
      >
        <svg
          width={graphWidth + padding.left + padding.right}
          height={graphHeight + padding.top + padding.bottom}
        >
          {/* Grid lines */}
          {[-18, -12, -6, 0, 6].map((db) => {
            const y = padding.top + ((6 - db) / 24) * graphHeight;
            return (
              <g key={db} opacity={spectrumProgress * 0.3}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + graphWidth}
                  y2={y}
                  stroke={eqTheme.grid.line}
                  strokeWidth={1}
                  strokeDasharray={db === 0 ? "none" : "4,4"}
                />
                <text
                  x={padding.left - 10}
                  y={y + 5}
                  textAnchor="end"
                  fill={eqTheme.grid.label}
                  fontSize={14}
                >
                  {db > 0 ? `+${db}` : db}dB
                </text>
              </g>
            );
          })}

          {/* X-axis frequency labels */}
          {freqLabels.map((freq) => {
            const x = padding.left + freqToX(freq, graphWidth);
            return (
              <text
                key={freq}
                x={x}
                y={padding.top + graphHeight + 30}
                textAnchor="middle"
                fill={eqTheme.grid.label}
                fontSize={14}
                opacity={spectrumProgress}
              >
                {freq >= 1000 ? `${freq / 1000}k` : freq}
              </text>
            );
          })}

          {/* Spectrum bars */}
          {spectrumData.map((point, i) => {
            const x = padding.left + freqToX(point.freq, graphWidth);
            const barHeight = Math.max(0, (point.level + 24) / 30) * graphHeight;
            const y = padding.top + graphHeight - barHeight * spectrumProgress;

            return (
              <rect
                key={i}
                x={x - 4}
                y={y}
                width={8}
                height={barHeight * spectrumProgress}
                fill={getFreqColor(point.freq)}
                opacity={0.8}
                rx={2}
              />
            );
          })}

          {/* Problem area highlights */}
          {problemAreas.map((problem, i) => {
            const x = padding.left + freqToX(problem.freq, graphWidth);
            const highlightWidth = 80;

            return (
              <g key={i} opacity={problemHighlight}>
                {/* Highlight box */}
                <rect
                  x={x - highlightWidth / 2}
                  y={padding.top}
                  width={highlightWidth}
                  height={graphHeight}
                  fill="#EF4444"
                  opacity={0.15}
                  rx={4}
                />
                {/* Top indicator */}
                <circle
                  cx={x}
                  cy={padding.top - 20}
                  r={8}
                  fill="#EF4444"
                />
                {/* Problem label */}
                <text
                  x={x}
                  y={padding.top - 35}
                  textAnchor="middle"
                  fill="#EF4444"
                  fontSize={16}
                  fontWeight={600}
                  opacity={labelProgress}
                >
                  {problem.label}
                </text>
              </g>
            );
          })}

          {/* Axis labels */}
          <text
            x={padding.left + graphWidth / 2}
            y={padding.top + graphHeight + 60}
            textAnchor="middle"
            fill={eqTheme.text.secondary}
            fontSize={18}
            fontWeight={500}
            opacity={spectrumProgress}
          >
            FREQUENCY (Hz)
          </text>
        </svg>
      </div>

      {/* Explanation text */}
      <p
        style={{
          fontSize: 24,
          color: eqTheme.text.secondary,
          margin: 0,
          marginTop: 32,
          maxWidth: 900,
          textAlign: "center",
          lineHeight: 1.5,
          opacity: labelProgress,
        }}
      >
        Resonances, room modes, and source characteristics create imbalances
        that require <span style={{ color: eqTheme.text.accent }}>equalization</span> to correct.
      </p>
    </div>
  );
};

// Generate spectrum data with intentional problems
function generateProblematicSpectrum(): { freq: number; level: number }[] {
  const points: { freq: number; level: number }[] = [];
  const freqs = [20, 25, 31, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500,
    630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000];

  freqs.forEach((freq) => {
    let level = -12 + Math.random() * 6; // Base level

    // Add problem areas
    if (freq >= 160 && freq <= 250) level += 8; // Muddy buildup
    if (freq >= 2500 && freq <= 4000) level += 6; // Harsh presence
    if (freq >= 10000) level -= 6; // Roll-off

    points.push({ freq, level: Math.min(6, Math.max(-24, level)) });
  });

  return points;
}
