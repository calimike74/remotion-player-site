import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { eqTheme } from "./eqTheme";

interface TitleCardProps {
  title: string;
  subtitle: string;
  topic: string;
}

export const TitleCard: React.FC<TitleCardProps> = ({ title, subtitle, topic }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Staggered entrance animations
  const topicBadgeScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const titleProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const subtitleProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const decorProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 20, stiffness: 60 },
  });

  // Exit animation
  const exitOpacity = interpolate(frame, [90, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleY = interpolate(titleProgress, [0, 1], [40, 0]);
  const subtitleY = interpolate(subtitleProgress, [0, 1], [30, 0]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity: exitOpacity,
      }}
    >
      {/* Topic badge */}
      <div
        style={{
          backgroundColor: eqTheme.graphicEQ.primary,
          color: eqTheme.text.primary,
          padding: "12px 32px",
          borderRadius: 8,
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "0.1em",
          transform: `scale(${topicBadgeScale})`,
          marginBottom: 32,
          boxShadow: `0 4px 20px ${eqTheme.graphicEQ.glow}`,
        }}
      >
        TOPIC {topic}
      </div>

      {/* Main title */}
      <h1
        style={{
          fontSize: 96,
          fontWeight: 700,
          color: eqTheme.text.primary,
          margin: 0,
          letterSpacing: "-0.02em",
          opacity: titleProgress,
          transform: `translateY(${titleY}px)`,
          textShadow: `0 4px 30px rgba(0, 0, 0, 0.5)`,
        }}
      >
        {title}
      </h1>

      {/* Subtitle */}
      <h2
        style={{
          fontSize: 36,
          fontWeight: 400,
          color: eqTheme.text.secondary,
          margin: 0,
          marginTop: 16,
          opacity: subtitleProgress,
          transform: `translateY(${subtitleY}px)`,
        }}
      >
        {subtitle}
      </h2>

      {/* Decorative line */}
      <div
        style={{
          width: 200 * decorProgress,
          height: 3,
          background: `linear-gradient(90deg, ${eqTheme.graphicEQ.primary}, ${eqTheme.parametricEQ.primary})`,
          borderRadius: 2,
          marginTop: 40,
        }}
      />

      {/* Edexcel reference */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          color: eqTheme.text.muted,
          fontSize: 18,
          opacity: decorProgress,
          letterSpacing: "0.05em",
        }}
      >
        EDEXCEL A-LEVEL MUSIC TECHNOLOGY
      </div>
    </div>
  );
};
