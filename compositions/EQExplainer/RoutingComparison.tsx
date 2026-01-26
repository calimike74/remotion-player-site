import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { eqTheme } from "./eqTheme";

/**
 * Section 8: Routing Implications (Extension Content)
 * For higher-ability students: phase and series routing implications
 */
export const RoutingComparison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation progress
  const titleProgress = spring({ frame, fps, config: { damping: 15 } });

  const parallelProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 12, stiffness: 60 },
  });

  const seriesProgress = spring({
    frame: frame - 80,
    fps,
    config: { damping: 12, stiffness: 60 },
  });

  const phaseProgress = spring({
    frame: frame - 140,
    fps,
    config: { damping: 15, stiffness: 50 },
  });

  // Exit animation (section duration: 480 frames)
  const exitOpacity = interpolate(frame, [440, 480], [1, 0], {
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
        opacity: exitOpacity,
      }}
    >
      {/* Extension badge */}
      <div
        style={{
          backgroundColor: `${eqTheme.frequency.presence}30`,
          border: `1px solid ${eqTheme.frequency.presence}`,
          borderRadius: 20,
          padding: "6px 20px",
          marginBottom: 16,
          opacity: titleProgress,
        }}
      >
        <span style={{ color: eqTheme.frequency.presence, fontSize: 14, fontWeight: 600 }}>
          EXTENSION CONTENT
        </span>
      </div>

      {/* Section title */}
      <h2
        style={{
          fontSize: 40,
          fontWeight: 600,
          color: eqTheme.text.primary,
          margin: 0,
          marginBottom: 40,
          opacity: titleProgress,
        }}
      >
        Signal Routing: Phase Implications
      </h2>

      {/* Side-by-side diagrams */}
      <div style={{ display: "flex", gap: 60 }}>
        {/* Parallel routing */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            opacity: parallelProgress,
          }}
        >
          <div
            style={{
              backgroundColor: eqTheme.graphicEQ.primary,
              color: eqTheme.text.primary,
              padding: "8px 24px",
              borderRadius: 8,
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            PARALLEL (Graphic)
          </div>

          <ParallelDiagram progress={parallelProgress} />

          <div
            style={{
              backgroundColor: eqTheme.card.background,
              borderRadius: 12,
              border: `1px solid ${eqTheme.graphicEQ.primary}40`,
              padding: 20,
              maxWidth: 350,
            }}
          >
            <div style={{ color: eqTheme.text.secondary, fontSize: 15, lineHeight: 1.6 }}>
              <div style={{ marginBottom: 12 }}>
                <strong style={{ color: eqTheme.graphicEQ.primary }}>Each filter sees the original signal</strong>
              </div>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>No inter-filter interaction</li>
                <li>Phase remains more coherent</li>
                <li>Boost + cut = predictable result</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Series routing */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            opacity: seriesProgress,
          }}
        >
          <div
            style={{
              backgroundColor: eqTheme.parametricEQ.primary,
              color: eqTheme.text.primary,
              padding: "8px 24px",
              borderRadius: 8,
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            SERIES (Parametric)
          </div>

          <SeriesDiagram progress={seriesProgress} />

          <div
            style={{
              backgroundColor: eqTheme.card.background,
              borderRadius: 12,
              border: `1px solid ${eqTheme.parametricEQ.primary}40`,
              padding: 20,
              maxWidth: 350,
            }}
          >
            <div style={{ color: eqTheme.text.secondary, fontSize: 15, lineHeight: 1.6 }}>
              <div style={{ marginBottom: 12 }}>
                <strong style={{ color: eqTheme.parametricEQ.primary }}>Each filter modifies the previous output</strong>
              </div>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>Cumulative phase shift</li>
                <li>Filter effects compound</li>
                <li>Boost + cut ≠ flat (asymmetric)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Phase note */}
      <div
        style={{
          marginTop: 40,
          padding: 24,
          backgroundColor: `${eqTheme.frequency.presence}15`,
          borderRadius: 12,
          border: `1px solid ${eqTheme.frequency.presence}40`,
          maxWidth: 900,
          opacity: phaseProgress,
        }}
      >
        <h4
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: eqTheme.frequency.presence,
            margin: 0,
            marginBottom: 12,
          }}
        >
          Why This Matters
        </h4>
        <p
          style={{
            color: eqTheme.text.secondary,
            fontSize: 16,
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          Series routing introduces <strong style={{ color: eqTheme.text.primary }}>cumulative group delay</strong>—
          different frequencies arrive at slightly different times. In musical applications this is rarely
          problematic, but in system alignment, measurement, and mastering,{" "}
          <strong style={{ color: eqTheme.text.primary }}>linear-phase alternatives</strong> may be preferred.
          Understanding this distinction demonstrates advanced technical awareness.
        </p>
      </div>
    </div>
  );
};

