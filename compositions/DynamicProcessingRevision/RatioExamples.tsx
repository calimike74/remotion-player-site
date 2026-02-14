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
  grid: "rgba(255, 251, 245, 0.08)",
  ratio10: "#4ECDC4",
};

const MARGIN = { top: 60, right: 200, bottom: 80, left: 80 };
const GRAPH_W = 600;
const GRAPH_H = 600;
const DB_MIN = -60;
const DB_MAX = 0;
const THRESHOLD_DB = -20;

function dbToX(db: number): number {
  return MARGIN.left + ((db - DB_MIN) / (DB_MAX - DB_MIN)) * GRAPH_W;
}

function dbToY(db: number): number {
  return MARGIN.top + GRAPH_H - ((db - DB_MIN) / (DB_MAX - DB_MIN)) * GRAPH_H;
}

interface RatioLine {
  ratio: number;
  label: string;
  color: string;
  startDelaySec: number;
}

const RATIOS: RatioLine[] = [
  { ratio: 4, label: "4:1", color: COLORS.accent, startDelaySec: 1 },
  { ratio: 10, label: "10:1", color: COLORS.ratio10, startDelaySec: 4 },
  { ratio: Infinity, label: "\u221E:1 (Limiter)", color: COLORS.threshold, startDelaySec: 7 },
];

