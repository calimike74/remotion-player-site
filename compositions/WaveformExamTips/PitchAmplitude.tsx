import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { eduTheme } from "../shared/EducationalBackground";

export const PitchAmplitude: React.FC = () => {
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

  const demoProgress = interpolate(frame, [120, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Animated waveforms
  const waveOffset = frame * 0.08;

  // Truth reveal
  const truthProgress = spring({ frame: frame - 250, fps, config: { damping: 12 } });

  // Exit
  const exitOpacity = interpolate(frame, [870, 890], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Generate waveform SVG
  const generateWave = (frequency: number, amplitude: number, color: string, width: number = 300) => {
    const height = 100;
    const centerY = height / 2;
    const points: string[] = [];

    for (let x = 0; x <= width; x += 2) {
      const normalizedX = x / width;
      const y = centerY - amplitude * Math.sin((normalizedX * frequency * Math.PI * 2) + waveOffset);
      points.push(x === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
    }

    return (
      <svg width={width} height={height}>
        <line x1={0} y1={centerY} x2={width} y2={centerY} stroke={eduTheme.card.border} strokeWidth={1} />
        <path d={points.join(" ")} fill="none" stroke={color} strokeWidth={3} />
      </svg>
    );
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
          marginBottom: 40,
          opacity: entryProgress,
        }}
      >
        Mistake #2: "PITCH ≠ AMPLITUDE"
      </h2>

      {/* The misconception */}
      <div
        style={{
          opacity: mistakeProgress,
          marginBottom: 40,
        }}
      >
        <div
          style={{
            backgroundColor: eduTheme.card.background,
            border: "2px solid #dc2626",
            boxShadow: eduTheme.card.shadow,
            borderRadius: 16,
            padding: "20px 40px",
            position: "relative",
          }}
        >
          <div style={{ fontSize: 28, color: eduTheme.text.primary, fontFamily: "serif", fontStyle: "italic" }}>
            "When pitch gets lower, amplitude increases"
          </div>
          <div
            style={{
              position: "absolute",
              top: -12,
              right: -12,
              width: 32,
              height: 32,
              backgroundColor: "#dc2626",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 800,
              color: "#ffffff",
            }}
          >
            ✗
          </div>
        </div>
        <div style={{ color: eduTheme.text.secondary, fontSize: 18, marginTop: 10, textAlign: "center" }}>
          3 students made this error
        </div>
      </div>

      {/* Prompt */}
      <div
        style={{
          opacity: promptProgress,
          fontSize: 32,
          color: eduTheme.accent.primary,
          marginBottom: 30,
          fontWeight: 600,
        }}
      >
        Let's see what actually happens...
      </div>

      {/* Visual demonstration */}
      <div
        style={{
          display: "flex",
          gap: 60,
          opacity: demoProgress,
        }}
      >
        {/* Same amplitude, different pitch */}
        <div
          style={{
            backgroundColor: eduTheme.card.background,
            border: `2px solid ${eduTheme.card.border}`,
            boxShadow: eduTheme.card.shadow,
            borderRadius: 16,
            padding: "25px 35px",
            textAlign: "center",
          }}
        >
          <div style={{ color: eduTheme.accent.primary, fontSize: 22, fontWeight: 600, marginBottom: 15 }}>
            Change PITCH (octave up)
          </div>
          <div style={{ marginBottom: 10 }}>
            {generateWave(2, 35, eduTheme.accent.primary)}
          </div>
          <div style={{ marginBottom: 10 }}>
            {generateWave(4, 35, eduTheme.accent.secondary)}
          </div>
          <div style={{ color: eduTheme.text.secondary, fontSize: 18, marginTop: 10 }}>
            Amplitude stays the <span style={{ color: "#16a34a", fontWeight: 600 }}>SAME</span>
          </div>
        </div>

        {/* Same pitch, different amplitude */}
        <div
          style={{
            backgroundColor: eduTheme.card.background,
            border: `2px solid ${eduTheme.card.border}`,
            boxShadow: eduTheme.card.shadow,
            borderRadius: 16,
            padding: "25px 35px",
            textAlign: "center",
          }}
        >
          <div style={{ color: "#16a34a", fontSize: 22, fontWeight: 600, marginBottom: 15 }}>
            Change AMPLITUDE (louder)
          </div>
          <div style={{ marginBottom: 10 }}>
            {generateWave(3, 20, "#16a34a")}
          </div>
          <div style={{ marginBottom: 10 }}>
            {generateWave(3, 40, "#22c55e")}
          </div>
          <div style={{ color: eduTheme.text.secondary, fontSize: 18, marginTop: 10 }}>
            Pitch stays the <span style={{ color: eduTheme.accent.primary, fontWeight: 600 }}>SAME</span>
          </div>
        </div>
      </div>

      {/* Truth box */}
      <div
        style={{
          marginTop: 40,
          display: "flex",
          gap: 30,
          opacity: truthProgress,
          transform: `scale(${truthProgress})`,
        }}
      >
        <div
          style={{
            padding: "20px 30px",
            backgroundColor: eduTheme.card.background,
            border: `2px solid ${eduTheme.accent.primary}`,
            boxShadow: eduTheme.card.shadow,
            borderRadius: 12,
          }}
        >
          <div style={{ color: eduTheme.accent.primary, fontSize: 20, fontWeight: 600 }}>PITCH</div>
          <div style={{ color: eduTheme.text.primary, fontSize: 24 }}>= Frequency</div>
          <div style={{ color: eduTheme.text.secondary, fontSize: 18 }}>Width of cycles</div>
        </div>

        <div
          style={{
            padding: "20px 30px",
            backgroundColor: eduTheme.card.background,
            border: "2px solid #16a34a",
            boxShadow: eduTheme.card.shadow,
            borderRadius: 12,
          }}
        >
          <div style={{ color: "#16a34a", fontSize: 20, fontWeight: 600 }}>AMPLITUDE</div>
          <div style={{ color: eduTheme.text.primary, fontSize: 24 }}>= Loudness</div>
          <div style={{ color: eduTheme.text.secondary, fontSize: 18 }}>Height of cycles</div>
        </div>

        <div
          style={{
            padding: "20px 30px",
            backgroundColor: eduTheme.card.background,
            border: "2px solid #f59e0b",
            boxShadow: eduTheme.card.shadow,
            borderRadius: 12,
          }}
        >
          <div style={{ color: "#f59e0b", fontSize: 20, fontWeight: 600 }}>KEY POINT</div>
          <div style={{ color: eduTheme.text.primary, fontSize: 24 }}>Independent!</div>
          <div style={{ color: eduTheme.text.secondary, fontSize: 18 }}>Change one, not the other</div>
        </div>
      </div>
    </div>
  );
};
