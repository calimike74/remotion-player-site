import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { eqTheme } from "./eqTheme";

/**
 * Section 5: Parametric EQ Architecture
 * Shows series routing and three-parameter control per band
 */
export const ParametricEQArchitecture: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation phases
  const titleProgress = spring({ frame, fps, config: { damping: 15 } });

  const diagramProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12, stiffness: 60 },
  });

  const signalProgress = interpolate(frame, [60, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const parametersProgress = spring({
    frame: frame - 200,
    fps,
    config: { damping: 12, stiffness: 50 },
  });

  const freqSweepProgress = interpolate(frame, [280, 360], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const qDemoProgress = interpolate(frame, [380, 440], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit animation (section duration: 600 frames)
  const exitOpacity = interpolate(frame, [560, 600], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Animated parameter values
  const animatedFreq = interpolate(freqSweepProgress, [0, 1], [500, 2000]);
  const animatedQ = interpolate(qDemoProgress, [0, 1], [0.7, 4]);

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
      {/* Section header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginBottom: 30,
          opacity: titleProgress,
        }}
      >
        <div
          style={{
            backgroundColor: eqTheme.parametricEQ.primary,
            color: eqTheme.text.primary,
            padding: "8px 20px",
            borderRadius: 6,
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          PARAMETRIC EQ
        </div>
        <h2
          style={{
            fontSize: 40,
            fontWeight: 600,
            color: eqTheme.text.primary,
            margin: 0,
          }}
        >
          Series Filter Routing
        </h2>
      </div>

      <div style={{ display: "flex", gap: 40, flex: 1 }}>
        {/* Left: Series signal flow */}
        <div style={{ flex: "0 0 700px", display: "flex", flexDirection: "column", gap: 20 }}>
          <SeriesFlowDiagram progress={diagramProgress} signalProgress={signalProgress} />

          {/* Key differences */}
          <div
            style={{
              backgroundColor: eqTheme.card.background,
              borderRadius: 12,
              border: `1px solid ${eqTheme.card.border}`,
              padding: 20,
              opacity: parametersProgress,
            }}
          >
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: eqTheme.parametricEQ.primary,
                margin: 0,
                marginBottom: 12,
              }}
            >
              Three Parameters Per Band
            </h3>
            <div style={{ display: "flex", gap: 30 }}>
              <ParameterCard
                name="Frequency"
                description="Choose exactly which frequency to affect"
                value={`${Math.round(animatedFreq)}Hz`}
                color={eqTheme.frequency.mid}
                progress={freqSweepProgress}
              />
              <ParameterCard
                name="Gain"
                description="How much boost or cut to apply"
                value="+6dB"
                color={eqTheme.graphicEQ.primary}
                progress={1}
              />
              <ParameterCard
                name="Q"
                description="How wide or narrow the band"
                value={animatedQ.toFixed(1)}
                color={eqTheme.frequency.presence}
                progress={qDemoProgress}
              />
            </div>
          </div>
        </div>

        {/* Right: Filter response visualization */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
          <ParametricCurveDemo
            freq={animatedFreq}
            q={animatedQ}
            progress={parametersProgress}
            freqProgress={freqSweepProgress}
            qProgress={qDemoProgress}
          />

          {/* Series implication note */}
          <div
            style={{
              backgroundColor: `${eqTheme.parametricEQ.primary}15`,
              borderRadius: 12,
              border: `1px solid ${eqTheme.parametricEQ.primary}40`,
              padding: 20,
              opacity: parametersProgress,
            }}
          >
            <h4
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: eqTheme.parametricEQ.primary,
                margin: 0,
                marginBottom: 8,
              }}
            >
              Series Routing Implication
            </h4>
            <p
              style={{
                color: eqTheme.text.secondary,
                fontSize: 15,
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Each filter's output becomes the next filter's input. This means filters interact—
              a boost followed by a cut at the same frequency <strong style={{ color: eqTheme.text.primary }}>won't fully cancel</strong>.
              Phase relationships between bands create complex cumulative effects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Series flow diagram
const SeriesFlowDiagram: React.FC<{ progress: number; signalProgress: number }> = ({
  progress,
  signalProgress,
}) => {
  const width = 680;
  const height = 280;
  const centerY = height / 2;

  const filters = [
    { label: "Low Shelf", type: "shelf" },
    { label: "Peak 1", type: "peak" },
    { label: "Peak 2", type: "peak" },
    { label: "Peak 3", type: "peak" },
    { label: "High Shelf", type: "shelf" },
  ];

  const nodeWidth = 90;
  const nodeHeight = 60;
  const spacing = (width - 100) / (filters.length + 1);

  // Animated signal position
  const signalX = interpolate(signalProgress, [0, 1], [30, width - 30]);

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
        <g opacity={progress}>
          <circle cx={40} cy={centerY} r={20} fill={eqTheme.signal.input} />
          <text
            x={40}
            y={centerY + 5}
            textAnchor="middle"
            fill={eqTheme.background.primary}
            fontSize={12}
            fontWeight={600}
          >
            IN
          </text>
        </g>

        {/* Filter chain */}
        {filters.map((filter, i) => {
          const x = 80 + spacing * (i + 0.5);
          const nodeProgress = interpolate(progress, [i * 0.15, i * 0.15 + 0.3], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <g key={i} opacity={nodeProgress}>
              {/* Connection line from previous */}
              <line
                x1={i === 0 ? 60 : 80 + spacing * (i - 0.5) + nodeWidth / 2}
                y1={centerY}
                x2={x - nodeWidth / 2}
                y2={centerY}
                stroke={eqTheme.parametricEQ.secondary}
                strokeWidth={3}
                markerEnd="url(#arrowhead)"
              />

              {/* Filter node */}
              <rect
                x={x - nodeWidth / 2}
                y={centerY - nodeHeight / 2}
                width={nodeWidth}
                height={nodeHeight}
                rx={8}
                fill={filter.type === "shelf" ? eqTheme.parametricEQ.primary : eqTheme.frequency.mid}
                opacity={0.9}
              />
              <text
                x={x}
                y={centerY + 5}
                textAnchor="middle"
                fill={eqTheme.text.primary}
                fontSize={13}
                fontWeight={500}
              >
                {filter.label}
              </text>

              {/* Parameter indicators */}
              <g transform={`translate(${x - 30}, ${centerY + nodeHeight / 2 + 15})`}>
                <circle cx={0} cy={0} r={6} fill={eqTheme.frequency.mid} />
                <circle cx={20} cy={0} r={6} fill={eqTheme.graphicEQ.primary} />
                <circle cx={40} cy={0} r={6} fill={eqTheme.frequency.presence} />
                <text x={20} y={20} textAnchor="middle" fill={eqTheme.text.muted} fontSize={10}>
                  F / G / Q
                </text>
              </g>
            </g>
          );
        })}

        {/* Output */}
        <g opacity={progress}>
          <line
            x1={80 + spacing * (filters.length - 0.5) + nodeWidth / 2}
            y1={centerY}
            x2={width - 60}
            y2={centerY}
            stroke={eqTheme.parametricEQ.secondary}
            strokeWidth={3}
          />
          <circle cx={width - 40} cy={centerY} r={20} fill={eqTheme.signal.output} />
          <text
            x={width - 40}
            y={centerY + 5}
            textAnchor="middle"
            fill={eqTheme.background.primary}
            fontSize={12}
            fontWeight={600}
          >
            OUT
          </text>
        </g>

        {/* Animated signal pulse */}
        {signalProgress > 0 && signalProgress < 1 && (
          <circle
            cx={signalX}
            cy={centerY}
            r={8}
            fill={eqTheme.signal.input}
            opacity={0.8}
          >
            <animate
              attributeName="opacity"
              values="0.8;0.4;0.8"
              dur="0.3s"
              repeatCount="indefinite"
            />
          </circle>
        )}

        {/* Arrow marker definition */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill={eqTheme.parametricEQ.secondary}
            />
          </marker>
        </defs>

        {/* "Cascaded" label */}
        <text
          x={width / 2}
          y={height - 20}
          textAnchor="middle"
          fill={eqTheme.text.muted}
          fontSize={14}
          fontStyle="italic"
          opacity={progress}
        >
          Signal passes through each filter in sequence (cascaded)
        </text>
      </svg>
    </div>
  );
};

// Parameter card component
const ParameterCard: React.FC<{
  name: string;
  description: string;
  value: string;
  color: string;
  progress: number;
}> = ({ name, description, value, color, progress }) => (
  <div
    style={{
      flex: 1,
      backgroundColor: `${color}15`,
      borderRadius: 8,
      padding: 16,
      border: `1px solid ${color}40`,
      opacity: 0.5 + progress * 0.5,
      transform: `scale(${0.95 + progress * 0.05})`,
    }}
  >
    <div
      style={{
        fontSize: 14,
        fontWeight: 600,
        color: color,
        marginBottom: 4,
      }}
    >
      {name}
    </div>
    <div
      style={{
        fontSize: 24,
        fontWeight: 700,
        color: eqTheme.text.primary,
        marginBottom: 8,
      }}
    >
      {value}
    </div>
    <div
      style={{
        fontSize: 12,
        color: eqTheme.text.muted,
        lineHeight: 1.4,
      }}
    >
      {description}
    </div>
  </div>
);

// Parametric curve demo
const ParametricCurveDemo: React.FC<{
  freq: number;
  q: number;
  progress: number;
  freqProgress: number;
  qProgress: number;
}> = ({ freq, q, progress, freqProgress, qProgress }) => {
  const width = 600;
  const height = 300;
  const padding = { left: 50, right: 20, top: 30, bottom: 50 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Generate bell curve at current freq/Q
  const generateBellCurve = (centerFreq: number, qValue: number) => {
    const points: string[] = [];
    const sampleCount = 200;
    const gain = 6; // +6dB boost

    for (let i = 0; i <= sampleCount; i++) {
      const f = 20 * Math.pow(1000, i / sampleCount);
      const octaveDistance = Math.log2(f / centerFreq);
      const bandwidth = 1 / qValue;
      const response = gain * Math.exp(-Math.pow(octaveDistance / bandwidth, 2) * 2);

      const x = padding.left + (Math.log10(f / 20) / Math.log10(1000)) * graphWidth;
      const y = padding.top + graphHeight / 2 - (response / 12) * (graphHeight / 2);

      if (i === 0) {
        points.push(`M ${x} ${y}`);
      } else {
        points.push(`L ${x} ${y}`);
      }
    }

    return points.join(" ");
  };

  const curvePath = generateBellCurve(freq, q);
  const freqX = padding.left + (Math.log10(freq / 20) / Math.log10(1000)) * graphWidth;

  return (
    <div
      style={{
        backgroundColor: eqTheme.card.background,
        borderRadius: 12,
        border: `1px solid ${eqTheme.card.border}`,
        padding: 16,
        opacity: progress,
      }}
    >
      <svg width={width} height={height}>
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
              <text x={padding.left - 8} y={y + 4} textAnchor="end" fill={eqTheme.grid.label} fontSize={12}>
                {db > 0 ? `+${db}` : db}dB
              </text>
            </g>
          );
        })}

        {/* Frequency labels */}
        {[100, 500, 1000, 5000, 10000].map((f) => {
          const x = padding.left + (Math.log10(f / 20) / Math.log10(1000)) * graphWidth;
          return (
            <text key={f} x={x} y={height - 15} textAnchor="middle" fill={eqTheme.grid.label} fontSize={12}>
              {f >= 1000 ? `${f / 1000}k` : f}Hz
            </text>
          );
        })}

        {/* Bell curve */}
        <path
          d={curvePath}
          fill="none"
          stroke={eqTheme.parametricEQ.primary}
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* Glow */}
        <path
          d={curvePath}
          fill="none"
          stroke={eqTheme.parametricEQ.primary}
          strokeWidth={10}
          strokeLinecap="round"
          opacity={0.2}
        />

        {/* Center frequency indicator */}
        <line
          x1={freqX}
          y1={padding.top}
          x2={freqX}
          y2={padding.top + graphHeight}
          stroke={eqTheme.frequency.mid}
          strokeWidth={2}
          strokeDasharray="6,4"
          opacity={0.6}
        />

        {/* Frequency readout */}
        <g transform={`translate(${freqX}, ${padding.top - 10})`}>
          <rect x={-30} y={-18} width={60} height={24} rx={4} fill={eqTheme.frequency.mid} />
          <text x={0} y={0} textAnchor="middle" fill={eqTheme.text.primary} fontSize={14} fontWeight={600}>
            {Math.round(freq)}Hz
          </text>
        </g>

        {/* Q indicator */}
        <text
          x={width - padding.right - 10}
          y={padding.top + 20}
          textAnchor="end"
          fill={eqTheme.frequency.presence}
          fontSize={16}
          fontWeight={600}
        >
          Q = {q.toFixed(1)}
        </text>

        {/* Labels showing what's happening */}
        {freqProgress > 0 && freqProgress < 1 && (
          <text
            x={width / 2}
            y={height - 35}
            textAnchor="middle"
            fill={eqTheme.frequency.mid}
            fontSize={16}
            fontWeight={500}
          >
            Sweeping center frequency...
          </text>
        )}
        {qProgress > 0 && qProgress < 1 && (
          <text
            x={width / 2}
            y={height - 35}
            textAnchor="middle"
            fill={eqTheme.frequency.presence}
            fontSize={16}
            fontWeight={500}
          >
            Adjusting Q (bandwidth)...
          </text>
        )}
      </svg>
    </div>
  );
};
