import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EducationalBackground, eduTheme } from "../shared/EducationalBackground";

const PARAMETERS = [
  {
    name: "THRESHOLD",
    value: "-20 dB",
    description: "Level where compression begins",
    color: "#ef4444",
    icon: "━━━",
  },
  {
    name: "RATIO",
    value: "4:1",
    description: "Amount of gain reduction applied",
    color: "#3b82f6",
    icon: "◢",
  },
  {
    name: "ATTACK",
    value: "10 ms",
    description: "How fast compression responds",
    color: "#f59e0b",
    icon: "▶",
  },
  {
    name: "RELEASE",
    value: "100 ms",
    description: "How fast compression recovers",
    color: "#8b5cf6",
    icon: "◀",
  },
];

export const ParameterExplainer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  // Exit animation
  const exitOpacity = interpolate(frame, [160, 180], [1, 0], {
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
        padding: 100,
        opacity: exitOpacity,
      }}
    >
      <EducationalBackground />
      {/* Title */}
      <h2
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: eduTheme.text.primary,
          marginBottom: 60,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [-30, 0])}px)`,
          opacity: titleProgress,
        }}
      >
        Key Compressor Parameters
      </h2>

      {/* Parameters grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 40,
          width: "100%",
          maxWidth: 1400,
        }}
      >
        {PARAMETERS.map((param, index) => {
          const delay = 15 + index * 15;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 12 },
          });

          const scale = interpolate(progress, [0, 1], [0.8, 1]);
          const opacity = interpolate(progress, [0, 1], [0, 1]);

          return (
            <div
              key={param.name}
              style={{
                backgroundColor: eduTheme.card.background,
                border: `3px solid ${eduTheme.card.border}`,
                boxShadow: eduTheme.card.shadow,
                borderRadius: 20,
                padding: "40px 50px",
                transform: `scale(${scale})`,
                opacity,
                display: "flex",
                alignItems: "center",
                gap: 30,
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 16,
                  backgroundColor: `${param.color}22`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 36,
                  color: param.color,
                  fontWeight: 900,
                  flexShrink: 0,
                }}
              >
                {param.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: 8,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 32,
                      fontWeight: 800,
                      color: param.color,
                      margin: 0,
                      letterSpacing: 2,
                    }}
                  >
                    {param.name}
                  </h3>
                  <span
                    style={{
                      fontSize: 36,
                      fontWeight: 700,
                      color: eduTheme.text.primary,
                    }}
                  >
                    {param.value}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 24,
                    color: eduTheme.text.secondary,
                    margin: 0,
                  }}
                >
                  {param.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom tip */}
      <div
        style={{
          marginTop: 60,
          padding: "24px 48px",
          backgroundColor: eduTheme.card.background,
          border: `2px solid ${eduTheme.card.border}`,
          boxShadow: eduTheme.card.shadow,
          borderRadius: 16,
          opacity: interpolate(frame, [100, 120], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <p
          style={{
            fontSize: 28,
            color: eduTheme.text.secondary,
            margin: 0,
            textAlign: "center",
          }}
        >
          💡 <strong>Exam tip:</strong> Know how each parameter affects the sound and when to use different settings
        </p>
      </div>
    </div>
  );
};
