import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { eduTheme } from "../shared/EducationalBackground";

export const OctaveRelationship: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({ frame, fps, config: { damping: 15 } });

  // Animation for the doubling visualization
  const doublingProgress = interpolate(frame, [60, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Animated calculation
  const calcProgress = interpolate(frame, [140, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit
  const exitOpacity = interpolate(frame, [360, 380], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Octave examples
  const octaves = [
    { note: "A2", hz: 110 },
    { note: "A3", hz: 220 },
    { note: "A4", hz: 440 },
    { note: "A5", hz: 880 },
    { note: "A6", hz: 1760 },
  ];

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
      <h2
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: eduTheme.text.primary,
          marginBottom: 50,
          opacity: entryProgress,
        }}
      >
        Octave = Double the Frequency
      </h2>

      {/* Visual octave chain */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginBottom: 60,
        }}
      >
        {octaves.map((oct, index) => {
          const itemProgress = spring({
            frame: frame - 20 - index * 15,
            fps,
            config: { damping: 12 },
          });

          const isReference = oct.hz === 440;

          return (
            <div key={oct.note} style={{ display: "flex", alignItems: "center" }}>
              {/* Octave box */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "20px 30px",
                  backgroundColor: isReference ? "#16a34a15" : eduTheme.card.background,
                  border: isReference ? "3px solid #16a34a" : `2px solid ${eduTheme.card.border}`,
                  boxShadow: eduTheme.card.shadow,
                  borderRadius: 16,
                  transform: `scale(${itemProgress})`,
                  opacity: itemProgress,
                }}
              >
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 800,
                    color: isReference ? "#16a34a" : eduTheme.text.primary,
                  }}
                >
                  {oct.note}
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 600,
                    color: isReference ? "#16a34a" : eduTheme.text.secondary,
                    marginTop: 8,
                  }}
                >
                  {oct.hz} Hz
                </div>
              </div>

              {/* Arrow between boxes */}
              {index < octaves.length - 1 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    margin: "0 10px",
                    opacity: doublingProgress,
                  }}
                >
                  <div style={{ color: "#f59e0b", fontSize: 24, fontWeight: 700 }}>
                    ×2
                  </div>
                  <div
                    style={{
                      fontSize: 32,
                      color: "#f59e0b",
                    }}
                  >
                    →
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Key formulas */}
      <div
        style={{
          display: "flex",
          gap: 40,
          opacity: calcProgress,
        }}
      >
        <div
          style={{
            padding: "25px 40px",
            backgroundColor: eduTheme.card.background,
            border: `2px solid ${eduTheme.accent.primary}`,
            boxShadow: eduTheme.card.shadow,
            borderRadius: 16,
          }}
        >
          <div style={{ color: eduTheme.accent.primary, fontSize: 24, fontWeight: 600, marginBottom: 10 }}>
            Octave UP
          </div>
          <div style={{ color: eduTheme.text.primary, fontSize: 32, fontWeight: 700 }}>
            f × 2
          </div>
          <div style={{ color: eduTheme.text.secondary, fontSize: 20, marginTop: 8 }}>
            440 × 2 = 880 Hz
          </div>
        </div>

        <div
          style={{
            padding: "25px 40px",
            backgroundColor: eduTheme.card.background,
            border: `2px solid ${eduTheme.accent.secondary}`,
            boxShadow: eduTheme.card.shadow,
            borderRadius: 16,
          }}
        >
          <div style={{ color: eduTheme.accent.secondary, fontSize: 24, fontWeight: 600, marginBottom: 10 }}>
            Octave DOWN
          </div>
          <div style={{ color: eduTheme.text.primary, fontSize: 32, fontWeight: 700 }}>
            f ÷ 2
          </div>
          <div style={{ color: eduTheme.text.secondary, fontSize: 20, marginTop: 8 }}>
            440 ÷ 2 = 220 Hz
          </div>
        </div>
      </div>

      {/* Exam tip */}
      <div
        style={{
          marginTop: 50,
          padding: "24px 48px",
          backgroundColor: eduTheme.card.background,
          border: `2px solid ${eduTheme.card.border}`,
          boxShadow: eduTheme.card.shadow,
          borderRadius: 16,
          opacity: interpolate(frame, [250, 280], [0, 1], {
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
          💡 <strong>Exam tip:</strong> A4 = 440 Hz is the standard tuning reference
        </p>
      </div>
    </div>
  );
};
