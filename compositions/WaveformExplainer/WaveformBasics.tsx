import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { eduTheme } from "../shared/EducationalBackground";

export const WaveformBasics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({ frame, fps, config: { damping: 15 } });

  // Animated wave - slowly moving
  const waveOffset = frame * 0.02;

  // Generate sine wave path
  const generateWavePath = () => {
    const width = 1200;
    const height = 300;
    const centerY = height / 2;
    const amplitude = 120;
    const frequency = 2; // 2 complete cycles
    const points: string[] = [];

    for (let x = 0; x <= width; x += 2) {
      const normalizedX = x / width;
      const y = centerY - amplitude * Math.sin((normalizedX * frequency * Math.PI * 2) + waveOffset);
      points.push(x === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
    }
    return points.join(" ");
  };

  // Label animations
  const periodLabelProgress = spring({ frame: frame - 40, fps, config: { damping: 15 } });
  const amplitudeLabelProgress = spring({ frame: frame - 60, fps, config: { damping: 15 } });
  const cycleLabelProgress = spring({ frame: frame - 80, fps, config: { damping: 15 } });

  // Period marker position (one complete cycle)
  const periodStart = 0;
  const periodEnd = 600; // Half the width = 1 cycle

  // Exit animation
  const exitOpacity = interpolate(frame, [320, 340], [1, 0], {
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
      <h2
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: eduTheme.text.primary,
          marginBottom: 40,
          opacity: entryProgress,
        }}
      >
        Anatomy of a Waveform
      </h2>

      <div
        style={{
          position: "relative",
          width: 1200,
          height: 400,
          transform: `scale(${entryProgress})`,
        }}
      >
        {/* Center line (zero crossing) */}
        <div
          style={{
            position: "absolute",
            top: 200,
            left: 0,
            width: "100%",
            height: 2,
            backgroundColor: eduTheme.card.border,
          }}
        />

        {/* The waveform */}
        <svg width={1200} height={400} style={{ position: "absolute", top: 50 }}>
          <path
            d={generateWavePath()}
            fill="none"
            stroke={eduTheme.accent.primary}
            strokeWidth={4}
            strokeLinecap="round"
          />
        </svg>

        {/* Period bracket */}
        <div
          style={{
            position: "absolute",
            top: 320,
            left: periodStart,
            width: periodEnd - periodStart,
            opacity: periodLabelProgress,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ width: 3, height: 30, backgroundColor: "#22c55e" }} />
            <div style={{ flex: 1, height: 3, backgroundColor: "#22c55e", marginTop: 27 }} />
            <div style={{ width: 3, height: 30, backgroundColor: "#22c55e" }} />
          </div>
          <div
            style={{
              textAlign: "center",
              color: "#22c55e",
              fontSize: 28,
              fontWeight: 700,
              marginTop: 10,
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
            left: 750,
            opacity: amplitudeLabelProgress,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 3,
              height: 120,
              backgroundColor: "#f59e0b",
              position: "relative",
            }}
          >
            {/* Arrow heads */}
            <div
              style={{
                position: "absolute",
                top: -8,
                left: -6,
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderBottom: "12px solid #f59e0b",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -8,
                left: -6,
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "12px solid #f59e0b",
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
            }}
          >
            AMPLITUDE
          </span>
        </div>

        {/* Cycle counter */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 280,
            opacity: cycleLabelProgress,
            color: "#8b5cf6",
            fontSize: 24,
            fontWeight: 600,
          }}
        >
          Cycle 1
        </div>
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 880,
            opacity: cycleLabelProgress,
            color: "#8b5cf6",
            fontSize: 24,
            fontWeight: 600,
          }}
        >
          Cycle 2
        </div>
      </div>

      {/* Key formula */}
      <div
        style={{
          marginTop: 40,
          padding: "20px 40px",
          backgroundColor: eduTheme.card.background,
          border: `2px solid ${eduTheme.card.border}`,
          boxShadow: eduTheme.card.shadow,
          borderRadius: 12,
          opacity: interpolate(frame, [100, 120], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <span style={{ color: eduTheme.text.secondary, fontSize: 28 }}>
          Frequency (f) = 1 / Period (T)
        </span>
      </div>
    </div>
  );
};