export const RatioExamples: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const threshX = dbToX(THRESHOLD_DB);
  const threshY = dbToY(THRESHOLD_DB);

  // Title fade in
  const titleOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.bg,
        fontFamily,
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          right: 0,
          textAlign: "center",
          color: COLORS.text,
          fontSize: 40,
          fontWeight: 700,
          opacity: titleOpacity,
        }}
      >
        Ratio Comparison
      </div>

      <svg
        width={GRAPH_W + MARGIN.left + MARGIN.right}
        height={GRAPH_H + MARGIN.top + MARGIN.bottom}
        viewBox={`0 0 ${GRAPH_W + MARGIN.left + MARGIN.right} ${GRAPH_H + MARGIN.top + MARGIN.bottom}`}
      >
        {/* Grid */}
        {[-50, -40, -30, -20, -10].map((db) => (
          <g key={db} opacity={0.5}>
            <line
              x1={dbToX(db)} y1={MARGIN.top} x2={dbToX(db)} y2={MARGIN.top + GRAPH_H}
              stroke={COLORS.grid} strokeWidth={1}
            />
            <line
              x1={MARGIN.left} y1={dbToY(db)} x2={MARGIN.left + GRAPH_W} y2={dbToY(db)}
              stroke={COLORS.grid} strokeWidth={1}
            />
          </g>
        ))}

        {/* Axes */}
        <line
          x1={MARGIN.left} y1={MARGIN.top + GRAPH_H}
          x2={MARGIN.left + GRAPH_W} y2={MARGIN.top + GRAPH_H}
          stroke={COLORS.text} strokeWidth={2}
        />
        <line
          x1={MARGIN.left} y1={MARGIN.top + GRAPH_H}
          x2={MARGIN.left} y2={MARGIN.top}
          stroke={COLORS.text} strokeWidth={2}
        />

        {/* Tick labels */}
        {[-60, -40, -20, 0].map((db) => (
          <g key={`tick-${db}`}>
            <text
              x={dbToX(db)} y={MARGIN.top + GRAPH_H + 30}
              fill={COLORS.secondary} fontSize={18} textAnchor="middle" fontFamily={fontFamily}
            >
              {db}
            </text>
            <text
              x={MARGIN.left - 15} y={dbToY(db) + 6}
              fill={COLORS.secondary} fontSize={18} textAnchor="end" fontFamily={fontFamily}
            >
              {db}
            </text>
          </g>
        ))}

        {/* Axis labels */}
        <text
          x={MARGIN.left + GRAPH_W / 2} y={MARGIN.top + GRAPH_H + 65}
          fill={COLORS.text} fontSize={22} fontWeight={700} textAnchor="middle" fontFamily={fontFamily}
        >
          Input (dB)
        </text>
        <text
          x={20} y={MARGIN.top + GRAPH_H / 2}
          fill={COLORS.text} fontSize={22} fontWeight={700} textAnchor="middle" fontFamily={fontFamily}
          transform={`rotate(-90, 20, ${MARGIN.top + GRAPH_H / 2})`}
        >
          Output (dB)
        </text>

        {/* 1:1 line below threshold (always visible) */}
        <line
          x1={dbToX(DB_MIN)} y1={dbToY(DB_MIN)}
          x2={threshX} y2={threshY}
          stroke={COLORS.text} strokeWidth={2.5} opacity={0.4}
        />

        {/* 1:1 line above threshold (faded reference) */}
        <line
          x1={threshX} y1={threshY}
          x2={dbToX(DB_MAX)} y2={dbToY(DB_MAX)}
          stroke={COLORS.text} strokeWidth={1.5} opacity={0.12}
          strokeDasharray="6,6"
        />

        {/* Threshold marker */}
        <line
          x1={threshX} y1={MARGIN.top} x2={threshX} y2={MARGIN.top + GRAPH_H}
          stroke={COLORS.threshold} strokeWidth={1.5} strokeDasharray="6,5" opacity={0.4}
        />
        <circle cx={threshX} cy={threshY} r={5} fill={COLORS.threshold} />

        {/* Ratio lines */}
        {RATIOS.map(({ ratio, label, color, startDelaySec }) => {
          const lineProgress = spring({
            frame: Math.max(0, frame - startDelaySec * fps),
            fps,
            config: { damping: 200 },
          });

          // Calculate end point
          const inputRange = DB_MAX - THRESHOLD_DB; // 20 dB
          const outputIncrease = ratio === Infinity ? 0 : inputRange / ratio;
          const endOutputDB = THRESHOLD_DB + outputIncrease;
          const endX = dbToX(DB_MAX);
          const endY = dbToY(endOutputDB);

          const lineLength = Math.sqrt(
            (endX - threshX) ** 2 + (endY - threshY) ** 2,
          );

          // Label appears slightly after line
          const labelOpacity = interpolate(
            frame,
            [(startDelaySec + 1) * fps, (startDelaySec + 1.5) * fps],
            [0, 1],
            { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
          );

          // Position label at end of line, with forced vertical spacing
          // End points are too close (only 5dB spread), so we manually
          // space labels vertically: 4:1 at top, 10:1 middle, ∞:1 bottom
          const labelPositions: Record<string, number> = {
            "4:1": -10,
            "10:1": -18,
            "\u221E:1 (Limiter)": -26,
          };
          const labelY = dbToY(labelPositions[label] ?? endOutputDB);

          return (
            <g key={label}>
              <line
                x1={threshX} y1={threshY}
                x2={endX} y2={endY}
                stroke={color} strokeWidth={3}
                strokeDasharray={lineLength}
                strokeDashoffset={lineLength * (1 - lineProgress)}
              />
              {/* Leader line from label to actual line end */}
              <line
                x1={endX} y1={endY}
                x2={endX + 15} y2={labelY}
                stroke={color} strokeWidth={1} opacity={labelOpacity * 0.5}
              />
              <text
                x={endX + 20} y={labelY + 6}
                fill={color} fontSize={24} fontWeight={700} fontFamily={fontFamily}
                opacity={labelOpacity}
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend on right side */}
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 120,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {RATIOS.map(({ label, color, startDelaySec }) => {
          const opacity = interpolate(
            frame,
            [(startDelaySec + 1) * fps, (startDelaySec + 1.5) * fps],
            [0, 1],
            { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
          );
          return (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                opacity,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 4,
                  backgroundColor: color,
                  borderRadius: 2,
                }}
              />
              <span style={{ color, fontSize: 22, fontWeight: 700 }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
