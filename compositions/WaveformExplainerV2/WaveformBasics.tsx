import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const WaveformBasics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({ frame, fps, config: { damping: 15 } });
  const waveOffset = frame * 0.02;

  const generateWavePath = () => {
    const width = 1200;
    const height = 300;
    const centerY = height / 2;
    const amplitude = 120;
    const frequency = 2;
    const points: string[] = [];

    for (let x = 0; x <= width; x += 2) {
      const normalizedX = x / width;
      const y = centerY - amplitude * Math.sin((normalizedX * frequency * Math.PI * 2) + waveOffset);
      points.push(x === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
    }
    return points.join(" ");
  };

  const periodLabelProgress = spring({ frame: frame - 40, fps, config: { damping: 15 } });
  const amplitudeLabelProgress = spring({ frame: frame - 60, fps, config: { damping: 15 } });
  const cycleLabelProgress = spring({ frame: frame - 80, fps, config: { damping: 15 } });
  const periodStart = 0;
  const periodEnd = 600;

  const exitOpacity = interpolate(frame, [320, 340], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowPulse = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.6, 1]);

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
      <h2
        style={{
          fontSize: 60,
          fontWeight: 700,
          background: "linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: 40,
          opacity: entryProgress,
          filter: "drop-shadow(0 2px 20px rgba(59, 130, 246, 0.3))",
        }}
      >
        Anatomy of a Waveform
      </h2>

      {/* Card container */}
      <div
        style={{
          position: "relative",
          width: 1300,
          height: 450,
          transform: `scale(${entryProgress})`,
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)",
          borderRadius: 24,
          border: "1px solid rgba(59, 130, 246, 0.2)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
          padding: 50,
        }}
      >
        {/* Center line */}
        <div
          style={{
            position: "absolute",
            top: 225,
            left: 50,
            width: 1200,
            height: 2,
            background: "linear-gradient(90deg, transparent, #334155 20%, #334155 80%, transparent)",
          }}
        />

        {/* Waveform with glow */}
        <svg width={1200} height={350} style={{ position: "absolute", top: 50, left: 50 }}>
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d={generateWavePath()}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={5}
            strokeLinecap="round"
            filter="url(#glow)"
            style={{ opacity: glowPulse }}
          />
        </svg>

        {/* Period bracket */}
        <div
          style={{
            position: "absolute",
            top: 345,
            left: 50 + periodStart,
            width: periodEnd - periodStart,
            opacity: periodLabelProgress,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ width: 3, height: 30, background: "linear-gradient(180deg, #22c55e, #16a34a)", borderRadius: 2 }} />
            <div style={{ flex: 1, height: 3, background: "#22c55e", marginTop: 27 }} />
            <div style={{ width: 3, height: 30, background: "linear-gradient(180deg, #22c55e, #16a34a)", borderRadius: 2 }} />
          </div>
          <div
            style={{
              textAlign: "center",
              color: "#22c55e",
              fontSize: 28,
              fontWeight: 700,
              marginTop: 12,
              textShadow: "0 0 20px #22c55644",
            }}
          >
            PERIOD (T) = 1 cycle
          </div>
        </div>

        {/* Amplitude arrow */}
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 800,
            opacity: amplitudeLabelProgress,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 3,
              height: 120,
              background: "linear-gradient(180deg, #f59e0b, #d97706)",
              position: "relative",
              borderRadius: 2,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -10,
                left: -7,
                width: 0,
                height: 0,
                borderLeft: "9px solid transparent",
                borderRight: "9px solid transparent",
                borderBottom: "14px solid #f59e0b",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -10,
                left: -7,
                width: 0,
                height: 0,
                borderLeft: "9px solid transparent",
                borderRight: "9px solid transparent",
                borderTop: "14px solid #f59e0b",
              }}
            />
          </div>
          <span
            style={{
              color: "#f59e0b",
              fontSize: 26,
              fontWeight: 700,
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              textShadow: "0 0 20px #f59e0b44",
            }}
          >
            AMPLITUDE
          </span>
        </div>

        {/* Cycle labels */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 330,
            opacity: cycleLabelProgress,
            color: "#8b5cf6",
            fontSize: 24,
            fontWeight: 600,
            textShadow: "0 0 15px #8b5cf644",
          }}
        >
          Cycle 1
        </div>
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 930,
            opacity: cycleLabelProgress,
            color: "#8b5cf6",
            fontSize: 24,
            fontWeight: 600,
            textShadow: "0 0 15px #8b5cf644",
          }}
        >
          Cycle 2
        </div>
      </div>

      {/* Formula card */}
      <div
        style={{
          marginTop: 40,
          padding: "24px 48px",
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)",
          borderRadius: 16,
          border: "1px solid rgba(59, 130, 246, 0.3)",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
          opacity: interpolate(frame, [100, 120], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <span style={{ color: "#e2e8f0", fontSize: 30, fontWeight: 600 }}>
          Frequency (f) = 1 / Period (T)
        </span>
      </div>
    </div>
  );
};
