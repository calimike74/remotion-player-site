import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { eduTheme } from "../shared/EducationalBackground";

export const DecibelScale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation phases
  const titleProgress = spring({ frame, fps, config: { damping: 15 } });
  const meterProgress = spring({ frame: frame - 20, fps, config: { damping: 15 } });
  const fillProgress = interpolate(frame, [60, 200], [0, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const doublingProgress = spring({ frame: frame - 220, fps, config: { damping: 15 } });
  const formulaProgress = spring({ frame: frame - 320, fps, config: { damping: 15 } });

  // dB markings
  const dbMarks = [0, -6, -12, -18, -24, -30, -36, -42, -48];

  // Exit animation
  const exitOpacity = interpolate(frame, [580, 600], [1, 0], {
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
      {/* Section Title */}
      <h2
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: eduTheme.text.primary,
          marginBottom: 40,
          opacity: titleProgress,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [30, 0])}px)`,
        }}
      >
        The Decibel Scale
      </h2>

      <div style={{ display: "flex", gap: 80, alignItems: "flex-start" }}>
        {/* dB Meter */}
        <div
          style={{
            display: "flex",
            gap: 20,
            opacity: meterProgress,
            transform: `scale(${meterProgress})`,
          }}
        >
          {/* Meter bar */}
          <div
            style={{
              position: "relative",
              width: 80,
              height: 400,
              backgroundColor: "#1e293b",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            {/* Fill gradient */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: `${fillProgress * 100}%`,
                background: `linear-gradient(to top,
                  #22c55e 0%,
                  #22c55e 60%,
                  #f59e0b 80%,
                  #dc2626 100%)`,
                transition: "height 0.1s",
              }}
            />

            {/* Segment lines */}
            {dbMarks.map((db, i) => (
              <div
                key={db}
                style={{
                  position: "absolute",
                  top: `${(i / (dbMarks.length - 1)) * 100}%`,
                  left: 0,
                  right: 0,
                  height: 2,
                  backgroundColor: "rgba(255,255,255,0.3)",
                }}
              />
            ))}
          </div>

          {/* dB Labels */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: 400,
            }}
          >
            {dbMarks.map((db) => (
              <div
                key={db}
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: db === 0 ? "#dc2626" : eduTheme.text.secondary,
                }}
              >
                {db === 0 ? "0 dBFS" : `${db} dB`}
              </div>
            ))}
          </div>
        </div>

        {/* Info Panel */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 32,
            maxWidth: 600,
          }}
        >
          {/* The 6dB Rule */}
          <div
            style={{
              backgroundColor: eduTheme.card.background,
              borderRadius: 16,
              border: `2px solid ${eduTheme.accent.primary}`,
              boxShadow: eduTheme.card.shadow,
              padding: 32,
              opacity: doublingProgress,
              transform: `translateY(${interpolate(doublingProgress, [0, 1], [30, 0])}px)`,
            }}
          >
            <h3
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: eduTheme.accent.primary,
                marginBottom: 24,
                margin: 0,
              }}
            >
              The 6dB Rule
            </h3>

            {/* Visual demonstration */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                marginTop: 24,
                marginBottom: 24,
              }}
            >
              {/* First amplitude bar */}
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 60,
                    height: 80,
                    backgroundColor: "#0ea5e9",
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                />
                <div style={{ fontSize: 16, color: eduTheme.text.secondary }}>1×</div>
              </div>

              {/* Arrow and label */}
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#22c55e",
                    marginBottom: 4,
                  }}
                >
                  +6dB
                </div>
                <div
                  style={{
                    fontSize: 32,
                    color: eduTheme.text.secondary,
                  }}
                >
                  →
                </div>
              </div>

              {/* Second amplitude bar (2x height) */}
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 60,
                    height: 160,
                    backgroundColor: "#22c55e",
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                />
                <div style={{ fontSize: 16, color: eduTheme.text.secondary }}>2×</div>
              </div>

              {/* Arrow and label */}
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#f59e0b",
                    marginBottom: 4,
                  }}
                >
                  +6dB
                </div>
                <div
                  style={{
                    fontSize: 32,
                    color: eduTheme.text.secondary,
                  }}
                >
                  →
                </div>
              </div>

              {/* Third amplitude bar (4x height) */}
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 60,
                    height: 240,
                    backgroundColor: "#f59e0b",
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                />
                <div style={{ fontSize: 16, color: eduTheme.text.secondary }}>4×</div>
              </div>
            </div>

            <p
              style={{
                fontSize: 20,
                color: eduTheme.text.secondary,
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Every <strong style={{ color: "#22c55e" }}>+6dB</strong> doubles the amplitude.
              Every <strong style={{ color: "#dc2626" }}>-6dB</strong> halves it.
            </p>
          </div>

          {/* Formula Card */}
          <div
            style={{
              backgroundColor: eduTheme.card.background,
              borderRadius: 16,
              border: `1px solid ${eduTheme.card.border}`,
              boxShadow: eduTheme.card.shadow,
              padding: 24,
              opacity: formulaProgress,
              transform: `translateY(${interpolate(formulaProgress, [0, 1], [30, 0])}px)`,
            }}
          >
            <h4
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: eduTheme.text.secondary,
                marginBottom: 16,
                margin: 0,
              }}
            >
              Key Relationships
            </h4>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginTop: 16,
              }}
            >
              {[
                { db: "+6", ratio: "2×", color: "#22c55e" },
                { db: "-6", ratio: "0.5×", color: "#dc2626" },
                { db: "+12", ratio: "4×", color: "#22c55e" },
                { db: "-12", ratio: "0.25×", color: "#dc2626" },
                { db: "+20", ratio: "10×", color: "#22c55e" },
                { db: "-20", ratio: "0.1×", color: "#dc2626" },
              ].map((item) => (
                <div
                  key={item.db}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 16px",
                    backgroundColor: `${item.color}10`,
                    borderRadius: 8,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      color: item.color,
                      fontSize: 18,
                      width: 50,
                    }}
                  >
                    {item.db}dB
                  </span>
                  <span style={{ color: eduTheme.text.secondary, fontSize: 18 }}>
                    = {item.ratio} amplitude
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Exam Tip */}
          <div
            style={{
              padding: "16px 24px",
              backgroundColor: "#f0f9ff",
              border: `2px solid ${eduTheme.accent.primary}`,
              borderRadius: 12,
              opacity: interpolate(frame, [400, 420], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <span style={{ color: eduTheme.accent.primary, fontWeight: 700, fontSize: 18 }}>
              Exam Tip:{" "}
            </span>
            <span style={{ color: eduTheme.text.secondary, fontSize: 18 }}>
              0 dBFS = digital maximum. Perceived loudness doubles every +10dB (not 6dB).
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
