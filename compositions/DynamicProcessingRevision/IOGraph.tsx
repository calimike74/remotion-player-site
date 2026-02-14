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
};

// Graph constants
const MARGIN = { top: 60, right: 80, bottom: 80, left: 80 };
const GRAPH_W = 600;
const GRAPH_H = 600;
const SVG_W = GRAPH_W + MARGIN.left + MARGIN.right;
const SVG_H = GRAPH_H + MARGIN.top + MARGIN.bottom;

// dB range: -60 to 0
const DB_MIN = -60;
const DB_MAX = 0;
const THRESHOLD_DB = -20;

// Convert dB value to pixel position within graph area
function dbToX(db: number): number {
  return MARGIN.left + ((db - DB_MIN) / (DB_MAX - DB_MIN)) * GRAPH_W;
}

function dbToY(db: number): number {
  return MARGIN.top + GRAPH_H - ((db - DB_MIN) / (DB_MAX - DB_MIN)) * GRAPH_H;
}

export const IOGraph: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Step 1 (0-3s): Axes draw in
  const axesProgress = interpolate(frame, [0, 2 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const axesLabelOpacity = interpolate(frame, [1.5 * fps, 2.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Step 2 (3-6s): 1:1 diagonal line
  const diagonalProgress = interpolate(
    frame,
    [3 * fps, 5.5 * fps],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );

  const diagonalLabelOpacity = interpolate(
    frame,
    [5 * fps, 6 * fps],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );

  // Step 3 (6-9s): Threshold markers
  const thresholdOpacity = interpolate(
    frame,
    [6 * fps, 7.5 * fps],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );

  const thresholdLabelScale = spring({
    frame: Math.max(0, frame - 7 * fps),
    fps,
    config: { damping: 200 },
  });

  // Step 4 (9-14s): Compressed line bends above threshold
  const compressedProgress = interpolate(
    frame,
    [9 * fps, 13 * fps],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );

  // Fade out 1:1 line above threshold when compressed line appears
  const diagonalAboveOpacity = interpolate(
    frame,
    [9 * fps, 11 * fps],
    [1, 0.15],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );

  // Step 5 (14-18s): Labels
  const belowLabelOpacity = interpolate(
    frame,
    [14 * fps, 15 * fps],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );

  const aboveLabelOpacity = interpolate(
    frame,
    [15.5 * fps, 16.5 * fps],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );

  // Key coordinates
  const threshX = dbToX(THRESHOLD_DB);
  const threshY = dbToY(THRESHOLD_DB);

  // 1:1 line path: from (-60,-60) to (0,0)
  const diagStartX = dbToX(DB_MIN);
  const diagStartY = dbToY(DB_MIN);
  const diagEndX = dbToX(DB_MAX);
  const diagEndY = dbToY(DB_MAX);
  const diagonalLength = Math.sqrt(
    (diagEndX - diagStartX) ** 2 + (diagEndY - diagStartY) ** 2,
  );

  // Compressed line above threshold: 4:1 ratio
  // At 4:1, for every 4dB input increase, output increases 1dB
  // From threshold (-20dB) to 0dB input is 20dB range
  // Output: -20 + 20/4 = -15dB
  const ratio = 4;
  const compEndInputDB = DB_MAX; // 0 dB
  const compEndOutputDB = THRESHOLD_DB + (compEndInputDB - THRESHOLD_DB) / ratio; // -15 dB
  const compEndX = dbToX(compEndInputDB);
  const compEndY = dbToY(compEndOutputDB);
  const compressedLineLength = Math.sqrt(
    (compEndX - threshX) ** 2 + (compEndY - threshY) ** 2,
  );

  // Grid lines at -40, -20, 0
  const gridDBValues = [-50, -40, -30, -20, -10];

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
      }}
    >
      <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`}>
        {/* Grid lines */}
        {gridDBValues.map((db) => (
          <g key={db} opacity={axesProgress * 0.5}>
            <line
              x1={dbToX(db)}
              y1={MARGIN.top}
              x2={dbToX(db)}
              y2={MARGIN.top + GRAPH_H}
              stroke={COLORS.grid}
              strokeWidth={1}
            />
            <line
              x1={MARGIN.left}
              y1={dbToY(db)}
              x2={MARGIN.left + GRAPH_W}
              y2={dbToY(db)}
              stroke={COLORS.grid}
              strokeWidth={1}
            />
          </g>
        ))}

        {/* X-axis */}
        <line
          x1={MARGIN.left}
          y1={MARGIN.top + GRAPH_H}
          x2={MARGIN.left + GRAPH_W * axesProgress}
          y2={MARGIN.top + GRAPH_H}
          stroke={COLORS.text}
          strokeWidth={2}
        />
        {/* Y-axis */}
        <line
          x1={MARGIN.left}
          y1={MARGIN.top + GRAPH_H}
          x2={MARGIN.left}
          y2={MARGIN.top + GRAPH_H - GRAPH_H * axesProgress}
          stroke={COLORS.text}
          strokeWidth={2}
        />

        {/* Axis tick marks and labels */}
        {[-60, -40, -20, 0].map((db) => (
          <g key={`tick-${db}`} opacity={axesLabelOpacity}>
            {/* X-axis tick */}
            <line
              x1={dbToX(db)}
              y1={MARGIN.top + GRAPH_H}
              x2={dbToX(db)}
              y2={MARGIN.top + GRAPH_H + 8}
              stroke={COLORS.text}
              strokeWidth={1.5}
            />
            <text
              x={dbToX(db)}
              y={MARGIN.top + GRAPH_H + 30}
              fill={COLORS.secondary}
              fontSize={18}
              textAnchor="middle"
              fontFamily={fontFamily}
            >
              {db}
            </text>
            {/* Y-axis tick */}
            <line
              x1={MARGIN.left - 8}
              y1={dbToY(db)}
              x2={MARGIN.left}
              y2={dbToY(db)}
              stroke={COLORS.text}
              strokeWidth={1.5}
            />
            <text
              x={MARGIN.left - 15}
              y={dbToY(db) + 6}
              fill={COLORS.secondary}
              fontSize={18}
              textAnchor="end"
              fontFamily={fontFamily}
            >
              {db}
            </text>
          </g>
        ))}

        {/* Axis labels */}
        <text
          x={MARGIN.left + GRAPH_W / 2}
          y={MARGIN.top + GRAPH_H + 65}
          fill={COLORS.text}
          fontSize={24}
          fontWeight={700}
          textAnchor="middle"
          fontFamily={fontFamily}
          opacity={axesLabelOpacity}
        >
          Input (dB)
        </text>
        <text
          x={20}
          y={MARGIN.top + GRAPH_H / 2}
          fill={COLORS.text}
          fontSize={24}
          fontWeight={700}
          textAnchor="middle"
          fontFamily={fontFamily}
          opacity={axesLabelOpacity}
          transform={`rotate(-90, 20, ${MARGIN.top + GRAPH_H / 2})`}
        >
          Output (dB)
        </text>

        {/* 1:1 diagonal line - below threshold (always full opacity) */}
        <line
          x1={diagStartX}
          y1={diagStartY}
          x2={threshX}
          y2={threshY}
          stroke={COLORS.text}
          strokeWidth={3}
          strokeDasharray={diagonalLength}
          strokeDashoffset={diagonalLength * (1 - diagonalProgress)}
        />

        {/* 1:1 diagonal line - above threshold (fades when compressed line appears) */}
        <line
          x1={threshX}
          y1={threshY}
          x2={diagEndX}
          y2={diagEndY}
          stroke={COLORS.text}
          strokeWidth={3}
          strokeDasharray={diagonalLength}
          strokeDashoffset={diagonalLength * (1 - diagonalProgress)}
          opacity={diagonalAboveOpacity}
        />

        {/* 1:1 label */}
        <text
          x={diagEndX - 20}
          y={diagEndY - 20}
          fill={COLORS.secondary}
          fontSize={20}
          fontFamily={fontFamily}
          opacity={diagonalLabelOpacity}
        >
          1:1
        </text>

        {/* Threshold markers */}
        {/* Vertical dashed line at threshold on X-axis */}
        <line
          x1={threshX}
          y1={MARGIN.top}
          x2={threshX}
          y2={MARGIN.top + GRAPH_H}
          stroke={COLORS.threshold}
          strokeWidth={2}
          strokeDasharray="8,6"
          opacity={thresholdOpacity}
        />
        {/* Horizontal dashed line at threshold on Y-axis */}
        <line
          x1={MARGIN.left}
          y1={threshY}
          x2={MARGIN.left + GRAPH_W}
          y2={threshY}
          stroke={COLORS.threshold}
          strokeWidth={2}
          strokeDasharray="8,6"
          opacity={thresholdOpacity}
        />

        {/* Threshold label */}
        <text
          x={threshX + 10}
          y={MARGIN.top - 10}
          fill={COLORS.threshold}
          fontSize={22}
          fontWeight={700}
          fontFamily={fontFamily}
          opacity={thresholdOpacity}
          transform={`scale(${thresholdLabelScale})`}
          style={{ transformOrigin: `${threshX + 10}px ${MARGIN.top - 10}px` }}
        >
          Threshold: {THRESHOLD_DB} dB
        </text>

        {/* Dot at threshold/knee point */}
        <circle
          cx={threshX}
          cy={threshY}
          r={6}
          fill={COLORS.threshold}
          opacity={thresholdOpacity}
        />

        {/* Compressed line above threshold (4:1) */}
        <line
          x1={threshX}
          y1={threshY}
          x2={compEndX}
          y2={compEndY}
          stroke={COLORS.accent}
          strokeWidth={3.5}
          strokeDasharray={compressedLineLength}
          strokeDashoffset={compressedLineLength * (1 - compressedProgress)}
        />

        {/* 4:1 ratio label */}
        <text
          x={(threshX + compEndX) / 2 + 15}
          y={(threshY + compEndY) / 2 - 15}
          fill={COLORS.accent}
          fontSize={24}
          fontWeight={700}
          fontFamily={fontFamily}
          opacity={compressedProgress > 0.5 ? interpolate(compressedProgress, [0.5, 0.8], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }) : 0}
        >
          4:1
        </text>
      </svg>

      {/* Side labels */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}
      >
        <div
          style={{
            color: COLORS.text,
            fontSize: 26,
            opacity: belowLabelOpacity,
            lineHeight: 1.5,
          }}
        >
          Below threshold:{"\n"}
          <span style={{ color: COLORS.secondary, fontSize: 22 }}>
            unchanged
          </span>
        </div>
        <div
          style={{
            color: COLORS.accent,
            fontSize: 26,
            fontWeight: 700,
            opacity: aboveLabelOpacity,
            lineHeight: 1.5,
          }}
        >
          Above threshold:{"\n"}
          <span style={{ fontSize: 22, fontWeight: 400 }}>compressed</span>
        </div>
      </div>
    </div>
  );
};
