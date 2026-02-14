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

export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const subtitleOpacity = interpolate(
    frame,
    [0.5 * fps, 1.2 * fps],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );

  const specOpacity = interpolate(frame, [1 * fps, 1.8 * fps], [0, 1], {
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
        position: "relative",
      }}
    >
      <div
        style={{
          transform: `scale(${titleScale})`,
          color: COLORS.text,
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: "-0.02em",
        }}
      >
        Synthesis
      </div>
      <div
        style={{
          opacity: subtitleOpacity,
          color: COLORS.accent,
          fontSize: 42,
          fontWeight: 400,
          marginTop: 20,
        }}
      >
        Fundamentals
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 60,
          opacity: specOpacity,
          color: COLORS.secondary,
          fontSize: 24,
        }}
      >
        Spec Reference: 1.3
      </div>
    </div>
  );
};
