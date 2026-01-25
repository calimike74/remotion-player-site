import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface TitleCardProps {
  title: string;
  subtitle: string;
  topic: string;
}

export const TitleCard: React.FC<TitleCardProps> = ({ title, subtitle, topic }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeProgress = spring({ frame, fps, config: { damping: 15 } });
  const titleProgress = spring({ frame: frame - 15, fps, config: { damping: 12 } });
  const subtitleProgress = spring({ frame: frame - 30, fps, config: { damping: 15 } });
  const lineWidth = interpolate(subtitleProgress, [0, 1], [0, 500]);

  const exitProgress = interpolate(frame, [70, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitY = interpolate(exitProgress, [0, 1], [0, -100]);
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  // Glow pulse animation
  const glowPulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.5, 1]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 28,
        transform: `translateY(${exitY}px)`,
        opacity: exitOpacity,
      }}
    >
      {/* Topic badge with glow */}
      <div
        style={{
          background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
          color: "#ffffff",
          padding: "14px 36px",
          borderRadius: 50,
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: 3,
          transform: `scale(${badgeProgress})`,
          boxShadow: `0 0 ${40 * glowPulse}px #3b82f6aa, 0 0 ${80 * glowPulse}px #8b5cf644`,
        }}
      >
        TOPIC {topic}
      </div>

      {/* Main title with gradient text */}
      <h1
        style={{
          fontSize: 140,
          fontWeight: 900,
          background: "linear-gradient(180deg, #ffffff 0%, #94a3b8 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: 0,
          letterSpacing: -3,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [50, 0])}px)`,
          opacity: titleProgress,
          textShadow: "none",
          filter: `drop-shadow(0 4px 60px rgba(59, 130, 246, ${0.6 * glowPulse}))`,
        }}
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: 52,
          fontWeight: 500,
          color: "#94a3b8",
          margin: 0,
          letterSpacing: 6,
          transform: `translateY(${interpolate(subtitleProgress, [0, 1], [30, 0])}px)`,
          opacity: subtitleProgress,
        }}
      >
        {subtitle}
      </p>

      {/* Enhanced decorative line */}
      <div
        style={{
          width: lineWidth,
          height: 5,
          background: "linear-gradient(90deg, transparent 0%, #3b82f6 20%, #8b5cf6 50%, #06b6d4 80%, transparent 100%)",
          borderRadius: 3,
          boxShadow: `0 0 20px #3b82f688`,
        }}
      />
    </div>
  );
};
