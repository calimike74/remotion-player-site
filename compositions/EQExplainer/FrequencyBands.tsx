import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { eqTheme, graphicEQBands, freqToX, formatFreq } from "./eqTheme";

/**
 * Section 4: Standard Frequency Bands
 * Shows 10/20/30 band comparison with mathematical relationship
 */
export const FrequencyBands: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation progress
  const titleProgress = spring({ frame, fps, config: { damping: 15 } });

  const row1Progress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12, stiffness: 60 },
  });

  const row2Progress = spring({
    frame: frame - 50,
    fps,
    config: { damping: 12, stiffness: 60 },
  });

  const row3Progress = spring({
    frame: frame - 80,
    fps,
    config: { damping: 12, stiffness: 60 },
  });

  const formulaProgress = spring({
    frame: frame - 120,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  // Exit animation (section duration: 640 frames)
  const exitOpacity = interpolate(frame, [600, 640], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const graphWidth = 1400;
  const rowHeight = 80;
  const padding = 180;

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
          marginBottom: 50,
          opacity: titleProgress,
        }}
      >
        Standard Graphic Equalizer Bands
      </h2>

      {/* Band comparisons */}
      <div
        style={{
          backgroundColor: eqTheme.card.background,
          borderRadius: 16,
          border: `1px solid ${eqTheme.card.border}`,
          padding: 40,
          boxShadow: eqTheme.card.shadow,
        }}
      >
        <svg width={graphWidth + padding * 2} height={rowHeight * 3 + 180}>
          {/* Frequency axis at top */}
          <FrequencyAxis width={graphWidth} padding={padding} y={30} />

          {/* 10-band row */}
          <BandRow
            bands={graphicEQBands.octave}
            label="10-Band"
            sublabel="Octave spacing"
            formula="f × 2"
            y={80}
            width={graphWidth}
            padding={padding}
            progress={row1Progress}
            color={eqTheme.graphicEQ.primary}
          />

          {/* 20-band row */}
          <BandRow
            bands={graphicEQBands.halfOctave}
            label="20-Band"
            sublabel="Half-octave spacing"
            formula="f × 2^(1/2)"
            y={160}
            width={graphWidth}
            padding={padding}
            progress={row2Progress}
            color={eqTheme.parametricEQ.primary}
          />

          {/* 30-band row */}
          <BandRow
            bands={graphicEQBands.thirdOctave}
            label="30-Band"
            sublabel="Third-octave spacing"
            formula="f × 2^(1/3)"
            y={240}
            width={graphWidth}
            padding={padding}
            progress={row3Progress}
            color={eqTheme.frequency.presence}
          />
        </svg>

        {/* Mathematical relationship */}
        <div
          style={{
            marginTop: 30,
            padding: 24,
            backgroundColor: eqTheme.background.primary,
            borderRadius: 12,
            border: `1px solid ${eqTheme.graphicEQ.primary}40`,
            opacity: formulaProgress,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 40,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 18,
                  color: eqTheme.text.muted,
                  marginBottom: 8,
                }}
              >
                OCTAVE RELATIONSHIP
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 600,
                  color: eqTheme.text.primary,
                  fontFamily: "serif",
                  fontStyle: "italic",
                }}
              >
                f<sub>n+1</sub> = f<sub>n</sub> × 2<sup>1/n</sup>
              </div>
            </div>

            <div
              style={{
                width: 1,
                height: 60,
                backgroundColor: eqTheme.grid.line,
              }}
            />

            <div style={{ textAlign: "left" }}>
              <div style={{ color: eqTheme.text.secondary, fontSize: 16, lineHeight: 1.8 }}>
                <div><strong style={{ color: eqTheme.graphicEQ.primary }}>n = 1</strong> → Octave bands (10-band)</div>
                <div><strong style={{ color: eqTheme.parametricEQ.primary }}>n = 2</strong> → Half-octave bands (20-band)</div>
                <div><strong style={{ color: eqTheme.frequency.presence }}>n = 3</strong> → Third-octave bands (30-band)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exam tip */}
      <div
        style={{
          marginTop: 30,
          padding: "16px 32px",
          backgroundColor: `${eqTheme.signal.input}20`,
          borderRadius: 8,
          border: `1px solid ${eqTheme.signal.input}40`,
          opacity: formulaProgress,
        }}
      >
        <span style={{ color: eqTheme.signal.input, fontWeight: 600 }}>EXAM TIP: </span>
        <span style={{ color: eqTheme.text.secondary }}>
          Third-octave (30-band) provides ~±2% frequency accuracy—standard for room correction and feedback suppression.
        </span>
      </div>
    </div>
  );
};

