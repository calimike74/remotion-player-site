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
  secondary: "rgba(255, 251, 245, 0.6)",
};

interface HighlightWordProps {
  children: string;
  progress: number;
}

const HighlightWord: React.FC<HighlightWordProps> = ({ children, progress }) => (
  <span
    style={{
      position: "relative",
      display: "inline-block",
    }}
  >
    <span
      style={{
        position: "absolute",
        bottom: 0,
        left: -6,
        right: -6,
        height: "100%",
        backgroundColor: COLORS.accent,
        borderRadius: 6,
        opacity: 0.25,
        transform: `scaleX(${progress})`,
        transformOrigin: "left",
      }}
    />
    <span
      style={{
        position: "relative",
        color: COLORS.accent,
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  </span>
);

export const ExamTip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerScale = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const textOpacity = interpolate(frame, [1 * fps, 2 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const bothHighlight = interpolate(frame, [2 * fps, 3 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const shapeHighlight = interpolate(frame, [2.5 * fps, 3.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const spectrumHighlight = interpolate(frame, [3 * fps, 4 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const detailsOpacity = interpolate(frame, [4.5 * fps, 5.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

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
        gap: 50,
      }}
    >
      {/* Header */}
      <div
        style={{
          transform: `scale(${headerScale})`,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            width: 6,
            height: 50,
            backgroundColor: COLORS.accent,
            borderRadius: 3,
          }}
        />
        <span
          style={{
            color: COLORS.accent,
            fontSize: 52,
            fontWeight: 700,
          }}
        >
          Exam Tip
        </span>
      </div>

      {/* Main text */}
      <div
        style={{
          opacity: textOpacity,
          color: COLORS.text,
          fontSize: 38,
          textAlign: "center",
          lineHeight: 1.6,
          maxWidth: 1000,
        }}
      >
        Identify waveforms from{" "}
        <HighlightWord progress={bothHighlight}>BOTH</HighlightWord> the{" "}
        <HighlightWord progress={shapeHighlight}>shape</HighlightWord> AND the{" "}
        <HighlightWord progress={spectrumHighlight}>spectrum</HighlightWord>
      </div>

      {/* Detail lines */}
      <div
        style={{
          opacity: detailsOpacity,
          color: COLORS.secondary,
          fontSize: 28,
          textAlign: "center",
          lineHeight: 1.8,
        }}
      >
        Odd harmonics = Square / Triangle
        <br />
        All harmonics = Sawtooth
      </div>
    </div>
  );
};