// Parallel routing diagram
const ParallelDiagram: React.FC<{ progress: number }> = ({ progress }) => {
  const width = 350;
  const height = 220;
  const centerY = height / 2;

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
        {/* Input */}
        <circle cx={30} cy={centerY} r={16} fill={eqTheme.signal.input} opacity={progress} />
        <text
          x={30}
          y={centerY + 4}
          textAnchor="middle"
          fill={eqTheme.background.primary}
          fontSize={11}
          fontWeight={600}
          opacity={progress}
        >
          IN
        </text>

        {/* Split point */}
        <circle cx={80} cy={centerY} r={6} fill={eqTheme.text.secondary} opacity={progress} />

        {/* Input to split */}
        <line
          x1={46}
          y1={centerY}
          x2={74}
          y2={centerY}
          stroke={eqTheme.signal.input}
          strokeWidth={2}
          opacity={progress}
        />

        {/* Parallel paths */}
        {[-60, -20, 20, 60].map((offset, i) => (
          <g key={i} opacity={progress}>
            {/* Split to filter */}
            <path
              d={`M 80 ${centerY} Q 110 ${centerY} 130 ${centerY + offset}`}
              fill="none"
              stroke={eqTheme.graphicEQ.secondary}
              strokeWidth={2}
            />
            {/* Filter box */}
            <rect
              x={130}
              y={centerY + offset - 12}
              width={60}
              height={24}
              rx={4}
              fill={eqTheme.graphicEQ.primary}
            />
            <text
              x={160}
              y={centerY + offset + 4}
              textAnchor="middle"
              fill={eqTheme.text.primary}
              fontSize={10}
            >
              Band {i + 1}
            </text>
            {/* Filter to sum */}
            <path
              d={`M 190 ${centerY + offset} Q 210 ${centerY + offset} 230 ${centerY}`}
              fill="none"
              stroke={eqTheme.graphicEQ.secondary}
              strokeWidth={2}
            />
          </g>
        ))}

        {/* Sum node */}
        <circle cx={260} cy={centerY} r={18} fill={eqTheme.parametricEQ.primary} opacity={progress} />
        <text
          x={260}
          y={centerY + 5}
          textAnchor="middle"
          fill={eqTheme.text.primary}
          fontSize={16}
          fontWeight={700}
          opacity={progress}
        >
          Σ
        </text>

        {/* Output */}
        <line
          x1={278}
          y1={centerY}
          x2={304}
          y2={centerY}
          stroke={eqTheme.signal.output}
          strokeWidth={2}
          opacity={progress}
        />
        <circle cx={320} cy={centerY} r={16} fill={eqTheme.signal.output} opacity={progress} />
        <text
          x={320}
          y={centerY + 4}
          textAnchor="middle"
          fill={eqTheme.background.primary}
          fontSize={11}
          fontWeight={600}
          opacity={progress}
        >
          OUT
        </text>
      </svg>
    </div>
  );
};

// Series routing diagram
const SeriesDiagram: React.FC<{ progress: number }> = ({ progress }) => {
  const width = 350;
  const height = 220;
  const centerY = height / 2;

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
        {/* Input */}
        <circle cx={30} cy={centerY} r={16} fill={eqTheme.signal.input} opacity={progress} />
        <text
          x={30}
          y={centerY + 4}
          textAnchor="middle"
          fill={eqTheme.background.primary}
          fontSize={11}
          fontWeight={600}
          opacity={progress}
        >
          IN
        </text>

        {/* Series chain */}
        {[0, 1, 2, 3].map((i) => {
          const x = 80 + i * 65;
          return (
            <g key={i} opacity={progress}>
              {/* Connector */}
              {i > 0 && (
                <line
                  x1={x - 25}
                  y1={centerY}
                  x2={x - 5}
                  y2={centerY}
                  stroke={eqTheme.parametricEQ.secondary}
                  strokeWidth={2}
                  markerEnd="url(#seriesArrow)"
                />
              )}
              {i === 0 && (
                <line
                  x1={46}
                  y1={centerY}
                  x2={x - 5}
                  y2={centerY}
                  stroke={eqTheme.signal.input}
                  strokeWidth={2}
                />
              )}
              {/* Filter box */}
              <rect
                x={x - 5}
                y={centerY - 25}
                width={50}
                height={50}
                rx={6}
                fill={eqTheme.parametricEQ.primary}
              />
              <text
                x={x + 20}
                y={centerY + 5}
                textAnchor="middle"
                fill={eqTheme.text.primary}
                fontSize={11}
                fontWeight={500}
              >
                F{i + 1}
              </text>
            </g>
          );
        })}

        {/* Output */}
        <line
          x1={315}
          y1={centerY}
          x2={330}
          y2={centerY}
          stroke={eqTheme.signal.output}
          strokeWidth={2}
          opacity={progress}
        />

        {/* Arrow marker */}
        <defs>
          <marker
            id="seriesArrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill={eqTheme.parametricEQ.secondary} />
          </marker>
        </defs>

        {/* Phase accumulation indicators */}
        <g opacity={progress * 0.6}>
          {[0, 1, 2, 3].map((i) => {
            const x = 100 + i * 65;
            return (
              <text
                key={i}
                x={x}
                y={centerY + 50}
                textAnchor="middle"
                fill={eqTheme.frequency.presence}
                fontSize={10}
              >
                +φ{i + 1}
              </text>
            );
          })}
        </g>

        {/* Cumulative phase label */}
        <text
          x={width / 2}
          y={height - 15}
          textAnchor="middle"
          fill={eqTheme.text.muted}
          fontSize={11}
          fontStyle="italic"
          opacity={progress}
        >
          Phase accumulates: φ₁ + φ₂ + φ₃ + φ₄
        </text>
      </svg>
    </div>
  );
};