// Frequency axis component
const FrequencyAxis: React.FC<{ width: number; padding: number; y: number }> = ({
  width,
  padding,
  y,
}) => {
  const freqLabels = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];

  return (
    <g>
      {/* Axis line */}
      <line
        x1={padding}
        y1={y}
        x2={padding + width}
        y2={y}
        stroke={eqTheme.grid.line}
        strokeWidth={2}
      />

      {/* Frequency labels */}
      {freqLabels.map((freq) => {
        const x = padding + freqToX(freq, width);
        return (
          <g key={freq}>
            <line
              x1={x}
              y1={y - 5}
              x2={x}
              y2={y + 5}
              stroke={eqTheme.grid.line}
              strokeWidth={2}
            />
            <text
              x={x}
              y={y - 15}
              textAnchor="middle"
              fill={eqTheme.text.secondary}
              fontSize={14}
              fontWeight={500}
            >
              {formatFreq(freq)}
            </text>
          </g>
        );
      })}

      {/* Hz label */}
      <text
        x={padding + width + 30}
        y={y + 5}
        fill={eqTheme.text.muted}
        fontSize={14}
      >
        Hz
      </text>
    </g>
  );
};

// Band row component
const BandRow: React.FC<{
  bands: number[];
  label: string;
  sublabel: string;
  formula: string;
  y: number;
  width: number;
  padding: number;
  progress: number;
  color: string;
}> = ({ bands, label, sublabel, formula, y, width, padding, progress, color }) => {
  // Calculate band widths based on octave spacing
  const getBandWidth = (freq: number, index: number, allBands: number[]) => {
    const nextFreq = allBands[index + 1] || freq * 1.26;
    const prevFreq = allBands[index - 1] || freq / 1.26;
    const lowEdge = Math.sqrt(prevFreq * freq);
    const highEdge = Math.sqrt(freq * nextFreq);
    return freqToX(highEdge, width) - freqToX(lowEdge, width);
  };

  return (
    <g opacity={progress}>
      {/* Row background */}
      <rect
        x={padding}
        y={y}
        width={width}
        height={60}
        fill={`${color}10`}
        rx={4}
      />

      {/* Band indicators */}
      {bands.map((freq, i) => {
        const x = padding + freqToX(freq, width);
        const bandWidth = Math.max(4, getBandWidth(freq, i, bands) - 2);

        // Staggered entrance
        const bandProgress = interpolate(
          progress,
          [i / bands.length, (i + 0.5) / bands.length],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <g key={freq} opacity={bandProgress}>
            <rect
              x={x - bandWidth / 2}
              y={y + 10}
              width={bandWidth}
              height={40}
              fill={color}
              rx={2}
              opacity={0.8}
            />
            {/* Show frequency label for wider bands */}
            {bandWidth > 30 && (
              <text
                x={x}
                y={y + 35}
                textAnchor="middle"
                fill={eqTheme.text.primary}
                fontSize={10}
                fontWeight={500}
              >
                {formatFreq(freq)}
              </text>
            )}
          </g>
        );
      })}

      {/* Row label */}
      <text
        x={padding - 20}
        y={y + 30}
        textAnchor="end"
        fill={color}
        fontSize={20}
        fontWeight={600}
      >
        {label}
      </text>
      <text
        x={padding - 20}
        y={y + 50}
        textAnchor="end"
        fill={eqTheme.text.muted}
        fontSize={14}
      >
        {sublabel}
      </text>
    </g>
  );
};
