import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { DarkGradientStyle, LightAcademicStyle, NeonCyberStyle, MinimalModernStyle, EducationalHybridStyle } from "./styles";

// Each style gets 6 seconds (180 frames at 30fps)
const STYLE_DURATION = 180;
const TRANSITION_DURATION = 30;

export const StyleShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  // Transition effect between styles
  const getTransitionOpacity = (startFrame: number) => {
    const localFrame = frame - startFrame;

    // Fade in at start
    const fadeIn = interpolate(localFrame, [0, TRANSITION_DURATION], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    // Fade out at end
    const fadeOut = interpolate(
      localFrame,
      [STYLE_DURATION - TRANSITION_DURATION, STYLE_DURATION],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return Math.min(fadeIn, fadeOut);
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Style 1: Dark Gradient (0-180) */}
      <Sequence from={0} durationInFrames={STYLE_DURATION}>
        <AbsoluteFill style={{ opacity: getTransitionOpacity(0) }}>
          <DarkGradientStyle />
        </AbsoluteFill>
      </Sequence>

      {/* Style 2: Light Academic (180-360) */}
      <Sequence from={STYLE_DURATION} durationInFrames={STYLE_DURATION}>
        <AbsoluteFill style={{ opacity: getTransitionOpacity(STYLE_DURATION) }}>
          <LightAcademicStyle />
        </AbsoluteFill>
      </Sequence>

      {/* Style 3: Neon Cyber (360-540) */}
      <Sequence from={STYLE_DURATION * 2} durationInFrames={STYLE_DURATION}>
        <AbsoluteFill style={{ opacity: getTransitionOpacity(STYLE_DURATION * 2) }}>
          <NeonCyberStyle />
        </AbsoluteFill>
      </Sequence>

      {/* Style 4: Minimal Modern (540-720) */}
      <Sequence from={STYLE_DURATION * 3} durationInFrames={STYLE_DURATION}>
        <AbsoluteFill style={{ opacity: getTransitionOpacity(STYLE_DURATION * 3) }}>
          <MinimalModernStyle />
        </AbsoluteFill>
      </Sequence>

      {/* Style 5: Educational Hybrid (720-900) */}
      <Sequence from={STYLE_DURATION * 4} durationInFrames={STYLE_DURATION}>
        <AbsoluteFill style={{ opacity: getTransitionOpacity(STYLE_DURATION * 4) }}>
          <EducationalHybridStyle />
        </AbsoluteFill>
      </Sequence>

      {/* Progress indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 12,
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => {
          const isActive = frame >= i * STYLE_DURATION && frame < (i + 1) * STYLE_DURATION;
          return (
            <div
              key={i}
              style={{
                width: isActive ? 32 : 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: isActive ? "#fff" : "rgba(255, 255, 255, 0.3)",
                transition: "all 0.3s ease",
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
