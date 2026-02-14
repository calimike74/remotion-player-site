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

// Envelope geometry constants
const CHART = {
  x: 200,
  y: 120,
  w: 1520,
  h: 600,
  peakY: 140,
  sustainY: 380,
  baseY: 700,
};

// Key points on the envelope
const PTS = {
  start: { x: CHART.x, y: CHART.baseY },
  peak: { x: CHART.x + 250, y: CHART.peakY },
  sustainStart: { x: CHART.x + 520, y: CHART.sustainY },
  sustainEnd: { x: CHART.x + 950, y: CHART.sustainY },
  end: { x: CHART.x + 1300, y: CHART.baseY },
};

// Key released x position
const KEY_RELEASED_X = PTS.sustainEnd.x;

interface LabelProps {
  x: number;
  y: number;
  letter: string;
  text: string;
  highlightWord?: string;
  opacity: number;
  color: string;
}

const StageLabel: React.FC<LabelProps> = ({
  x,
  y,
  letter,
  text,
  highlightWord,
  opacity,
  color,
}) => {
  let displayText: React.ReactNode = text;
  if (highlightWord) {
    const parts = text.split(highlightWord);
    displayText = (
      <>
        {parts[0]}
        <tspan fill={COLORS.accent} fontWeight={700}>
          {highlightWord}
        </tspan>
        {parts[1] || ""}
      </>
    );
  }

  return (
    <g opacity={opacity}>
      <text
        x={x}
        y={y}
        fill={color}
        fontSize={60}
        fontWeight={700}
        textAnchor="middle"
        fontFamily={fontFamily}
      >
        {letter}
      </text>
      <text
        x={x}
        y={y + 36}
        fill={COLORS.secondary}
        fontSize={22}
        textAnchor="middle"
        fontFamily={fontFamily}
      >
        {displayText}
      </text>
    </g>
  );
};

// Small example envelope
interface MiniEnvelopeProps {
  label: string;
  description: string;
  attackW: number;
  decayW: number;
  sustainLevel: number;
  sustainW: number;
  releaseW: number;
  opacity: number;
  x: number;
  y: number;
}

const MiniEnvelope: React.FC<MiniEnvelopeProps> = ({
  label,
  description,
  attackW,
  decayW,
  sustainLevel,
  sustainW,
  releaseW,
  opacity,
  x,
  y,
}) => {
  const h = 80;
  const baseY = y + h;
  const peakY = y;
  const susY = y + h * (1 - sustainLevel);

  const path = [
    `M${x},${baseY}`,
    `L${x + attackW},${peakY}`,
    `L${x + attackW + decayW},${susY}`,
    `L${x + attackW + decayW + sustainW},${susY}`,
    `L${x + attackW + decayW + sustainW + releaseW},${baseY}`,
  ].join(" ");

  return (
    <g opacity={opacity}>
      <path
        d={path}
        fill="none"
        stroke={COLORS.teal}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x={x + (attackW + decayW + sustainW + releaseW) / 2}
        y={baseY + 30}
        fill={COLORS.text}
        fontSize={22}
        fontWeight={700}
        textAnchor="middle"
        fontFamily={fontFamily}
      >
        {label}
      </text>
      <text
        x={x + (attackW + decayW + sustainW + releaseW) / 2}
        y={baseY + 56}
        fill={COLORS.secondary}
        fontSize={18}
        textAnchor="middle"
        fontFamily={fontFamily}
      >
        {description}
      </text>
    </g>
  );
};

