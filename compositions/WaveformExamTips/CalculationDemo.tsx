import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { eduTheme } from "../shared/EducationalBackground";

export const CalculationDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({ frame, fps, config: { damping: 15 } });

  // Phase 1: Show the mistake (frames 0-80)
  const mistakeProgress = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 2: "What's missing?" prompt (frames 80-140)
  const promptProgress = interpolate(frame, [80, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 3: Correct calculation steps (frames 140+)
  const step1Progress = spring({ frame: frame - 140, fps, config: { damping: 12 } });
  const step2Progress = spring({ frame: frame - 170, fps, config: { damping: 12 } });
  const step3Progress = spring({ frame: frame - 200, fps, config: { damping: 12 } });
  const step4Progress = spring({ frame: frame - 230, fps, config: { damping: 12 } });
  const tickProgress = spring({ frame: frame - 280, fps, config: { damping: 12 } });

  // Exit
  const exitOpacity = interpolate(frame, [1040, 1060], [1, 0], {
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
        padding: 60,
        opacity: exitOpacity,
      }}
    >
      {/* Section title */}
      <h2
        style={{
          fontSize: 48,
          fontWeight: 700,
          color: "#dc2626",
          marginBottom: 40,
          opacity: entryProgress,
        }}
      >
        Mistake #1: "SHOW YOUR WORKING"
      </h2>

      <div style={{ display: "flex", gap: 80, alignItems: "flex-start" }}>
        {/* Left: The mistake */}
        <div
          style={{
            opacity: mistakeProgress,
            transform: `translateY(${interpolate(mistakeProgress, [0, 1], [20, 0])}px)`,
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: "#dc2626",
              marginBottom: 20,
              fontWeight: 600,
            }}
          >
            What students wrote:
          </div>
          <div
            style={{
              backgroundColor: eduTheme.card.background,
              border: "2px solid #dc2626",
              boxShadow: eduTheme.card.shadow,
              borderRadius: 16,
              padding: "30px 40px",
              position: "relative",
            }}
          >
            <div style={{ fontSize: 32, color: eduTheme.text.primary, fontFamily: "serif", fontStyle: "italic" }}>
              "The frequency is 400Hz"
            </div>

            {/* X mark */}
            <div
              style={{
                position: "absolute",
                top: -15,
                right: -15,
                width: 40,
                height: 40,
                backgroundColor: "#dc2626",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 800,
                color: "#ffffff",
              }}
            >
              ✗
            </div>
          </div>

          <div style={{ color: eduTheme.text.secondary, fontSize: 20, marginTop: 15, textAlign: "center" }}>
            12 out of 15 students
          </div>
        </div>

        {/* Middle: Prompt */}
        <div
          style={{
            opacity: promptProgress,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 64,
              color: "#f59e0b",
              marginBottom: 10,
            }}
          >
            ?
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#f59e0b",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            What's<br />missing?
          </div>
        </div>

        {/* Right: Correct approach */}
        <div>
          <div
            style={{
              fontSize: 24,
              color: "#16a34a",
              marginBottom: 20,
              fontWeight: 600,
              opacity: step1Progress,
            }}
          >
            Show the working:
          </div>
          <div
            style={{
              backgroundColor: eduTheme.card.background,
              border: "2px solid #16a34a",
              boxShadow: eduTheme.card.shadow,
              borderRadius: 16,
              padding: "25px 35px",
              position: "relative",
            }}
          >
            {/* Step 1: Observation */}
            <div
              style={{
                fontSize: 26,
                color: eduTheme.text.primary,
                marginBottom: 15,
                opacity: step1Progress,
                transform: `translateX(${interpolate(step1Progress, [0, 1], [-20, 0])}px)`,
              }}
            >
              <span style={{ color: eduTheme.text.secondary }}>1.</span> 4 cycles in 10ms
            </div>

            {/* Step 2: Period calculation */}
            <div
              style={{
                fontSize: 26,
                color: eduTheme.text.primary,
                marginBottom: 15,
                opacity: step2Progress,
                transform: `translateX(${interpolate(step2Progress, [0, 1], [-20, 0])}px)`,
              }}
            >
              <span style={{ color: eduTheme.text.secondary }}>2.</span> T = 10ms ÷ 4 = <span style={{ color: eduTheme.accent.primary }}>2.5ms</span>
            </div>

            {/* Step 3: Convert to seconds */}
            <div
              style={{
                fontSize: 26,
                color: eduTheme.text.primary,
                marginBottom: 15,
                opacity: step3Progress,
                transform: `translateX(${interpolate(step3Progress, [0, 1], [-20, 0])}px)`,
              }}
            >
              <span style={{ color: eduTheme.text.secondary }}>3.</span> T = <span style={{ color: eduTheme.accent.primary }}>0.0025s</span>
            </div>

            {/* Step 4: Frequency */}
            <div
              style={{
                fontSize: 26,
                color: eduTheme.text.primary,
                opacity: step4Progress,
                transform: `translateX(${interpolate(step4Progress, [0, 1], [-20, 0])}px)`,
              }}
            >
              <span style={{ color: eduTheme.text.secondary }}>4.</span> f = 1/T = 1/0.0025 = <span style={{ color: "#16a34a", fontWeight: 700 }}>400Hz</span>
            </div>

            {/* Tick mark */}
            <div
              style={{
                position: "absolute",
                top: -15,
                right: -15,
                width: 40,
                height: 40,
                backgroundColor: "#16a34a",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 800,
                color: "#ffffff",
                opacity: tickProgress,
                transform: `scale(${tickProgress})`,
              }}
            >
              ✓
            </div>
          </div>
        </div>
      </div>

      {/* Key takeaway */}
      <div
        style={{
          marginTop: 50,
          padding: "20px 40px",
          backgroundColor: "#16a34a15",
          border: "2px solid #16a34a",
          borderRadius: 12,
          opacity: interpolate(frame, [900, 930], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <span style={{ color: "#16a34a", fontSize: 28, fontWeight: 600 }}>
          Same answer, but now worth full marks!
        </span>
      </div>
    </div>
  );
};
