import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

const COLORS = {
  bg: "#1a1a2e",
  text: "#FFFBF5",
  accent: "#FF6B35",
  teal: "#4ECDC4",
  pink: "#E85D75",
  secondary: "rgba(255, 251, 245, 0.6)",
};

// Generate SVG path data for each waveform (2 cycles)
function sinePath(w: number, h: number, amp: number): string {
  const points: string[] = [];
  const steps = 200;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w;
    const y = h / 2 - Math.sin((i / steps) * 4 * Math.PI) * amp;
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(" ");
}

function squarePath(w: number, h: number, amp: number): string {
  const points: string[] = [];
  const cycles = 2;
  const cycleW = w / cycles;
  for (let c = 0; c < cycles; c++) {
    const x0 = c * cycleW;
    const halfW = cycleW / 2;
    const top = h / 2 - amp;
    const bottom = h / 2 + amp;
    const mid = h / 2;
    if (c === 0) points.push(`M${x0},${mid}`);
    points.push(`L${x0},${top}`);
    points.push(`L${x0 + halfW},${top}`);
    points.push(`L${x0 + halfW},${bottom}`);
    points.push(`L${x0 + cycleW},${bottom}`);
    if (c === cycles - 1) points.push(`L${x0 + cycleW},${mid}`);
  }
  return points.join(" ");
}

function sawtoothPath(w: number, h: number, amp: number): string {
  const points: string[] = [];
  const cycles = 2;
  const cycleW = w / cycles;
  for (let c = 0; c < cycles; c++) {
    const x0 = c * cycleW;
    const top = h / 2 - amp;
    const bottom = h / 2 + amp;
    if (c === 0) points.push(`M${x0},${h / 2}`);
    points.push(`L${x0},${bottom}`);
    points.push(`L${x0 + cycleW},${top}`);
    if (c === cycles - 1) points.push(`L${x0 + cycleW},${h / 2}`);
  }
  return points.join(" ");
}

function trianglePath(w: number, h: number, amp: number): string {
  const points: string[] = [];
  const cycles = 2;
  const cycleW = w / cycles;
  for (let c = 0; c < cycles; c++) {
    const x0 = c * cycleW;
    const top = h / 2 - amp;
    const bottom = h / 2 + amp;
    if (c === 0) points.push(`M${x0},${h / 2}`);
    points.push(`L${x0 + cycleW * 0.25},${top}`);
    points.push(`L${x0 + cycleW * 0.75},${bottom}`);
    points.push(`L${x0 + cycleW},${h / 2}`);
  }
  return points.join(" ");
}

interface WaveProps {
  pathData: string;
  color: string;
  label: string;
  description: string;
  progress: number;
  labelOpacity: number;
  svgW: number;
  svgH: number;
}

const WaveformCard: React.FC<WaveProps> = ({
  pathData,
  color,
  label,
  description,
  progress,
  labelOpacity,
  svgW,
  svgH,
}) => {
  // Estimate path length generously
  const pathLength = 1200;
  const dashOffset = pathLength * (1 - progress);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <svg
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ overflow: "visible" }}
      >
        {/* Center line */}
        <line
          x1={0}
          y1={svgH / 2}
          x2={svgW}
          y2={svgH / 2}
          stroke="rgba(255,251,245,0.15)"
          strokeWidth={1}
        />
        {/* Waveform */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div
        style={{
          opacity: labelOpacity,
          textAlign: "center",
        }}
      >
        <div style={{ color, fontSize: 30, fontWeight: 700 }}>{label}</div>
        <div
          style={{
            color: "rgba(255,251,245,0.6)",
            fontSize: 22,
            marginTop: 4,
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
};

export const Waveforms: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const svgW = 700;
  const svgH = 200;
  const amp = 70;

  const waveforms = [
    {
      pathData: sinePath(svgW, svgH, amp),
      color: COLORS.text,
      label: "Sine",
      description: "fundamental only",
    },
    {
      pathData: squarePath(svgW, svgH, amp),
      color: COLORS.accent,
      label: "Square",
      description: "odd harmonics (hollow)",
    },
    {
      pathData: sawtoothPath(svgW, svgH, amp),
      color: COLORS.teal,
      label: "Sawtooth",
      description: "all harmonics (bright)",
    },
    {
      pathData: trianglePath(svgW, svgH, amp),
      color: COLORS.pink,
      label: "Triangle",
      description: "odd harmonics, weak (soft)",
    },
  ];

  // Each waveform gets ~5s, staggered by ~4s
  const stagger = 4 * fps;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.bg,
        fontFamily,
        width: "100%",
        height: "100%",
        padding: 60,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px 80px",
          width: "100%",
          maxWidth: 1700,
        }}
      >
        {waveforms.map((wf, i) => {
          const startFrame = i * stagger;

          const drawProgress = interpolate(
            frame,
            [startFrame, startFrame + 2 * fps],
            [0, 1],
            { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
          );

          const labelOpacity = interpolate(
            frame,
            [startFrame + 1.5 * fps, startFrame + 2.5 * fps],
            [0, 1],
            { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
          );

          return (
            <WaveformCard
              key={i}
              pathData={wf.pathData}
              color={wf.color}
              label={wf.label}
              description={wf.description}
              progress={drawProgress}
              labelOpacity={labelOpacity}
              svgW={svgW}
              svgH={svgH}
            />
          );
        })}
      </div>
    </div>
  );
};