export const ADSREnvelope: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase progress values
  const attackDraw = interpolate(frame, [0, 4 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const decayDraw = interpolate(frame, [5 * fps, 9 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const sustainDraw = interpolate(frame, [10 * fps, 13 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const releaseDraw = interpolate(frame, [14 * fps, 17 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Label opacities
  const attackLabelOp = interpolate(frame, [1 * fps, 2 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const decayLabelOp = interpolate(frame, [6 * fps, 7 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const sustainLabelOp = interpolate(frame, [10.5 * fps, 11.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const releaseLabelOp = interpolate(frame, [14.5 * fps, 15.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Examples opacity
  const examplesOpacity = interpolate(frame, [18 * fps, 19 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Build the progressive path
  const buildPath = (): string => {
    const segments: string[] = [`M${PTS.start.x},${PTS.start.y}`];

    if (attackDraw > 0) {
      const ax = PTS.start.x + (PTS.peak.x - PTS.start.x) * attackDraw;
      const ay = PTS.start.y + (PTS.peak.y - PTS.start.y) * attackDraw;
      segments.push(`L${ax},${ay}`);
    }

    if (decayDraw > 0) {
      segments.length = 0;
      segments.push(`M${PTS.start.x},${PTS.start.y}`);
      segments.push(`L${PTS.peak.x},${PTS.peak.y}`);
      const dx =
        PTS.peak.x + (PTS.sustainStart.x - PTS.peak.x) * decayDraw;
      const dy =
        PTS.peak.y + (PTS.sustainStart.y - PTS.peak.y) * decayDraw;
      segments.push(`L${dx},${dy}`);
    }

    if (sustainDraw > 0) {
      segments.length = 0;
      segments.push(`M${PTS.start.x},${PTS.start.y}`);
      segments.push(`L${PTS.peak.x},${PTS.peak.y}`);
      segments.push(`L${PTS.sustainStart.x},${PTS.sustainStart.y}`);
      const sx =
        PTS.sustainStart.x +
        (PTS.sustainEnd.x - PTS.sustainStart.x) * sustainDraw;
      segments.push(`L${sx},${PTS.sustainStart.y}`);
    }

    if (releaseDraw > 0) {
      segments.length = 0;
      segments.push(`M${PTS.start.x},${PTS.start.y}`);
      segments.push(`L${PTS.peak.x},${PTS.peak.y}`);
      segments.push(`L${PTS.sustainStart.x},${PTS.sustainStart.y}`);
      segments.push(`L${PTS.sustainEnd.x},${PTS.sustainEnd.y}`);
      const rx =
        PTS.sustainEnd.x + (PTS.end.x - PTS.sustainEnd.x) * releaseDraw;
      const ry =
        PTS.sustainEnd.y + (PTS.end.y - PTS.sustainEnd.y) * releaseDraw;
      segments.push(`L${rx},${ry}`);
    }

    return segments.join(" ");
  };

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
          y={70}
          fill={COLORS.text}
          fontSize={44}
          fontWeight={700}
          textAnchor="middle"
          fontFamily={fontFamily}
        >
          ADSR Envelope
        </text>

        {/* Axes */}
        {/* X-axis (time) */}
        <line
          x1={CHART.x}
          y1={CHART.baseY}
          x2={CHART.x + CHART.w}
          y2={CHART.baseY}
          stroke="rgba(255,251,245,0.3)"
          strokeWidth={2}
        />
        {/* Y-axis (amplitude) */}
        <line
          x1={CHART.x}
          y1={CHART.peakY - 20}
          x2={CHART.x}
          y2={CHART.baseY}
          stroke="rgba(255,251,245,0.3)"
          strokeWidth={2}
        />

        {/* Amplitude label */}
        <text
          x={CHART.x - 40}
          y={CHART.peakY}
          fill={COLORS.secondary}
          fontSize={18}
          textAnchor="end"
          fontFamily={fontFamily}
        >
          Peak
        </text>
        <text
          x={CHART.x - 40}
          y={CHART.sustainY}
          fill={COLORS.secondary}
          fontSize={18}
          textAnchor="end"
          fontFamily={fontFamily}
        >
          Sustain
        </text>

        {/* Dashed guides */}
        <line
          x1={CHART.x}
          y1={CHART.peakY}
          x2={PTS.peak.x + 40}
          y2={CHART.peakY}
          stroke="rgba(255,251,245,0.12)"
          strokeWidth={1}
          strokeDasharray="6,6"
        />
        <line
          x1={CHART.x}
          y1={CHART.sustainY}
          x2={PTS.sustainEnd.x + 40}
          y2={CHART.sustainY}
          stroke="rgba(255,251,245,0.12)"
          strokeWidth={1}
          strokeDasharray="6,6"
        />

        {/* Key pressed / released markers */}
        <text
          x={PTS.start.x}
          y={CHART.baseY + 40}
          fill={COLORS.teal}
          fontSize={18}
          textAnchor="middle"
          fontFamily={fontFamily}
        >
          Key pressed
        </text>
        <line
          x1={PTS.start.x}
          y1={CHART.baseY}
          x2={PTS.start.x}
          y2={CHART.baseY + 10}
          stroke={COLORS.teal}
          strokeWidth={2}
        />

        <text
          x={KEY_RELEASED_X}
          y={CHART.baseY + 40}
          fill={COLORS.pink}
          fontSize={18}
          textAnchor="middle"
          fontFamily={fontFamily}
          opacity={sustainDraw > 0.5 ? 1 : 0}
        >
          Key released
        </text>
        <line
          x1={KEY_RELEASED_X}
          y1={CHART.baseY}
          x2={KEY_RELEASED_X}
          y2={CHART.baseY + 10}
          stroke={COLORS.pink}
          strokeWidth={2}
          opacity={sustainDraw > 0.5 ? 1 : 0}
        />

        {/* The envelope path */}
        <path
          d={buildPath()}
          fill="none"
          stroke={COLORS.text}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Stage labels - A and D spaced apart to avoid overlap */}
        <StageLabel
          x={(PTS.start.x + PTS.peak.x) / 2 - 40}
          y={CHART.peakY - 50}
          letter="A"
          text="Attack: time to maximum"
          opacity={attackLabelOp}
          color={COLORS.accent}
        />
        <StageLabel
          x={(PTS.peak.x + PTS.sustainStart.x) / 2 + 60}
          y={CHART.peakY - 50}
          letter="D"
          text="Decay: time to sustain level"
          opacity={decayLabelOp}
          color={COLORS.accent}
        />
        <StageLabel
          x={(PTS.sustainStart.x + PTS.sustainEnd.x) / 2}
          y={CHART.sustainY - 80}
          letter="S"
          text="Sustain: a LEVEL, not a time"
          highlightWord="LEVEL"
          opacity={sustainLabelOp}
          color={COLORS.accent}
        />
        <StageLabel
          x={(PTS.sustainEnd.x + PTS.end.x) / 2}
          y={CHART.sustainY - 80}
          letter="R"
          text="Release: time to silence"
          opacity={releaseLabelOp}
          color={COLORS.accent}
        />

        {/* Example envelopes */}
        <MiniEnvelope
          label="Plucked string"
          description="Fast attack, low sustain"
          attackW={15}
          decayW={40}
          sustainLevel={0.1}
          sustainW={60}
          releaseW={30}
          opacity={examplesOpacity}
          x={480}
          y={830}
        />
        <MiniEnvelope
          label="Pad"
          description="Slow attack, high sustain"
          attackW={60}
          decayW={30}
          sustainLevel={0.8}
          sustainW={80}
          releaseW={50}
          opacity={examplesOpacity}
          x={1100}
          y={830}
        />
      </svg>
    </div>
  );
};
