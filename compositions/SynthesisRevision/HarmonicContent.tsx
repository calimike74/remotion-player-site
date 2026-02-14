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
  teal: "#4ECDC4",
  secondary: "rgba(255, 251, 245, 0.6)",
};

interface SpectrumProps {
  title: string;
  subtitle: string;
  color: string;
  harmonics: { number: number; amplitude: number }[];
  frame: number;
  fps: number;
  delay: number;
}

const Spectrum: React.FC<SpectrumProps> = ({
  title,
  subtitle,
  color,
  harmonics,
  frame,
  fps,
  delay,
}) => {
  const chartW = 700;
  const chartH = 400;
  const barW = 50;
  const barGap = (chartW - harmonics.length * barW) / (harmonics.length + 1);
  const maxBarH = chartH - 80; // leave room for labels

  const titleOpacity = interpolate(
    frame,
    [delay * fps, (delay + 0.5) * fps],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );

  const subtitleOpacity = interpolate(
    frame,
    [(delay + 3) * fps, (delay + 4) * fps],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      <div style={{ opacity: titleOpacity, color, fontSize: 36, fontWeight: 700 }}>
        {title}
      </div>

      <svg
        width={chartW}
        height={chartH}
        viewBox={`0 0 ${chartW} ${chartH}`}
      >
        {/* Y-axis */}
        <line
          x1={40}
          y1={20}
          x2={40}
          y2={chartH - 40}
          stroke="rgba(255,251,245,0.3)"
          strokeWidth={1}
        />
        {/* X-axis */}
        <line
          x1={40}
          y1={chartH - 40}
          x2={chartW - 20}
          y2={chartH - 40}
          stroke="rgba(255,251,245,0.3)"
          strokeWidth={1}
        />

        {/* Y-axis label */}
        <text
          x={15}
          y={chartH / 2}
          fill={COLORS.secondary}
          fontSize={16}
          textAnchor="middle"
          transform={`rotate(-90, 15, ${chartH / 2})`}
        >
          Amplitude
        </text>

        {/* Bars */}
        {harmonics.map((h, i) => {
          const barDelay = delay + 0.5 + i * 0.3;
          const barScale = spring({
            frame: frame - barDelay * fps,
            fps,
            config: { damping: 200 },
          });

          const barH = h.amplitude * maxBarH * Math.max(0, barScale);
          const x = 60 + i * (barW + barGap);
          const y = chartH - 40 - barH;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                fill={color}
                rx={4}
                opacity={0.9}
              />
              {/* Harmonic number label */}
              <text
                x={x + barW / 2}
                y={chartH - 20}
                fill={COLORS.text}
                fontSize={20}
                fontWeight={700}
                textAnchor="middle"
              >
                {h.number}
              </text>
              {/* Amplitude fraction label */}
              {barScale > 0.5 && (
                <text
                  x={x + barW / 2}
                  y={y - 10}
                  fill={COLORS.secondary}
                  fontSize={16}
                  textAnchor="middle"
                >
                  1/{h.number === 1 ? "1" : h.number}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div
        style={{
          opacity: subtitleOpacity,
          color: COLORS.secondary,
          fontSize: 26,
          fontWeight: 400,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};

export const HarmonicContent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const squareHarmonics = [
    { number: 1, amplitude: 1 },
    { number: 3, amplitude: 1 / 3 },
    { number: 5, amplitude: 1 / 5 },
    { number: 7, amplitude: 1 / 7 },
  ];

  const sawtoothHarmonics = [
    { number: 1, amplitude: 1 },
    { number: 2, amplitude: 1 / 2 },
    { number: 3, amplitude: 1 / 3 },
    { number: 4, amplitude: 1 / 4 },
    { number: 5, amplitude: 1 / 5 },
    { number: 6, amplitude: 1 / 6 },
    { number: 7, amplitude: 1 / 7 },
  ];

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.bg,
        fontFamily,
        width: "100%",
        height: "100%",
        gap: 80,
        padding: 60,
      }}
    >
      <Spectrum
        title="Square Wave"
        subtitle="Odd harmonics only"
        color={COLORS.accent}
        harmonics={squareHarmonics}
        frame={frame}
        fps={fps}
        delay={0}
      />

      {/* Divider */}
      <div
        style={{
          width: 2,
          height: 500,
          backgroundColor: "rgba(255,251,245,0.15)",
        }}
      />

      <Spectrum
        title="Sawtooth Wave"
        subtitle="All harmonics"
        color={COLORS.teal}
        harmonics={sawtoothHarmonics}
        frame={frame}
        fps={fps}
        delay={2}
      />
    </div>
  );
};
