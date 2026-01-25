import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { themes } from "../themes";

export const DarkGradientStyle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = themes.darkGradient;

  const titleProgress = spring({ frame, fps, config: { damping: 15 } });
  const waveProgress = spring({ frame: frame - 20, fps, config: { damping: 12 } });
  const labelProgress = spring({ frame: frame - 40, fps, config: { damping: 15 } });

  // Animated wave offset
  const waveOffset = frame * 0.03;

  // Generate sine wave path
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
      {/* Animated grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: `translateY(${frame * 0.3}px)`,
        }}
      />

      {/* Glowing orbs */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
          top: -100,
          right: -100,
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)",
          bottom: -50,
          left: -50,
          filter: "blur(30px)",
        }}
      />

      {/* Style label */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          backgroundColor: theme.accent.primary,
          color: "#fff",
          padding: "8px 20px",
          borderRadius: 20,
          fontSize: 18,
          fontWeight: 600,
          opacity: titleProgress,
          boxShadow: theme.accent.glow,
        }}
      >
        DARK GRADIENT
      </div>

      {/* Main title */}
      <h1
        style={{
          fontSize: 80,
          fontWeight: 800,
          color: theme.text.primary,
          margin: 0,
          marginBottom: 20,
          opacity: titleProgress,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [30, 0])}px)`,
          textShadow: "0 4px 40px rgba(139, 92, 246, 0.3)",
        }}
      >
        WAVEFORMS
      </h1>

      <p
        style={{
          fontSize: 28,
          color: theme.text.secondary,
          margin: 0,
          marginBottom: 60,
          opacity: titleProgress,
          letterSpacing: 4,
        }}
      >
        Rich gradients & glowing accents
      </p>

      {/* Waveform card */}
      <div
        style={{
          backgroundColor: theme.card.background,
          border: `1px solid ${theme.card.border}`,
          borderRadius: 20,
          padding: 40,
          opacity: waveProgress,
          transform: `scale(${interpolate(waveProgress, [0, 1], [0.9, 1])})`,
          boxShadow: theme.accent.glow,
        }}
      >
        <svg width={800} height={200}>
          {/* Glow filter */}
          <defs>
            <filter id="glow-purple">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Center line */}
          <line x1="0" y1="100" x2="800" y2="100" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="1" />

          {/* Main wave */}
          <path
            d={generateWavePath()}
            fill="none"
            stroke={theme.accent.primary}
            strokeWidth={4}
            strokeLinecap="round"
            filter="url(#glow-purple)"
          />
        </svg>

        {/* Labels */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: 20,
            opacity: labelProgress,
          }}
        >
          <span style={{ color: theme.text.accent, fontSize: 20, fontWeight: 600 }}>
            FREQUENCY
          </span>
          <span style={{ color: theme.text.accent, fontSize: 20, fontWeight: 600 }}>
            AMPLITUDE
          </span>
          <span style={{ color: theme.text.accent, fontSize: 20, fontWeight: 600 }}>
            PERIOD
          </span>
        </div>
      </div>
    </div>
  );
};
