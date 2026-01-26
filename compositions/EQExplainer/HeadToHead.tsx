import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { eqTheme, freqToX, graphicEQBands } from "./eqTheme";

/**
 * Section 7: Head-to-Head Comparison
 * Same problem (800Hz resonance), two solutions
 */
export const HeadToHead: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation phases
  const titleProgress = spring({ frame, fps, config: { damping: 15 } });

  const problemProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 12, stiffness: 60 },
  });

  const graphicSolutionProgress = spring({
    frame: frame - 100,
    fps,
    config: { damping: 12, stiffness: 50 },
  });

  const parametricSolutionProgress = spring({
    frame: frame - 180,
    fps,
    config: { damping: 12, stiffness: 50 },
  });

  const comparisonProgress = spring({
    frame: frame - 280,
    fps,
    config: { damping: 15, stiffness: 60 },
  });

  // Exit animation (section duration: 600 frames)
  const exitOpacity = interpolate(frame, [560, 600], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const graphWidth = 700;
  const graphHeight = 220;
  const padding = { left: 60, right: 30, top: 40, bottom: 50 };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        padding: 50,
        opacity: exitOpacity,
      }}
    >
      {/* Section title */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 20,
          opacity: titleProgress,
        }}
      >
        <h2
          style={{
            fontSize: 40,
            fontWeight: 600,
            color: eqTheme.text.primary,
            margin: 0,
          }}
        >
          Head-to-Head: Same Problem, Two Solutions
        </h2>
      </div>

      {/* Problem statement */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 30,
          opacity: problemProgress,
        }}
      >
        <div
          style={{
            display: "inline-block",
            backgroundColor: "#EF444420",
            border: "2px solid #EF4444",
            borderRadius: 12,
            padding: "16px 40px",
          }}
        >
          <span style={{ color: "#EF4444", fontWeight: 600, fontSize: 20 }}>
            PROBLEM:
          </span>
          <span style={{ color: eqTheme.text.primary, fontSize: 20, marginLeft: 12 }}>
            Room resonance at <strong>800Hz</strong> causing muddiness
          </span>
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div
        style={{
          display: "flex",
          gap: 40,
          flex: 1,
        }}
      >
        {/* Graphic EQ solution */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            opacity: graphicSolutionProgress,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                backgroundColor: eqTheme.graphicEQ.primary,
                color: eqTheme.text.primary,
                padding: "6px 16px",
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              GRAPHIC EQ
            </div>
            <span style={{ color: eqTheme.text.secondary, fontSize: 16 }}>
              Nearest band: 800Hz or compromise
            </span>
          </div>

          <GraphicEQSolution
            width={graphWidth}
            height={graphHeight}
            padding={padding}
            progress={graphicSolutionProgress}
          />

          <div
            style={{
              backgroundColor: eqTheme.card.background,
              borderRadius: 12,
              border: `1px solid ${eqTheme.graphicEQ.primary}40`,
              padding: 16,
            }}
          >
            <div style={{ color: eqTheme.text.muted, fontSize: 14, marginBottom: 8 }}>
              Affected range:
            </div>
            <div style={{ color: "#EF4444", fontSize: 18, fontWeight: 600 }}>
              ~500Hz – 1200Hz
            </div>
            <div style={{ color: eqTheme.text.secondary, fontSize: 14, marginTop: 8 }}>
              Fixed Q affects surrounding frequencies (collateral damage)
            </div>
          </div>
        </div>

        {/* VS divider */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            opacity: comparisonProgress,
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: eqTheme.card.background,
              border: `2px solid ${eqTheme.grid.line}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: eqTheme.text.primary,
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            VS
          </div>
        </div>

        {/* Parametric EQ solution */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            opacity: parametricSolutionProgress,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                backgroundColor: eqTheme.parametricEQ.primary,
                color: eqTheme.text.primary,
                padding: "6px 16px",
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              PARAMETRIC EQ
            </div>
            <span style={{ color: eqTheme.text.secondary, fontSize: 16 }}>
              Dial in exact 800Hz, narrow Q
            </span>
          </div>

          <ParametricEQSolution
            width={graphWidth}
            height={graphHeight}
            padding={padding}
            progress={parametricSolutionProgress}
          />

          <div
            style={{
              backgroundColor: eqTheme.card.background,
              borderRadius: 12,
              border: `1px solid ${eqTheme.parametricEQ.primary}40`,
              padding: 16,
            }}
          >
            <div style={{ color: eqTheme.text.muted, fontSize: 14, marginBottom: 8 }}>
              Affected range:
            </div>
            <div style={{ color: eqTheme.parametricEQ.primary, fontSize: 18, fontWeight: 600 }}>
              ~700Hz – 900Hz
            </div>
            <div style={{ color: eqTheme.text.secondary, fontSize: 14, marginTop: 8 }}>
              Surgical precision, minimal collateral impact
            </div>
          </div>
        </div>
      </div>

      {/* Conclusion */}
      <div
        style={{
          display: "flex",
          gap: 40,
          marginTop: 20,
          opacity: comparisonProgress,
        }}
      >
        <div
          style={{
            flex: 1,
            padding: 16,
            backgroundColor: `${eqTheme.graphicEQ.primary}15`,
            borderRadius: 12,
            border: `1px solid ${eqTheme.graphicEQ.primary}40`,
          }}
        >
          <div style={{ color: eqTheme.graphicEQ.primary, fontWeight: 600, marginBottom: 4 }}>
            GRAPHIC EQ STRENGTH
          </div>
          <div style={{ color: eqTheme.text.secondary, fontSize: 15 }}>
            Fast workflow • Visual feedback • Predictable bands • Ideal for live sound
          </div>
        </div>
        <div style={{ width: 80 }} />
        <div
          style={{
            flex: 1,
            padding: 16,
            backgroundColor: `${eqTheme.parametricEQ.primary}15`,
            borderRadius: 12,
            border: `1px solid ${eqTheme.parametricEQ.primary}40`,
          }}
        >
          <div style={{ color: eqTheme.parametricEQ.primary, fontWeight: 600, marginBottom: 4 }}>
            PARAMETRIC EQ STRENGTH
          </div>
          <div style={{ color: eqTheme.text.secondary, fontSize: 15 }}>
            Precision targeting • Flexible bandwidth • Surgical corrections • Ideal for studio mixing
          </div>
        </div>
      </div>
    </div>
  );
};

// Graphic EQ solution visualization
const GraphicEQSolution: React.FC<{
  width: number;
  height: number;
  padding: { left: number; right: number; top: number; bottom: number };
  progress: number;
}> = ({ width, height, padding, progress }) => {
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Show problem frequency and graphic EQ response
  const bands = graphicEQBands.thirdOctave; // Using 30-band for 800Hz availability
  const cutBand = 800;
  const cutAmount = -6;

  // Generate graphic EQ curve (broad cut at 800Hz)
  const generateGraphicCurve = () => {
    const points: string[] = [];
    const sampleCount = 200;

    for (let i = 0; i <= sampleCount; i++) {
      const f = 100 * Math.pow(100, i / sampleCount);
      let response = 0;

      // Contribution from the 800Hz band
      const octaveDistance = Math.abs(Math.log2(f / cutBand));
      const q = 1.4; // Typical graphic EQ Q
      response = cutAmount * Math.exp(-Math.pow(octaveDistance * q, 2));

      const x = padding.left + freqToX(f, graphWidth, 100, 10000);
      const y = padding.top + graphHeight / 2 - (response / 12) * (graphHeight / 2);

      if (i === 0) {
        points.push(`M ${x} ${y}`);
      } else {
        points.push(`L ${x} ${y}`);
      }
    }

    return points.join(" ");
  };

  return (
    <div
      style={{
        backgroundColor: eqTheme.card.background,
        borderRadius: 12,
        border: `1px solid ${eqTheme.card.border}`,
        padding: 16,
      }}
    >
      <svg width={width} height={height}>
        {/* Grid */}
        {[-6, 0, 6].map((db) => {
          const y = padding.top + graphHeight / 2 - (db / 12) * (graphHeight / 2);
          return (
            <g key={db} opacity={0.3}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + graphWidth}
                y2={y}
                stroke={eqTheme.grid.line}
                strokeWidth={db === 0 ? 2 : 1}
              />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" fill={eqTheme.grid.label} fontSize={11}>
                {db > 0 ? `+${db}` : db}
              </text>
            </g>
          );
        })}

        {/* Problem frequency indicator */}
        <line
          x1={padding.left + freqToX(800, graphWidth, 100, 10000)}
          y1={padding.top}
          x2={padding.left + freqToX(800, graphWidth, 100, 10000)}
          y2={padding.top + graphHeight}
          stroke="#EF4444"
          strokeWidth={2}
          strokeDasharray="6,4"
          opacity={0.6}
        />
        <text
          x={padding.left + freqToX(800, graphWidth, 100, 10000)}
          y={padding.top - 8}
          textAnchor="middle"
          fill="#EF4444"
          fontSize={12}
          fontWeight={600}
        >
          800Hz problem
        </text>

        {/* EQ curve */}
        <path
          d={generateGraphicCurve()}
          fill="none"
          stroke={eqTheme.graphicEQ.primary}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray="1000"
          strokeDashoffset={1000 * (1 - progress)}
        />

        {/* Affected area highlight */}
        <rect
          x={padding.left + freqToX(500, graphWidth, 100, 10000)}
          y={padding.top}
          width={freqToX(1200, graphWidth, 100, 10000) - freqToX(500, graphWidth, 100, 10000)}
          height={graphHeight}
          fill={eqTheme.graphicEQ.primary}
          opacity={0.1 * progress}
        />

        {/* Frequency labels */}
        {[200, 500, 1000, 2000, 5000].map((f) => (
          <text
            key={f}
            x={padding.left + freqToX(f, graphWidth, 100, 10000)}
            y={height - 10}
            textAnchor="middle"
            fill={eqTheme.grid.label}
            fontSize={11}
          >
            {f >= 1000 ? `${f / 1000}k` : f}
          </text>
        ))}
      </svg>
    </div>
  );
};

// Parametric EQ solution visualization
const ParametricEQSolution: React.FC<{
  width: number;
  height: number;
  padding: { left: number; right: number; top: number; bottom: number };
  progress: number;
}> = ({ width, height, padding, progress }) => {
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const cutFreq = 800;
  const cutAmount = -6;
  const q = 4; // Narrow Q for surgical cut

  // Generate parametric EQ curve (narrow cut at 800Hz)
  const generateParametricCurve = () => {
    const points: string[] = [];
    const sampleCount = 200;

    for (let i = 0; i <= sampleCount; i++) {
      const f = 100 * Math.pow(100, i / sampleCount);
      const octaveDistance = Math.log2(f / cutFreq);
      const bandwidth = 1 / q;
      const response = cutAmount * Math.exp(-Math.pow(octaveDistance / bandwidth, 2) * 2);

      const x = padding.left + freqToX(f, graphWidth, 100, 10000);
      const y = padding.top + graphHeight / 2 - (response / 12) * (graphHeight / 2);

      if (i === 0) {
        points.push(`M ${x} ${y}`);
      } else {
        points.push(`L ${x} ${y}`);
      }
    }

    return points.join(" ");
  };

  return (
    <div
      style={{
        backgroundColor: eqTheme.card.background,
        borderRadius: 12,
        border: `1px solid ${eqTheme.card.border}`,
        padding: 16,
      }}
    >
      <svg width={width} height={height}>
        {/* Grid */}
        {[-6, 0, 6].map((db) => {
          const y = padding.top + graphHeight / 2 - (db / 12) * (graphHeight / 2);
          return (
            <g key={db} opacity={0.3}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + graphWidth}
                y2={y}
                stroke={eqTheme.grid.line}
                strokeWidth={db === 0 ? 2 : 1}
              />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" fill={eqTheme.grid.label} fontSize={11}>
                {db > 0 ? `+${db}` : db}
              </text>
            </g>
          );
        })}

        {/* Problem frequency indicator */}
        <line
          x1={padding.left + freqToX(800, graphWidth, 100, 10000)}
          y1={padding.top}
          x2={padding.left + freqToX(800, graphWidth, 100, 10000)}
          y2={padding.top + graphHeight}
          stroke="#EF4444"
          strokeWidth={2}
          strokeDasharray="6,4"
          opacity={0.6}
        />
        <text
          x={padding.left + freqToX(800, graphWidth, 100, 10000)}
          y={padding.top - 8}
          textAnchor="middle"
          fill="#EF4444"
          fontSize={12}
          fontWeight={600}
        >
          800Hz problem
        </text>

        {/* EQ curve */}
        <path
          d={generateParametricCurve()}
          fill="none"
          stroke={eqTheme.parametricEQ.primary}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray="1000"
          strokeDashoffset={1000 * (1 - progress)}
        />

        {/* Affected area highlight (narrower) */}
        <rect
          x={padding.left + freqToX(700, graphWidth, 100, 10000)}
          y={padding.top}
          width={freqToX(900, graphWidth, 100, 10000) - freqToX(700, graphWidth, 100, 10000)}
          height={graphHeight}
          fill={eqTheme.parametricEQ.primary}
          opacity={0.1 * progress}
        />

        {/* Frequency labels */}
        {[200, 500, 1000, 2000, 5000].map((f) => (
          <text
            key={f}
            x={padding.left + freqToX(f, graphWidth, 100, 10000)}
            y={height - 10}
            textAnchor="middle"
            fill={eqTheme.grid.label}
            fontSize={11}
          >
            {f >= 1000 ? `${f / 1000}k` : f}
          </text>
        ))}

        {/* Q indicator */}
        <text
          x={width - padding.right - 10}
          y={padding.top + 15}
          textAnchor="end"
          fill={eqTheme.frequency.presence}
          fontSize={14}
          fontWeight={600}
          opacity={progress}
        >
          Q = 4
        </text>
      </svg>
    </div>
  );
};
