import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Hybrid theme: MinimalModern's clean aesthetic + LightAcademic's structured clarity
const theme = {
  name: "Educational",
  background: {
    primary: "#ffffff",
    secondary: "#f8fafc",
  },
  text: {
    primary: "#0f172a",
    secondary: "#64748b",
    accent: "#0369a1",
  },
  accent: {
    primary: "#0284c7",
    secondary: "#0ea5e9",
  },
  card: {
    background: "#ffffff",
    border: "#e2e8f0",
  },
};

export const EducationalHybridStyle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 18 } });
  const waveProgress = spring({ frame: frame - 25, fps, config: { damping: 15 } });
  const labelProgress = spring({ frame: frame - 45, fps, config: { damping: 18 } });

  const waveOffset = frame * 0.025;

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
        background: `linear-gradient(180deg, ${theme.background.primary} 0%, ${theme.background.secondary} 100%)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
      }}
    >
      {/* Subtle top accent line - from LightAcademic */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${theme.accent.primary}, ${theme.accent.secondary})`,
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
          borderRadius: 6,
          fontSize: 16,
          fontWeight: 600,
          opacity: titleProgress,
          letterSpacing: 1,
        }}
      >
        EDUCATIONAL HYBRID
      </div>

      {/* Large bold title - from MinimalModern */}
      <h1
        style={{
          fontSize: 88,
          fontWeight: 700,
          color: theme.text.primary,
          margin: 0,
          marginBottom: 12,
          opacity: titleProgress,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [30, 0])}px)`,
          letterSpacing: -2,
        }}
      >
        Waveforms
      </h1>

      <p
        style={{
          fontSize: 22,
          color: theme.text.secondary,
          margin: 0,
          marginBottom: 50,
          opacity: titleProgress,
          fontWeight: 400,
        }}
      >
        Clear structure meets modern simplicity
      </p>

      {/* Content card - from LightAcademic but with MinimalModern styling */}
      <div
        style={{
          backgroundColor: theme.card.background,
          border: `1px solid ${theme.card.border}`,
          borderRadius: 12,
          padding: "32px 40px",
          opacity: waveProgress,
          transform: `translateY(${interpolate(waveProgress, [0, 1], [20, 0])}px)`,
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
        }}
      >
        <svg width={800} height={200}>
          {/* Subtle grid - from LightAcademic but lighter */}
          {[0, 100, 200].map((y) => (
            <line
              key={`h-${y}`}
              x1="0"
              y1={y}
              x2="800"
              y2={y}
              stroke="#f1f5f9"
              strokeWidth="1"
            />
          ))}
          {[0, 200, 400, 600, 800].map((x) => (
            <line
              key={`v-${x}`}
              x1={x}
              y1="0"
              x2={x}
              y2="200"
              stroke="#f1f5f9"
              strokeWidth="1"
            />
          ))}

          {/* Center line - emphasized */}
          <line
            x1="0"
            y1="100"
            x2="800"
            y2="100"
            stroke={theme.accent.primary}
            strokeWidth="1"
            strokeOpacity="0.3"
          />

          {/* Clean, bold wave */}
          <path
            d={generateWavePath()}
            fill="none"
            stroke={theme.accent.primary}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </svg>

        {/* Structured labels - from LightAcademic but cleaner */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: 28,
            opacity: labelProgress,
            borderTop: `1px solid ${theme.card.border}`,
            paddingTop: 24,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <span style={{
              color: theme.text.accent,
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}>
              Frequency
            </span>
            <p style={{
              color: theme.text.secondary,
              fontSize: 14,
              margin: "6px 0 0 0",
              fontWeight: 400,
            }}>
              cycles per second (Hz)
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <span style={{
              color: theme.text.accent,
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}>
              Amplitude
            </span>
            <p style={{
              color: theme.text.secondary,
              fontSize: 14,
              margin: "6px 0 0 0",
              fontWeight: 400,
            }}>
              maximum displacement
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <span style={{
              color: theme.text.accent,
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}>
              Period
            </span>
            <p style={{
              color: theme.text.secondary,
              fontSize: 14,
              margin: "6px 0 0 0",
              fontWeight: 400,
            }}>
              time for one cycle (T)
            </p>
          </div>
        </div>
      </div>

      {/* Bottom accent - from MinimalModern */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: "50%",
          transform: "translateX(-50%)",
          width: interpolate(labelProgress, [0, 1], [0, 80]),
          height: 3,
          backgroundColor: theme.accent.primary,
          borderRadius: 2,
        }}
      />
    </div>
  );
};
