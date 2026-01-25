import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { themes } from "../themes";

export const MinimalModernStyle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = themes.minimalModern;

  const titleProgress = spring({ frame, fps, config: { damping: 20 } });
  const waveProgress = spring({ frame: frame - 30, fps, config: { damping: 18 } });
  const labelProgress = spring({ frame: frame - 50, fps, config: { damping: 20 } });

  const waveOffset = frame * 0.02;

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
      {/* Style label - minimal */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          color: theme.text.secondary,
          fontSize: 14,
          fontWeight: 500,
          opacity: titleProgress,
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        Minimal Modern
      </div>

      {/* Large bold title - Apple-inspired */}
      <h1
        style={{
          fontSize: 100,
          fontWeight: 700,
          color: theme.text.primary,
          margin: 0,
          marginBottom: 8,
          opacity: titleProgress,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [40, 0])}px)`,
          letterSpacing: -3,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
        }}
      >
        Waveforms
      </h1>

      <p
        style={{
          fontSize: 22,
          color: theme.text.secondary,
          margin: 0,
          marginBottom: 80,
          opacity: titleProgress,
          fontWeight: 400,
        }}
      >
        Whitespace. Typography. Simplicity.
      </p>

      {/* Waveform - no container, floating */}
      <div
        style={{
          opacity: waveProgress,
          transform: `translateY(${interpolate(waveProgress, [0, 1], [20, 0])}px)`,
        }}
      >
        <svg width={800} height={200}>
          {/* Single subtle center line */}
          <line x1="0" y1="100" x2="800" y2="100" stroke="#e2e8f0" strokeWidth="1" />

          {/* Clean, bold wave */}
          <path
            d={generateWavePath()}
            fill="none"
            stroke={theme.accent.primary}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </svg>

        {/* Minimal labels */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 40,
            opacity: labelProgress,
            maxWidth: 600,
            margin: "40px auto 0",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <span style={{ color: theme.text.primary, fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
              Frequency
            </span>
          </div>
          <div style={{ textAlign: "center" }}>
            <span style={{ color: theme.text.primary, fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
              Amplitude
            </span>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ color: theme.text.primary, fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
              Period
            </span>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: "50%",
          transform: "translateX(-50%)",
          width: interpolate(labelProgress, [0, 1], [0, 100]),
          height: 3,
          backgroundColor: theme.accent.primary,
          borderRadius: 2,
        }}
      />
    </div>
  );
};
