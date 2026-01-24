import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface TitleCardProps {
  title: string;
  subtitle: string;
  topic: string;
}

export const TitleCard: React.FC<TitleCardProps> = ({ title, subtitle, topic }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 15 } });
  const subtitleProgress = spring({ frame: frame - 15, fps, config: { damping: 15 } });
  const topicProgress = spring({ frame: frame - 30, fps, config: { damping: 15 } });
  const statsProgress = spring({ frame: frame - 45, fps, config: { damping: 15 } });

  const exitOpacity = interpolate(frame, [140, 160], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
          backgroundColor: "#ef444422",
          border: "2px solid #ef4444",
          borderRadius: 8,
          padding: "8px 20px",
          marginBottom: 30,
          transform: `scale(${topicProgress})`,
          opacity: topicProgress,
        }}
      >
        <span style={{ color: "#ef4444", fontSize: 24, fontWeight: 600 }}>
          Topic {topic}
        </span>
      </div>

      {/* Main title */}
      <h1
        style={{
          fontSize: 120,
          fontWeight: 800,
          color: "#ffffff",
          margin: 0,
          letterSpacing: -2,
          transform: `scale(${titleProgress})`,
          opacity: titleProgress,
        }}
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: 48,
          color: "#94a3b8",
          marginTop: 20,
          fontWeight: 500,
          transform: `translateY(${interpolate(subtitleProgress, [0, 1], [20, 0])}px)`,
          opacity: subtitleProgress,
        }}
      >
        {subtitle}
      </p>

      {/* Stats from real student essays */}
      <div
        style={{
          marginTop: 60,
          display: "flex",
          gap: 40,
          transform: `translateY(${interpolate(statsProgress, [0, 1], [20, 0])}px)`,
          opacity: statsProgress,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 56, fontWeight: 800, color: "#ef4444" }}>80%</div>
          <div style={{ fontSize: 20, color: "#94a3b8" }}>missing Hz values</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 56, fontWeight: 800, color: "#f59e0b" }}>47%</div>
          <div style={{ fontSize: 20, color: "#94a3b8" }}>no calculations</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 56, fontWeight: 800, color: "#22c55e" }}>27%</div>
          <div style={{ fontSize: 20, color: "#94a3b8" }}>axis errors</div>
        </div>
      </div>
    </div>
  );
};
