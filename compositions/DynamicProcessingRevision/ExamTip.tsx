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

export const ExamTip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "Exam Tip" header with spring entrance
  const headerScale = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  // Main text fades in
  const textOpacity = interpolate(frame, [1 * fps, 2 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // "ABOVE" highlight: background widens
  const aboveHighlight = interpolate(frame, [2.5 * fps, 3.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // "BELOW" highlight
  const belowHighlight = interpolate(frame, [3.5 * fps, 4.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Extra tip fades in
  const extraTipOpacity = interpolate(frame, [5 * fps, 6 * fps], [0, 1], {
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
      {/* Exam Tip header */}
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
          maxWidth: 900,
        }}
      >
        Always state what happens{" "}
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
              transform: `scaleX(${aboveHighlight})`,
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
            ABOVE
          </span>
        </span>{" "}
        and{" "}
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
              transform: `scaleX(${belowHighlight})`,
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
            BELOW
          </span>
        </span>{" "}
        the threshold
      </div>

      {/* Extra tip */}
      <div
        style={{
          opacity: extraTipOpacity,
          color: COLORS.secondary,
          fontSize: 28,
          textAlign: "center",
          maxWidth: 800,
          lineHeight: 1.5,
        }}
      >
        Below: signal passes through unchanged{"\n"}
        <br />
        Above: signal is attenuated by the ratio
      </div>
    </div>
  );
};
