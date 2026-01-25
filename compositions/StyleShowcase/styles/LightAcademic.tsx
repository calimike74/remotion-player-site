import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { themes } from "../themes";

export const LightAcademicStyle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = themes.lightAcademic;

  const titleProgress = spring({ frame, fps, config: { damping: 15 } });
  const waveProgress = spring({ frame: frame - 20, fps, config: { damping: 12 } });
  const labelProgress = spring({ frame: frame - 40, fps, config: { damping: 15 } });

  const waveOffset = frame * 0.03;

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
      {/* Subtle paper texture pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(0, 0, 0, 0.01) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 0, 0, 0.01) 0%, transparent 50%)
          `,
        }}
      />

      {/* Top border accent */}
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
          borderRadius: 4,
          fontSize: 18,
          fontWeight: 600,
          opacity: titleProgress,
        }}
      >
        LIGHT ACADEMIC
      </div>

      {/* Main title */}
      <h1
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: theme.text.primary,
          margin: 0,
          marginBottom: 16,
          opacity: titleProgress,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [20, 0])}px)`,
          fontFamily: "Georgia, serif",
        }}
      >
        Waveforms
      </h1>

      <p
        style={{
          fontSize: 24,
          color: theme.text.secondary,
          margin: 0,
          marginBottom: 50,
          opacity: titleProgress,
          fontStyle: "italic",
        }}
      >
        Clean, professional educational design
      </p>

      {/* Waveform card */}
      <div
        style={{
          backgroundColor: theme.card.background,
          border: `1px solid ${theme.card.border}`,
          borderRadius: 8,
          padding: 40,
          opacity: waveProgress,
          transform: `scale(${interpolate(waveProgress, [0, 1], [0.95, 1])})`,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        }}
      >
        <svg width={800} height={200}>
          {/* Grid lines */}
          {[0, 50, 100, 150, 200].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="800"
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          {[0, 200, 400, 600, 800].map((x) => (
            <line
              key={x}
              x1={x}
              y1="0"
              x2={x}
              y2="200"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}

          {/* Center line */}
          <line x1="0" y1="100" x2="800" y2="100" stroke={theme.accent.primary} strokeWidth="1" strokeDasharray="5,5" />

          {/* Main wave */}
          <path
            d={generateWavePath()}
            fill="none"
            stroke={theme.accent.primary}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </svg>

        {/* Labels with academic styling */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: 24,
            opacity: labelProgress,
            borderTop: `1px solid ${theme.card.border}`,
            paddingTop: 20,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <span style={{ color: theme.text.accent, fontSize: 16, fontWeight: 600 }}>
              Frequency (f)
            </span>
            <p style={{ color: theme.text.secondary, fontSize: 14, margin: "4px 0 0 0" }}>
              cycles per second
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <span style={{ color: theme.text.accent, fontSize: 16, fontWeight: 600 }}>
              Amplitude (A)
            </span>
            <p style={{ color: theme.text.secondary, fontSize: 14, margin: "4px 0 0 0" }}>
              maximum displacement
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <span style={{ color: theme.text.accent, fontSize: 16, fontWeight: 600 }}>
              Period (T)
            </span>
            <p style={{ color: theme.text.secondary, fontSize: 14, margin: "4px 0 0 0" }}>
              time for one cycle
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
