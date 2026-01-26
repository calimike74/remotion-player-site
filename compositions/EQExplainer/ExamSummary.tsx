import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { eqTheme } from "./eqTheme";

/**
 * Section 9: Exam Summary
 * Key points with Edexcel mark scheme language
 */
export const ExamSummary: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation progress
  const titleProgress = spring({ frame, fps, config: { damping: 15 } });

  // Staggered reveal for points
  const graphicPoints = [
    { text: "Parallel filter bank routing", delay: 20 },
    { text: "Fixed center frequencies (octave, half-octave, or third-octave spacing)", delay: 35 },
    { text: "Constant Q per band", delay: 50 },
    { text: "Only gain is adjustable per band", delay: 65 },
    { text: "Visual feedback: slider position represents EQ curve", delay: 80 },
  ];

  const parametricPoints = [
    { text: "Series filter routing (cascaded)", delay: 100 },
    { text: "Adjustable center frequency per band", delay: 115 },
    { text: "Adjustable Q (bandwidth) per band", delay: 130 },
    { text: "Adjustable gain per band", delay: 145 },
    { text: "Fewer bands but greater flexibility and precision", delay: 160 },
  ];

  const examTipProgress = spring({
    frame: frame - 200,
    fps,
    config: { damping: 12, stiffness: 60 },
  });

  // No exit animation - hold final frame (section duration: 540 frames)
  const holdOpacity = interpolate(frame, [500, 540], [1, 1], {
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
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
        opacity: holdOpacity,
      }}
    >
      {/* Section title */}
      <h2
        style={{
          fontSize: 44,
          fontWeight: 600,
          color: eqTheme.text.primary,
          margin: 0,
          marginBottom: 40,
          opacity: titleProgress,
        }}
      >
        Exam Summary: Key Distinctions
      </h2>

      {/* Two-column layout */}
      <div style={{ display: "flex", gap: 50, marginBottom: 40 }}>
        {/* Graphic EQ column */}
        <div
          style={{
            backgroundColor: eqTheme.card.background,
            borderRadius: 16,
            border: `2px solid ${eqTheme.graphicEQ.primary}`,
            padding: 30,
            width: 480,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                backgroundColor: eqTheme.graphicEQ.primary,
                color: eqTheme.text.primary,
                padding: "8px 20px",
                borderRadius: 8,
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              GRAPHIC EQ
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {graphicPoints.map((point, i) => {
              const pointProgress = spring({
                frame: frame - point.delay,
                fps,
                config: { damping: 15, stiffness: 100 },
              });

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    opacity: pointProgress,
                    transform: `translateX(${interpolate(pointProgress, [0, 1], [-20, 0])}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 4,
                      backgroundColor: eqTheme.graphicEQ.primary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <CheckIcon />
                  </div>
                  <span
                    style={{
                      color: eqTheme.text.secondary,
                      fontSize: 17,
                      lineHeight: 1.5,
                    }}
                  >
                    {point.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Parametric EQ column */}
        <div
          style={{
            backgroundColor: eqTheme.card.background,
            borderRadius: 16,
            border: `2px solid ${eqTheme.parametricEQ.primary}`,
            padding: 30,
            width: 480,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                backgroundColor: eqTheme.parametricEQ.primary,
                color: eqTheme.text.primary,
                padding: "8px 20px",
                borderRadius: 8,
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              PARAMETRIC EQ
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {parametricPoints.map((point, i) => {
              const pointProgress = spring({
                frame: frame - point.delay,
                fps,
                config: { damping: 15, stiffness: 100 },
              });

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    opacity: pointProgress,
                    transform: `translateX(${interpolate(pointProgress, [0, 1], [-20, 0])}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 4,
                      backgroundColor: eqTheme.parametricEQ.primary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <CheckIcon />
                  </div>
                  <span
                    style={{
                      color: eqTheme.text.secondary,
                      fontSize: 17,
                      lineHeight: 1.5,
                    }}
                  >
                    {point.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Exam tip */}
      <div
        style={{
          backgroundColor: `${eqTheme.signal.input}20`,
          borderRadius: 16,
          border: `2px solid ${eqTheme.signal.input}`,
          padding: 30,
          maxWidth: 1010,
          opacity: examTipProgress,
          transform: `translateY(${interpolate(examTipProgress, [0, 1], [20, 0])}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 20,
          }}
        >
          <div
            style={{
              backgroundColor: eqTheme.signal.input,
              borderRadius: 8,
              padding: "8px 16px",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                color: eqTheme.background.primary,
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              EXAM TIP
            </span>
          </div>
          <div>
            <p
              style={{
                color: eqTheme.text.primary,
                fontSize: 18,
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              When comparing graphic and parametric EQ in an exam response, structure your answer around three axes:
            </p>
            <div
              style={{
                display: "flex",
                gap: 30,
                marginTop: 16,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    backgroundColor: eqTheme.card.background,
                    borderRadius: 8,
                    padding: "12px 24px",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: eqTheme.text.primary, fontWeight: 600, fontSize: 16 }}>
                    ROUTING
                  </span>
                </div>
                <span style={{ color: eqTheme.text.muted, fontSize: 14 }}>
                  Parallel vs Series
                </span>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    backgroundColor: eqTheme.card.background,
                    borderRadius: 8,
                    padding: "12px 24px",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: eqTheme.text.primary, fontWeight: 600, fontSize: 16 }}>
                    PARAMETERS
                  </span>
                </div>
                <span style={{ color: eqTheme.text.muted, fontSize: 14 }}>
                  1 vs 3 per band
                </span>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    backgroundColor: eqTheme.card.background,
                    borderRadius: 8,
                    padding: "12px 24px",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: eqTheme.text.primary, fontWeight: 600, fontSize: 16 }}>
                    APPLICATION
                  </span>
                </div>
                <span style={{ color: eqTheme.text.muted, fontSize: 14 }}>
                  Live sound vs Studio
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edexcel reference */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          color: eqTheme.text.muted,
          fontSize: 16,
          opacity: examTipProgress,
        }}
      >
        Edexcel A-Level Music Technology • Topic 1.11 EQ
      </div>
    </div>
  );
};

// Check icon component
const CheckIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M2 7L5.5 10.5L12 3.5"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
