import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { eduTheme } from "../shared/EducationalBackground";

interface TitleCardProps {
  title: string;
  subtitle: string;
  topic: string;
}

export const TitleCard: React.FC<TitleCardProps> = ({ title, subtitle, topic }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Topic badge animation
  const badgeProgress = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  // Title animation (delayed)
  const titleProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12 },
  });

  // Subtitle animation (more delayed)
  const subtitleProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 15 },
  });

  // Decorative line
  const lineWidth = interpolate(subtitleProgress, [0, 1], [0, 400]);

  // Exit animation
  const exitProgress = interpolate(frame, [70, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitY = interpolate(exitProgress, [0, 1], [0, -100]);
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
        transform: `translateY(${exitY}px)`,
        opacity: exitOpacity,
      }}
    >
      {/* Topic badge */}
      <div
        style={{
          backgroundColor: eduTheme.accent.primary,
          color: "#ffffff",
          padding: "12px 32px",
          borderRadius: 6,
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: 1,
          transform: `scale(${badgeProgress})`,
        }}
      >
        TOPIC {topic}
      </div>

      {/* Main title */}
      <h1
        style={{
          fontSize: 100,
          fontWeight: 700,
          color: eduTheme.text.primary,
          margin: 0,
          letterSpacing: -2,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [50, 0])}px)`,
          opacity: titleProgress,
        }}
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: 40,
          fontWeight: 400,
          color: eduTheme.text.secondary,
          margin: 0,
          transform: `translateY(${interpolate(subtitleProgress, [0, 1], [30, 0])}px)`,
          opacity: subtitleProgress,
        }}
      >
        {subtitle}
      </p>

      {/* Decorative line */}
      <div
        style={{
          width: lineWidth,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${eduTheme.accent.primary}, ${eduTheme.accent.secondary}, transparent)`,
          borderRadius: 2,
        }}
      />
    </div>
  );
};
