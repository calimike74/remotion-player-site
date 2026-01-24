import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

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
          color: "#ef4444",
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
              color: "#ef4444",
              marginBottom: 20,
              fontWeight: 600,
            }}
          >
            What students wrote:
          </div>
          <div
            style={{
              backgroundColor: "#1e293b",
              border: "2px solid #ef4444",
              borderRadius: 16,
              padding: "30px 40px",
              position: "relative",
            }}
          >
            <div style={{ fontSize: 32, color: "#ffffff", fontFamily: "serif", fontStyle: "italic" }}>
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
                backgroundColor: "#ef4444",
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

          <div style={{ color: "#94a3b8", fontSize: 20, marginTop: 15, textAlign: "center" }}>
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
              color: "#22c55e",
              marginBottom: 20,
              fontWeight: 600,
              opacity: step1Progress,
            }}
          >
            Show the working:
          </div>
          <div
            style={{
              backgroundColor: "#1e293b",
              border: "2px solid #22c55e",
              borderRadius: 16,
              padding: "25px 35px",
              position: "relative",
            }}
          >
            {/* Step 1: Observation */}
            <div
              style={{
                fontSize: 26,
                color: "#ffffff",
                marginBottom: 15,
                opacity: step1Progress,
                transform: `translateX(${interpolate(step1Progress, [0, 1], [-20, 0])}px)`,
              }}
            >
              <span style={{ color: "#94a3b8" }}>1.</span> 4 cycles in 10ms
            </div>

            {/* Step 2: Period calculation */}
            <div
              style={{
                fontSize: 26,
                color: "#ffffff",
                marginBottom: 15,
                opacity: step2Progress,
                transform: `translateX(${interpolate(step2Progress, [0, 1], [-20, 0])}px)`,
              }}
            >
              <span style={{ color: "#94a3b8" }}>2.</span> T = 10ms ÷ 4 = <span style={{ color: "#3b82f6" }}>2.5ms</span>
            </div>

            {/* Step 3: Convert to seconds */}
            <div
              style={{
                fontSize: 26,
                color: "#ffffff",
                marginBottom: 15,
                opacity: step3Progress,
                transform: `translateX(${interpolate(step3Progress, [0, 1], [-20, 0])}px)`,
              }}
            >
              <span style={{ color: "#94a3b8" }}>3.</span> T = <span style={{ color: "#3b82f6" }}>0.0025s</span>
            </div>

            {/* Step 4: Frequency */}
            <div
              style={{
                fontSize: 26,
                color: "#ffffff",
                opacity: step4Progress,
                transform: `translateX(${interpolate(step4Progress, [0, 1], [-20, 0])}px)`,
              }}
            >
              <span style={{ color: "#94a3b8" }}>4.</span> f = 1/T = 1/0.0025 = <span style={{ color: "#22c55e", fontWeight: 700 }}>400Hz</span>
            </div>

            {/* Tick mark */}
            <div
              style={{
                position: "absolute",
                top: -15,
                right: -15,
                width: 40,
                height: 40,
                backgroundColor: "#22c55e",
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
          backgroundColor: "#22c55e22",
          border: "2px solid #22c55e",
          borderRadius: 12,
          opacity: interpolate(frame, [900, 930], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <span style={{ color: "#22c55e", fontSize: 28, fontWeight: 600 }}>
          Same answer, but now worth full marks!
        </span>
      </div>
    </div>
  );
};
