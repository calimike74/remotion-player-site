import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { themes } from "../themes";

export const NeonCyberStyle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = themes.neonCyber;

  const titleProgress = spring({ frame, fps, config: { damping: 15 } });
  const waveProgress = spring({ frame: frame - 20, fps, config: { damping: 12 } });
  const labelProgress = spring({ frame: frame - 40, fps, config: { damping: 15 } });

  const waveOffset = frame * 0.05; // Faster movement for energy

  const generateWavePath = () => {
    const width = 800;
    const height = 200;
    const centerY = height / 2;
    const amplitude = 60;
    const points: string[] = [];

    for (let x = 0; x <= width; x += 2) {
      const normalizedX = x / width;
      const y = centerY - amplitude * Math.sin((normalizedX * 2 * Math.PI * 2) + waveOffset);
      points.push(x === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
    }
    return points.join(" ");
  };

  // Pulsing effect
  const pulse = Math.sin(frame * 0.1) * 0.1 + 1;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: theme.background.gradient,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Animated grid - cyberpunk style */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          perspective: "500px",
          transform: `rotateX(60deg) translateY(${frame * 2}px)`,
          transformOrigin: "center top",
        }}
      />

      {/* Scanlines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.1) 2px,
            rgba(0, 0, 0, 0.1) 4px
          )`,
          pointerEvents: "none",
        }}
      />

      {/* Neon glow corners */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          width: 100,
          height: 100,
          borderTop: `2px solid ${theme.accent.primary}`,
          borderLeft: `2px solid ${theme.accent.primary}`,
          boxShadow: theme.accent.glow,
          opacity: pulse,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          width: 100,
          height: 100,
          borderBottom: `2px solid ${theme.accent.secondary}`,
          borderRight: `2px solid ${theme.accent.secondary}`,
          boxShadow: "0 0 40px rgba(20, 184, 166, 0.5)",
          opacity: pulse,
        }}
      />

      {/* Style label */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          backgroundColor: "transparent",
          color: theme.accent.primary,
          padding: "8px 20px",
          borderRadius: 0,
          fontSize: 18,
          fontWeight: 700,
          opacity: titleProgress,
          border: `2px solid ${theme.accent.primary}`,
          boxShadow: theme.accent.glow,
          textTransform: "uppercase",
          letterSpacing: 4,
        }}
      >
        NEON CYBER
      </div>

      {/* Main title - glitch effect */}
      <h1
        style={{
          fontSize: 90,
          fontWeight: 900,
          color: theme.text.primary,
          margin: 0,
          marginBottom: 16,
          opacity: titleProgress,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [30, 0])}px)`,
          textShadow: `
            0 0 10px ${theme.accent.primary},
            0 0 20px ${theme.accent.primary},
            0 0 40px ${theme.accent.primary},
            2px 2px 0 ${theme.accent.secondary}
          `,
          letterSpacing: 8,
        }}
      >
        WAVEFORMS
      </h1>

      <p
        style={{
          fontSize: 24,
          color: theme.text.secondary,
          margin: 0,
          marginBottom: 50,
          opacity: titleProgress,
          letterSpacing: 6,
          textTransform: "uppercase",
        }}
      >
        Energetic neon visuals
      </p>

      {/* Waveform card */}
      <div
        style={{
          backgroundColor: theme.card.background,
          border: `1px solid ${theme.card.border}`,
          borderRadius: 0,
          padding: 40,
          opacity: waveProgress,
          transform: `scale(${interpolate(waveProgress, [0, 1], [0.9, 1])})`,
          boxShadow: theme.accent.glow,
          position: "relative",
        }}
      >
        {/* Corner accents */}
        <div style={{ position: "absolute", top: -1, left: -1, width: 20, height: 20, borderTop: `2px solid ${theme.accent.primary}`, borderLeft: `2px solid ${theme.accent.primary}` }} />
        <div style={{ position: "absolute", top: -1, right: -1, width: 20, height: 20, borderTop: `2px solid ${theme.accent.primary}`, borderRight: `2px solid ${theme.accent.primary}` }} />
        <div style={{ position: "absolute", bottom: -1, left: -1, width: 20, height: 20, borderBottom: `2px solid ${theme.accent.primary}`, borderLeft: `2px solid ${theme.accent.primary}` }} />
        <div style={{ position: "absolute", bottom: -1, right: -1, width: 20, height: 20, borderBottom: `2px solid ${theme.accent.primary}`, borderRight: `2px solid ${theme.accent.primary}` }} />

        <svg width={800} height={200}>
          <defs>
            <filter id="neon-glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Center line */}
          <line x1="0" y1="100" x2="800" y2="100" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="1" />

          {/* Main wave with neon glow */}
          <path
            d={generateWavePath()}
            fill="none"
            stroke={theme.accent.primary}
            strokeWidth={3}
            strokeLinecap="round"
            filter="url(#neon-glow)"
          />
        </svg>

        {/* Labels */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: 24,
            opacity: labelProgress,
          }}
        >
          {["FREQUENCY", "AMPLITUDE", "PERIOD"].map((label, i) => (
            <span
              key={label}
              style={{
                color: i === 1 ? theme.accent.secondary : theme.accent.primary,
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: 3,
                textShadow: `0 0 10px ${i === 1 ? theme.accent.secondary : theme.accent.primary}`,
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
