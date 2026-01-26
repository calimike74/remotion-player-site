import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { eqTheme, graphicEQBands, freqToX, formatFreq, getFreqColor } from "./eqTheme";

/**
 * Section 3: Graphic EQ Architecture
 * Shows parallel filter bank with animated signal flow and interactive sliders
 */
export const GraphicEQArchitecture: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation phases
  const titleProgress = spring({ frame, fps, config: { damping: 15 } });

  const diagramProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12, stiffness: 60 },
  });

  const signalFlowProgress = interpolate(frame, [60, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const slidersProgress = spring({
    frame: frame - 180,
    fps,
    config: { damping: 12, stiffness: 50 },
  });

  const curveProgress = spring({
    frame: frame - 280,
    fps,
    config: { damping: 15, stiffness: 40 },
  });

  // Exit animation (section duration: 510 frames)
  const exitOpacity = interpolate(frame, [470, 510], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Animated slider positions (demonstrating boost/cut)
  const sliderPositions = graphicEQBands.octave.map((freq, i) => {
    const basePhase = frame - 200 - i * 8;
    if (basePhase < 0) return 0;

    // Create interesting EQ curve: bass boost, mid cut, presence boost
    const targetGains = [6, 3, 0, -3, -6, -3, 0, 4, 2, -2]; // dB
    return interpolate(basePhase, [0, 40], [0, targetGains[i]], {
      extrapolateRight: "clamp",
    });
  });

  const bands = graphicEQBands.octave;

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
            backgroundColor: eqTheme.graphicEQ.primary,
            color: eqTheme.text.primary,
            padding: "8px 20px",
            borderRadius: 6,
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          GRAPHIC EQ
        </div>
        <h2
          style={{
            fontSize: 40,
            fontWeight: 600,
            color: eqTheme.text.primary,
            margin: 0,
          }}
        >
          Parallel Filter Bank Architecture
        </h2>
      </div>

      <div style={{ display: "flex", gap: 40, flex: 1 }}>
        {/* Left side: Signal flow diagram */}
        <div
          style={{
            flex: "0 0 500px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <SignalFlowDiagram
            progress={diagramProgress}
            signalProgress={signalFlowProgress}
            bands={bands}
          />

          {/* Key points */}
          <div
            style={{
              backgroundColor: eqTheme.card.background,
              borderRadius: 12,
              border: `1px solid ${eqTheme.card.border}`,
              padding: 20,
              opacity: slidersProgress,
            }}
          >
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: eqTheme.graphicEQ.primary,
                margin: 0,
                marginBottom: 12,
              }}
            >
              Key Characteristics
            </h3>
            <ul
              style={{
                margin: 0,
                padding: 0,
                paddingLeft: 20,
                color: eqTheme.text.secondary,
                fontSize: 16,
                lineHeight: 1.8,
              }}
            >
              <li>Filters routed in <strong style={{ color: eqTheme.text.primary }}>parallel</strong></li>
              <li><strong style={{ color: eqTheme.text.primary }}>Fixed</strong> center frequencies</li>
              <li><strong style={{ color: eqTheme.text.primary }}>Constant Q</strong> per band</li>
              <li>Only <strong style={{ color: eqTheme.text.primary }}>gain</strong> is adjustable</li>
            </ul>
          </div>
        </div>

        {/* Right side: Slider visualization and EQ curve */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
          {/* EQ Curve display */}
          <EQCurveDisplay
            bands={bands}
            gains={sliderPositions}
            progress={curveProgress}
          />

          {/* Slider bank */}
          <SliderBank
            bands={bands}
            gains={sliderPositions}
            progress={slidersProgress}
          />
        </div>
      </div>
    </div>
  );
};

// Signal flow diagram component
const SignalFlowDiagram: React.FC<{
  progress: number;
  signalProgress: number;
  bands: number[];
}> = ({ progress, signalProgress, bands }) => {
  const width = 480;
  const height = 350;

  // Calculate node positions
  const inputX = 40;
  const splitX = 120;
  const filterX = 220;
  const sumX = 360;
  const outputX = 440;
  const centerY = height / 2;

  // Vertical spacing for filter nodes
  const filterCount = 5; // Show 5 representative filters
  const filterSpacing = 50;
  const filterStartY = centerY - ((filterCount - 1) * filterSpacing) / 2;

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
        {/* Input node */}
        <g opacity={progress}>
          <circle cx={inputX} cy={centerY} r={20} fill={eqTheme.signal.input} />
          <text
            x={inputX}
            y={centerY + 5}
            textAnchor="middle"
            fill={eqTheme.background.primary}
            fontSize={12}
            fontWeight={600}
          >
            IN
          </text>
        </g>

        {/* Split point */}
        <g opacity={progress}>
          <circle cx={splitX} cy={centerY} r={8} fill={eqTheme.text.secondary} />
        </g>

        {/* Input to split line */}
        <line
          x1={inputX + 20}
          y1={centerY}
          x2={splitX - 8}
          y2={centerY}
          stroke={eqTheme.signal.input}
          strokeWidth={3}
          opacity={progress}
          strokeDasharray="300"
          strokeDashoffset={300 - signalProgress * 300}
        />

        {/* Filter nodes and connections */}
        {Array.from({ length: filterCount }).map((_, i) => {
          const y = filterStartY + i * filterSpacing;
          const filterLabel = i === 0 ? "31Hz" : i === filterCount - 1 ? "16kHz" : i === 2 ? "..." : `${bands[i * 2]}Hz`;

          return (
            <g key={i} opacity={progress}>
              {/* Split to filter line */}
              <path
                d={`M ${splitX} ${centerY} Q ${splitX + 30} ${centerY} ${splitX + 50} ${(centerY + y) / 2} Q ${splitX + 70} ${y} ${filterX - 30} ${y}`}
                fill="none"
                stroke={eqTheme.graphicEQ.secondary}
                strokeWidth={2}
                opacity={0.6}
                strokeDasharray="200"
                strokeDashoffset={200 - signalProgress * 200}
              />

              {/* Filter node */}
              <rect
                x={filterX - 30}
                y={y - 18}
                width={60}
                height={36}
                rx={6}
                fill={eqTheme.graphicEQ.primary}
                opacity={0.9}
              />
              <text
                x={filterX}
                y={y + 5}
                textAnchor="middle"
                fill={eqTheme.text.primary}
                fontSize={11}
                fontWeight={500}
              >
                {filterLabel}
              </text>

              {/* Filter to sum line */}
              <path
                d={`M ${filterX + 30} ${y} Q ${filterX + 50} ${y} ${filterX + 70} ${(centerY + y) / 2} Q ${filterX + 90} ${centerY} ${sumX - 20} ${centerY}`}
                fill="none"
                stroke={eqTheme.graphicEQ.secondary}
                strokeWidth={2}
                opacity={0.6}
                strokeDasharray="200"
                strokeDashoffset={200 - signalProgress * 200}
              />
            </g>
          );
        })}

        {/* Sum node */}
        <g opacity={progress}>
          <circle cx={sumX} cy={centerY} r={20} fill={eqTheme.parametricEQ.primary} />
          <text
            x={sumX}
            y={centerY + 5}
            textAnchor="middle"
            fill={eqTheme.text.primary}
            fontSize={14}
            fontWeight={600}
          >
            Σ
          </text>
        </g>

        {/* Sum to output line */}
        <line
          x1={sumX + 20}
          y1={centerY}
          x2={outputX - 20}
          y2={centerY}
          stroke={eqTheme.signal.output}
          strokeWidth={3}
          opacity={progress}
          strokeDasharray="100"
          strokeDashoffset={100 - signalProgress * 100}
        />

        {/* Output node */}
        <g opacity={progress}>
          <circle cx={outputX} cy={centerY} r={20} fill={eqTheme.signal.output} />
          <text
            x={outputX}
            y={centerY + 5}
            textAnchor="middle"
            fill={eqTheme.background.primary}
            fontSize={12}
            fontWeight={600}
          >
            OUT
          </text>
        </g>

        {/* Labels */}
        <text
          x={splitX}
          y={height - 20}
          textAnchor="middle"
          fill={eqTheme.text.muted}
          fontSize={12}
        >
          Signal splits
        </text>
        <text
          x={sumX}
          y={height - 20}
          textAnchor="middle"
          fill={eqTheme.text.muted}
          fontSize={12}
        >
          Outputs sum
        </text>
      </svg>
    </div>
  );
};

// Slider bank component
const SliderBank: React.FC<{
  bands: number[];
  gains: number[];
  progress: number;
}> = ({ bands, gains, progress }) => {
  const sliderHeight = 200;
  const sliderWidth = 60;

  return (
    <div
      style={{
        backgroundColor: eqTheme.card.background,
        borderRadius: 12,
        border: `1px solid ${eqTheme.card.border}`,
        padding: 24,
        opacity: progress,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        {bands.map((freq, i) => {
          const gain = gains[i] || 0;
          const knobY = sliderHeight / 2 - (gain / 12) * (sliderHeight / 2);

          return (
            <div
              key={freq}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: sliderWidth,
              }}
            >
              {/* Gain readout */}
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: gain > 0 ? eqTheme.graphicEQ.primary : gain < 0 ? eqTheme.frequency.bass : eqTheme.text.muted,
                  marginBottom: 8,
                  height: 20,
                }}
              >
                {gain > 0 ? `+${gain.toFixed(1)}` : gain.toFixed(1)}dB
              </div>

              {/* Slider track */}
              <div
                style={{
                  position: "relative",
                  width: 8,
                  height: sliderHeight,
                  backgroundColor: eqTheme.background.secondary,
                  borderRadius: 4,
                }}
              >
                {/* Center line */}
                <div
                  style={{
                    position: "absolute",
                    top: sliderHeight / 2 - 1,
                    left: -8,
                    right: -8,
                    height: 2,
                    backgroundColor: eqTheme.grid.line,
                  }}
                />

                {/* Fill from center */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: gain > 0 ? knobY : sliderHeight / 2,
                    height: Math.abs((gain / 12) * (sliderHeight / 2)),
                    backgroundColor: getFreqColor(freq),
                    borderRadius: 4,
                    opacity: 0.6,
                  }}
                />

                {/* Slider knob */}
                <div
                  style={{
                    position: "absolute",
                    left: -10,
                    top: knobY - 8,
                    width: 28,
                    height: 16,
                    backgroundColor: eqTheme.text.primary,
                    borderRadius: 4,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}
                />
              </div>

              {/* Frequency label */}
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: eqTheme.text.secondary,
                  marginTop: 12,
                }}
              >
                {formatFreq(freq)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// EQ Curve display component
const EQCurveDisplay: React.FC<{
  bands: number[];
  gains: number[];
  progress: number;
}> = ({ bands, gains, progress }) => {
  const width = 800;
  const height = 200;
  const padding = { left: 50, right: 20, top: 20, bottom: 40 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Generate curve path from gains
  const generateCurvePath = () => {
    const points: string[] = [];
    const sampleCount = 200;

    for (let i = 0; i <= sampleCount; i++) {
      const freq = 20 * Math.pow(1000, i / sampleCount);
      let totalGain = 0;

      // Sum contribution from each band
      bands.forEach((bandFreq, j) => {
        const gain = gains[j] || 0;
        // Simple bell curve approximation for each band
        const octaveDistance = Math.abs(Math.log2(freq / bandFreq));
        const q = 1.4; // Typical graphic EQ Q
        const contribution = gain * Math.exp(-Math.pow(octaveDistance * q, 2));
        totalGain += contribution;
      });

      const x = padding.left + freqToX(freq, graphWidth);
      const y = padding.top + graphHeight / 2 - (totalGain / 12) * (graphHeight / 2);

      if (i === 0) {
        points.push(`M ${x} ${y}`);
      } else {
        points.push(`L ${x} ${y}`);
      }
    }

    return points.join(" ");
  };

  const curvePath = generateCurvePath();
  const pathLength = 2000; // Approximate path length

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
        {/* Grid lines */}
        {[-12, -6, 0, 6, 12].map((db) => {
          const y = padding.top + graphHeight / 2 - (db / 12) * (graphHeight / 2);
          return (
            <g key={db} opacity={progress * 0.4}>
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
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                fill={eqTheme.grid.label}
                fontSize={12}
              >
                {db > 0 ? `+${db}` : db}
              </text>
            </g>
          );
        })}

        {/* Frequency markers */}
        {[100, 1000, 10000].map((freq) => {
          const x = padding.left + freqToX(freq, graphWidth);
          return (
            <text
              key={freq}
              x={x}
              y={height - 10}
              textAnchor="middle"
              fill={eqTheme.grid.label}
              fontSize={12}
              opacity={progress}
            >
              {freq >= 1000 ? `${freq / 1000}k` : freq}Hz
            </text>
          );
        })}

        {/* EQ curve */}
        <path
          d={curvePath}
          fill="none"
          stroke={eqTheme.graphicEQ.primary}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength * (1 - progress)}
        />

        {/* Glow effect */}
        <path
          d={curvePath}
          fill="none"
          stroke={eqTheme.graphicEQ.primary}
          strokeWidth={8}
          strokeLinecap="round"
          opacity={0.2 * progress}
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength * (1 - progress)}
        />

        {/* Title */}
        <text
          x={padding.left + graphWidth / 2}
          y={padding.top - 5}
          textAnchor="middle"
          fill={eqTheme.text.secondary}
          fontSize={14}
          fontWeight={500}
          opacity={progress}
        >
          Frequency Response Curve
        </text>
      </svg>
    </div>
  );
};
