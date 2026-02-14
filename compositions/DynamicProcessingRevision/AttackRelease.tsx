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

// Generate a drum hit waveform envelope
// Sharp transient then exponential decay
function drumEnvelope(t: number): number {
  if (t < 0) return 0;
  // Sharp attack
  if (t < 0.05) return t / 0.05;
  // Exponential decay
  return Math.exp(-(t - 0.05) * 4);
}

// Apply compression with given attack time
function compressedDrumPoints(
  numPoints: number,
  attackTimeFraction: number, // 0 = instant, higher = slower
  thresholdLevel: number,
): { original: string; compressed: string } {
  const width = 700;
  const height = 300;
  const origPts: string[] = [];
  const compPts: string[] = [];

  let gainReduction = 0;

  for (let i = 0; i < numPoints; i++) {
    const t = i / numPoints;
    const env = drumEnvelope(t * 2); // scale time
    const amplitude = env;

    // Original waveform (with sine carrier)
    const carrier = Math.sin(t * Math.PI * 80);
    const origY = height / 2 - amplitude * carrier * (height / 2 - 10);
    origPts.push(`${(t * width).toFixed(1)},${origY.toFixed(1)}`);

    // Compression logic
    const targetReduction =
      amplitude > thresholdLevel ? (amplitude - thresholdLevel) * 0.75 : 0;

    // Attack: gain reduction increases toward target
    if (targetReduction > gainReduction) {
      gainReduction += (targetReduction - gainReduction) * attackTimeFraction;
    } else {
      // Release: gain reduction decreases (fixed moderate release)
      gainReduction += (targetReduction - gainReduction) * 0.05;
    }

    const compAmplitude = amplitude - gainReduction;
    const compY =
      height / 2 - compAmplitude * carrier * (height / 2 - 10);
    compPts.push(`${(t * width).toFixed(1)},${compY.toFixed(1)}`);
  }

  return { original: origPts.join(" "), compressed: compPts.join(" ") };
}

export const AttackRelease: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const thresholdLevel = 0.4;
  const fastAttack = compressedDrumPoints(400, 0.8, thresholdLevel);
  const slowAttack = compressedDrumPoints(400, 0.03, thresholdLevel);

  const svgWidth = 700;
  const svgHeight = 300;

  // Title
  const titleOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Fast attack section (0-7s)
  const fastDrawProgress = interpolate(frame, [0.5 * fps, 2 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const fastCompressedOpacity = interpolate(
    frame,
    [2.5 * fps, 3.5 * fps],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );
  const fastLabelOpacity = interpolate(
    frame,
    [3.5 * fps, 4.5 * fps],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );

  // Slow attack section (7-14s)
  const slowSectionOpacity = interpolate(
    frame,
    [6.5 * fps, 7.5 * fps],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );
  const slowDrawProgress = interpolate(
    frame,
    [7 * fps, 8.5 * fps],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );
  const slowCompressedOpacity = interpolate(
    frame,
    [9 * fps, 10 * fps],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );
  const slowLabelOpacity = interpolate(
    frame,
    [10 * fps, 11 * fps],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );

  // Bottom takeaway
  const takeawayScale = spring({
    frame: Math.max(0, frame - 12.5 * fps),
    fps,
    config: { damping: 200 },
  });

  const totalPathLength = svgWidth * 3;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.bg,
        fontFamily,
        width: "100%",
        height: "100%",
        gap: 30,
      }}
    >
      {/* Title */}
      <div
        style={{
          color: COLORS.text,
          fontSize: 40,
          fontWeight: 700,
          opacity: titleOpacity,
          marginBottom: 10,
        }}
      >
        Attack Time
      </div>

      {/* Fast Attack */}
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        <div style={{ width: 160, textAlign: "right" }}>
          <div
            style={{
              color: COLORS.accent,
              fontSize: 28,
              fontWeight: 700,
              opacity: fastLabelOpacity,
            }}
          >
            Fast Attack
          </div>
          <div
            style={{
              color: COLORS.secondary,
              fontSize: 20,
              opacity: fastLabelOpacity,
              marginTop: 8,
            }}
          >
            Transient squashed
          </div>
        </div>
        <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          {/* Threshold lines */}
          <line
            x1={0} y1={svgHeight / 2 - thresholdLevel * (svgHeight / 2 - 10)}
            x2={svgWidth} y2={svgHeight / 2 - thresholdLevel * (svgHeight / 2 - 10)}
            stroke={COLORS.threshold} strokeWidth={1.5} strokeDasharray="6,4" opacity={0.5}
          />
          <line
            x1={0} y1={svgHeight / 2 + thresholdLevel * (svgHeight / 2 - 10)}
            x2={svgWidth} y2={svgHeight / 2 + thresholdLevel * (svgHeight / 2 - 10)}
            stroke={COLORS.threshold} strokeWidth={1.5} strokeDasharray="6,4" opacity={0.5}
          />
          {/* Original waveform */}
          <polyline
            points={fastAttack.original}
            fill="none" stroke={COLORS.text} strokeWidth={1.5} opacity={0.25}
            strokeDasharray={totalPathLength}
            strokeDashoffset={totalPathLength * (1 - fastDrawProgress)}
          />
          {/* Compressed waveform */}
          <polyline
            points={fastAttack.compressed}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            opacity={fastCompressedOpacity}
          />
        </svg>
      </div>

      {/* Slow Attack */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 40,
          opacity: slowSectionOpacity,
        }}
      >
        <div style={{ width: 160, textAlign: "right" }}>
          <div
            style={{
              color: COLORS.accent,
              fontSize: 28,
              fontWeight: 700,
              opacity: slowLabelOpacity,
            }}
          >
            Slow Attack
          </div>
          <div
            style={{
              color: COLORS.secondary,
              fontSize: 20,
              opacity: slowLabelOpacity,
              marginTop: 8,
            }}
          >
            Transient preserved
          </div>
        </div>
        <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          {/* Threshold lines */}
          <line
            x1={0} y1={svgHeight / 2 - thresholdLevel * (svgHeight / 2 - 10)}
            x2={svgWidth} y2={svgHeight / 2 - thresholdLevel * (svgHeight / 2 - 10)}
            stroke={COLORS.threshold} strokeWidth={1.5} strokeDasharray="6,4" opacity={0.5}
          />
          <line
            x1={0} y1={svgHeight / 2 + thresholdLevel * (svgHeight / 2 - 10)}
            x2={svgWidth} y2={svgHeight / 2 + thresholdLevel * (svgHeight / 2 - 10)}
            stroke={COLORS.threshold} strokeWidth={1.5} strokeDasharray="6,4" opacity={0.5}
          />
          {/* Original waveform */}
          <polyline
            points={slowAttack.original}
            fill="none" stroke={COLORS.text} strokeWidth={1.5} opacity={0.25}
            strokeDasharray={totalPathLength}
            strokeDashoffset={totalPathLength * (1 - slowDrawProgress)}
          />
          {/* Compressed waveform */}
          <polyline
            points={slowAttack.compressed}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            opacity={slowCompressedOpacity}
          />
        </svg>
      </div>

      {/* Takeaway */}
      <div
        style={{
          transform: `scale(${takeawayScale})`,
          backgroundColor: "rgba(255, 107, 53, 0.15)",
          border: `2px solid ${COLORS.accent}`,
          borderRadius: 12,
          padding: "16px 40px",
          marginTop: 10,
        }}
      >
        <span style={{ color: COLORS.accent, fontSize: 26, fontWeight: 700 }}>
          Slow attack = preserves punch
        </span>
      </div>
    </div>
  );
};
