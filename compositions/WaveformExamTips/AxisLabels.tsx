import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { eduTheme } from "../shared/EducationalBackground";

export const AxisLabels: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({ frame, fps, config: { damping: 15 } });

  // Animation phases
  const mistakeProgress = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const promptProgress = interpolate(frame, [70, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Correct labels appearing
  const xLabelProgress = spring({ frame: frame - 120, fps, config: { damping: 12 } });
  const yLabelProgress = spring({ frame: frame - 160, fps, config: { damping: 12 } });
  const tipProgress = spring({ frame: frame - 220, fps, config: { damping: 12 } });

  // Animated wave
  const waveOffset = frame * 0.05;

  // Exit
  const exitOpacity = interpolate(frame, [550, 570], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Generate waveform path
  const generateWavePath = () => {
    const width = 600;
    const height = 300;
    const centerY = height / 2;
    const amplitude = 100;
    const frequency = 3;
    const points: string[] = [];

    for (let x = 0; x <= width; x += 2) {
      const normalizedX = x / width;
      const y = centerY - amplitude * Math.sin((normalizedX * frequency * Math.PI * 2) + waveOffset);
      points.push(x === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
    }
    return points.join(" ");
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        opacity: exitOpacity,
      }}
    >
      {/* Section title */}
      <h2
        style={{
          fontSize: 48,
          fontWeight: 700,
          color: eduTheme.accent.primary,
          marginBottom: 30,
          opacity: entryProgress,
        }}
      >
        Mistake #3: "LABEL YOUR AXES"
      </h2>

      {/* The misconception */}
      <div
        style={{
          opacity: mistakeProgress,
          marginBottom: 30,
        }}
      >
        <div
          style={{
            backgroundColor: eduTheme.card.background,
            border: "2px solid #dc2626",
            boxShadow: eduTheme.card.shadow,
            borderRadius: 16,
            padding: "15px 30px",
            position: "relative",
          }}
        >
          <div style={{ fontSize: 24, color: eduTheme.text.primary, fontFamily: "serif", fontStyle: "italic" }}>
            "X-axis = frequency, Y-axis = time"
          </div>
          <div
            style={{
              position: "absolute",
              top: -10,
              right: -10,
              width: 28,
              height: 28,
              backgroundColor: "#dc2626",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 800,
              color: "#ffffff",
            }}
          >
            ✗
          </div>
        </div>
        <div style={{ color: eduTheme.text.secondary, fontSize: 16, marginTop: 8, textAlign: "center" }}>
          4 students reversed the axes
        </div>
      </div>

      {/* Prompt */}
      <div
        style={{
          opacity: promptProgress,
          fontSize: 28,
          color: eduTheme.accent.primary,
          marginBottom: 20,
          fontWeight: 600,
        }}
      >
        Always remember: Time-domain waveform
      </div>

      {/* The correct diagram */}
      <div
        style={{
          position: "relative",
          width: 700,
          height: 380,
        }}
      >
        {/* Waveform display area */}
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 30,
            width: 600,
            height: 300,
            backgroundColor: eduTheme.background.secondary,
            borderRadius: 8,
            border: `2px solid ${eduTheme.card.border}`,
          }}
        >
          {/* Center line */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              width: "100%",
              height: 1,
              backgroundColor: eduTheme.card.border,
            }}
          />

          {/* The waveform */}
          <svg width={600} height={300} style={{ position: "absolute" }}>
            <path
              d={generateWavePath()}
              fill="none"
              stroke={eduTheme.accent.primary}
              strokeWidth={3}
            />
          </svg>
        </div>

        {/* Y-axis label */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%) rotate(-90deg)",
            transformOrigin: "center center",
            opacity: yLabelProgress,
          }}
        >
          <div
            style={{
              backgroundColor: "#16a34a15",
              border: "2px solid #16a34a",
              borderRadius: 8,
              padding: "10px 20px",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: "#16a34a", fontSize: 24, fontWeight: 700 }}>
              Y = AMPLITUDE
            </span>
          </div>
        </div>

        {/* X-axis label */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            opacity: xLabelProgress,
          }}
        >
          <div
            style={{
              backgroundColor: `${eduTheme.accent.primary}15`,
              border: `2px solid ${eduTheme.accent.primary}`,
              borderRadius: 8,
              padding: "10px 20px",
            }}
          >
            <span style={{ color: eduTheme.accent.primary, fontSize: 24, fontWeight: 700 }}>
              X = TIME (ms)
            </span>
          </div>
        </div>

        {/* Arrows */}
        <div
          style={{
            position: "absolute",
            left: 75,
            top: 30,
            height: 300,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: yLabelProgress,
          }}
        >
          <span style={{ color: "#16a34a", fontSize: 20 }}>▲</span>
          <span style={{ color: "#16a34a", fontSize: 20 }}>▼</span>
        </div>

        <div
          style={{
            position: "absolute",
            left: 80,
            bottom: 45,
            width: 600,
            display: "flex",
            justifyContent: "space-between",
            opacity: xLabelProgress,
          }}
        >
          <span style={{ color: eduTheme.accent.primary, fontSize: 20 }}>◀</span>
          <span style={{ color: eduTheme.accent.primary, fontSize: 20 }}>▶</span>
        </div>
      </div>

      {/* Memory tip */}
      <div
        style={{
          marginTop: 30,
          padding: "20px 40px",
          backgroundColor: eduTheme.card.background,
          border: `2px solid ${eduTheme.accent.primary}`,
          boxShadow: eduTheme.card.shadow,
          borderRadius: 12,
          opacity: tipProgress,
          transform: `scale(${tipProgress})`,
        }}
      >
        <span style={{ color: eduTheme.accent.primary, fontSize: 26, fontWeight: 600 }}>
          Memory tip: "Time travels left to right" → X = Time
        </span>
      </div>
    </div>
  );
};
