import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { eqTheme, freqToX } from "./eqTheme";

/**
 * Section 6: Q Factor Deep Dive
 * Demonstrates bandwidth control and its implications
 */
export const QFactorDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation progress
  const titleProgress = spring({ frame, fps, config: { damping: 15 } });

  const formulaProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 12, stiffness: 60 },
  });

  const demoProgress = spring({
    frame: frame - 60,
    fps,
    config: { damping: 10, stiffness: 40 },
  });

  // Animated Q value cycling through examples
  const qCycle = interpolate(frame, [80, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const currentQ = interpolate(qCycle, [0, 0.33, 0.66, 1], [0.7, 2, 4, 10]);

  // Exit animation (section duration: 540 frames)
  const exitOpacity = interpolate(frame, [500, 540], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const graphWidth = 900;
  const graphHeight = 350;
  const padding = { left: 70, right: 40, top: 50, bottom: 70 };

  // Q examples to display
  const qExamples = [
    { q: 0.7, label: "Wide (0.7)", bandwidth: "700Hz - 1400Hz", use: "Tonal shaping" },
    { q: 2, label: "Medium (2)", bandwidth: "850Hz - 1170Hz", use: "Gentle correction" },
    { q: 4, label: "Narrow (4)", bandwidth: "900Hz - 1100Hz", use: "Targeted adjustment" },
    { q: 10, label: "Very Narrow (10)", bandwidth: "980Hz - 1020Hz", use: "Surgical notch" },
  ];

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
        opacity: exitOpacity,
      }}
    >
      {/* Section title */}
      <h2
        style={{
          fontSize: 44,
          fontWeight: 600,
          color: eqTheme.text.primary,
          margin: 0,
          marginBottom: 20,
          opacity: titleProgress,
        }}
      >
        Q Factor: Controlling Bandwidth
      </h2>

      {/* Formula */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 40,
          marginBottom: 30,
          opacity: formulaProgress,
        }}
      >
        <div
          style={{
            backgroundColor: eqTheme.card.background,
            borderRadius: 12,
            padding: "16px 32px",
            border: `1px solid ${eqTheme.frequency.presence}40`,
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: eqTheme.text.primary,
              fontFamily: "serif",
              fontStyle: "italic",
            }}
          >
            Q = f<sub>0</sub> / bandwidth
          </span>
        </div>
        <div style={{ color: eqTheme.text.secondary, fontSize: 18 }}>
          Higher Q = Narrower bandwidth
        </div>
      </div>

      {/* Main visualization */}
      <div
        style={{
          display: "flex",
          gap: 40,
          alignItems: "flex-start",
        }}
      >
        {/* Graph */}
        <div
          style={{
            backgroundColor: eqTheme.card.background,
            borderRadius: 16,
            border: `1px solid ${eqTheme.card.border}`,
            padding: 20,
            opacity: demoProgress,
          }}
        >
          <svg
            width={graphWidth + padding.left + padding.right}
            height={graphHeight + padding.top + padding.bottom}
          >
            {/* Grid */}
            {[-6, 0, 6].map((db) => {
              const y = padding.top + graphHeight / 2 - (db / 12) * (graphHeight / 2);
              return (
                <g key={db} opacity={0.4}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={padding.left + graphWidth}
                    y2={y}
                    stroke={eqTheme.grid.line}
                    strokeWidth={db === 0 ? 2 : 1}
                    strokeDasharray={db === 0 ? "none" : "4,4"}
                  />
                  <text
                    x={padding.left - 10}
                    y={y + 5}
                    textAnchor="end"
                    fill={eqTheme.grid.label}
                    fontSize={14}
                  >
                    {db > 0 ? `+${db}` : db}dB
                  </text>
                </g>
              );
            })}

            {/* Frequency axis */}
            {[100, 200, 500, 1000, 2000, 5000, 10000].map((f) => {
              const x = padding.left + freqToX(f, graphWidth, 50, 15000);
              return (
                <g key={f}>
                  <line
                    x1={x}
                    y1={padding.top + graphHeight}
                    x2={x}
                    y2={padding.top + graphHeight + 8}
                    stroke={eqTheme.grid.line}
                    strokeWidth={1}
                  />
                  <text
                    x={x}
                    y={padding.top + graphHeight + 25}
                    textAnchor="middle"
                    fill={eqTheme.grid.label}
                    fontSize={14}
                  >
                    {f >= 1000 ? `${f / 1000}k` : f}Hz
                  </text>
                </g>
              );
            })}

            {/* All Q curves (ghost) */}
            {qExamples.map((example, i) => {
              const curve = generateBellCurve(1000, example.q, graphWidth, graphHeight, padding);
              const isActive = Math.abs(currentQ - example.q) < 0.5;

              return (
                <path
                  key={i}
                  d={curve}
                  fill="none"
                  stroke={isActive ? eqTheme.frequency.presence : eqTheme.text.muted}
                  strokeWidth={isActive ? 4 : 2}
                  opacity={isActive ? 1 : 0.2}
                  strokeLinecap="round"
                />
              );
            })}

            {/* Center frequency line */}
            <line
              x1={padding.left + freqToX(1000, graphWidth, 50, 15000)}
              y1={padding.top}
              x2={padding.left + freqToX(1000, graphWidth, 50, 15000)}
              y2={padding.top + graphHeight}
              stroke={eqTheme.parametricEQ.primary}
              strokeWidth={2}
              strokeDasharray="8,4"
              opacity={0.5}
            />

            {/* Center frequency label */}
            <text
              x={padding.left + freqToX(1000, graphWidth, 50, 15000)}
              y={padding.top - 10}
              textAnchor="middle"
              fill={eqTheme.parametricEQ.primary}
              fontSize={16}
              fontWeight={600}
            >
              f₀ = 1kHz
            </text>

            {/* Current Q indicator */}
            <text
              x={padding.left + graphWidth - 10}
              y={padding.top + 30}
              textAnchor="end"
              fill={eqTheme.frequency.presence}
              fontSize={24}
              fontWeight={700}
            >
              Q = {currentQ.toFixed(1)}
            </text>

            {/* Axis labels */}
            <text
              x={padding.left + graphWidth / 2}
              y={padding.top + graphHeight + 55}
              textAnchor="middle"
              fill={eqTheme.text.secondary}
              fontSize={16}
              fontWeight={500}
            >
              FREQUENCY (Hz)
            </text>
          </svg>
        </div>

        {/* Q comparison table */}
        <div
          style={{
            backgroundColor: eqTheme.card.background,
            borderRadius: 16,
            border: `1px solid ${eqTheme.card.border}`,
            padding: 24,
            minWidth: 350,
            opacity: demoProgress,
          }}
        >
          <h3
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: eqTheme.text.primary,
              margin: 0,
              marginBottom: 20,
            }}
          >
            Same +6dB boost at 1kHz
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {qExamples.map((example, i) => {
              const isActive = Math.abs(currentQ - example.q) < 0.5;

              return (
                <div
                  key={i}
                  style={{
                    padding: 16,
                    backgroundColor: isActive ? `${eqTheme.frequency.presence}20` : eqTheme.background.secondary,
                    borderRadius: 8,
                    border: `2px solid ${isActive ? eqTheme.frequency.presence : "transparent"}`,
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: isActive ? eqTheme.frequency.presence : eqTheme.text.secondary,
                      }}
                    >
                      {example.label}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: eqTheme.text.muted,
                        backgroundColor: eqTheme.background.primary,
                        padding: "2px 8px",
                        borderRadius: 4,
                      }}
                    >
                      {example.use}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: eqTheme.text.muted,
                    }}
                  >
                    Affects: <span style={{ color: eqTheme.text.secondary }}>{example.bandwidth}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Exam application */}
      <div
        style={{
          marginTop: 30,
          padding: "16px 32px",
          backgroundColor: `${eqTheme.signal.input}20`,
          borderRadius: 8,
          border: `1px solid ${eqTheme.signal.input}40`,
          opacity: demoProgress,
          maxWidth: 900,
        }}
      >
        <span style={{ color: eqTheme.signal.input, fontWeight: 600 }}>EXAM APPLICATION: </span>
        <span style={{ color: eqTheme.text.secondary }}>
          Low Q for broad tonal shaping (warming bass, adding presence). High Q for surgical correction
          (removing resonances, notch filtering feedback). Professional parametric EQs typically offer Q from 0.3 to 16+.
        </span>
      </div>
    </div>
  );
};

// Generate bell curve path
function generateBellCurve(
  centerFreq: number,
  q: number,
  width: number,
  height: number,
  padding: { left: number; right: number; top: number; bottom: number }
): string {
  const points: string[] = [];
  const sampleCount = 200;
  const gain = 6;

  for (let i = 0; i <= sampleCount; i++) {
    const f = 50 * Math.pow(300, i / sampleCount); // 50Hz to 15kHz
    const octaveDistance = Math.log2(f / centerFreq);
    const bandwidth = 1 / q;
    const response = gain * Math.exp(-Math.pow(octaveDistance / bandwidth, 2) * 2);

    const x = padding.left + freqToX(f, width, 50, 15000);
    const y = padding.top + height / 2 - (response / 12) * (height / 2);

    if (i === 0) {
      points.push(`M ${x} ${y}`);
    } else {
      points.push(`L ${x} ${y}`);
    }
  }

  return points.join(" ");
}
