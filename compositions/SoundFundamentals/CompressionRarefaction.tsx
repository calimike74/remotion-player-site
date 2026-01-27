import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { eduTheme } from "../shared/EducationalBackground";

export const CompressionRarefaction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation phases
  const titleProgress = spring({ frame, fps, config: { damping: 15 } });
  const containerProgress = spring({ frame: frame - 20, fps, config: { damping: 15 } });
  const labelsProgress = spring({ frame: frame - 100, fps, config: { damping: 15 } });
  const speakerPulse = Math.sin(frame * 0.15) * 0.5 + 0.5;

  // Wave propagation offset
  const waveOffset = frame * 0.04;

  // Generate particle positions
  const particles = [];
  const rows = 6;
  const cols = 30;
  const baseSpacingX = 36;
  const baseSpacingY = 50;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const baseX = 120 + col * baseSpacingX;
      const baseY = 50 + row * baseSpacingY;

      // Calculate displacement based on wave
      const wavePhase = (baseX / 150) - waveOffset;
      const displacement = Math.sin(wavePhase) * 12;

      // Density factor (for coloring)
      const density = Math.sin(wavePhase);

      particles.push({
        x: baseX + displacement,
        y: baseY + (Math.random() - 0.5) * 5,
        density,
        key: `${row}-${col}`,
      });
    }
  }

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
        Compression & Rarefaction
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 32,
          opacity: containerProgress,
          transform: `scale(${containerProgress})`,
        }}
      >
        {/* Main visualization container */}
        <div
          style={{
            position: "relative",
            backgroundColor: eduTheme.card.background,
            borderRadius: 16,
            border: `1px solid ${eduTheme.card.border}`,
            boxShadow: eduTheme.card.shadow,
            padding: 24,
          }}
        >
          <svg width={1200} height={360}>
            {/* Speaker cone */}
            <g transform="translate(20, 130)">
              {/* Speaker body */}
              <rect
                x={0}
                y={10}
                width={40}
                height={80}
                fill="#374151"
                rx={4}
              />
              {/* Cone */}
              <path
                d={`M 40 20 L ${60 + speakerPulse * 15} 0 L ${60 + speakerPulse * 15} 100 L 40 80 Z`}
                fill="#6b7280"
              />
              {/* Cone rings */}
              <ellipse
                cx={60 + speakerPulse * 15}
                cy={50}
                rx={15}
                ry={35}
                fill="none"
                stroke="#9ca3af"
                strokeWidth={2}
              />
              <ellipse
                cx={60 + speakerPulse * 15}
                cy={50}
                rx={8}
                ry={18}
                fill="#4b5563"
              />
              {/* Label */}
              <text
                x={20}
                y={115}
                textAnchor="middle"
                fill={eduTheme.text.secondary}
                fontSize={16}
                fontWeight={600}
              >
                Speaker
              </text>
            </g>

            {/* Air particles */}
            {particles.map((particle) => {
              // Color based on density: blue for compression, lighter for rarefaction
              const colorIntensity = (particle.density + 1) / 2; // 0 to 1
              const size = 6 + colorIntensity * 4;
              const opacity = 0.4 + colorIntensity * 0.6;

              return (
                <circle
                  key={particle.key}
                  cx={particle.x}
                  cy={particle.y + 50}
                  r={size}
                  fill={eduTheme.accent.primary}
                  opacity={opacity}
                />
              );
            })}

            {/* Compression zone indicator */}
            <g
              opacity={labelsProgress}
              transform={`translate(${400 - (waveOffset * 37.5) % 300}, 0)`}
            >
              <rect
                x={0}
                y={20}
                width={100}
                height={320}
                fill="#22c55e"
                opacity={0.15}
                rx={8}
              />
              <text
                x={50}
                y={355}
                textAnchor="middle"
                fill="#22c55e"
                fontSize={20}
                fontWeight={700}
              >
                Compression
              </text>
              <text
                x={50}
                y={375}
                textAnchor="middle"
                fill="#22c55e"
                fontSize={14}
              >
                (High pressure)
              </text>
            </g>

            {/* Rarefaction zone indicator */}
            <g
              opacity={labelsProgress}
              transform={`translate(${550 - (waveOffset * 37.5) % 300}, 0)`}
            >
              <rect
                x={0}
                y={20}
                width={100}
                height={320}
                fill="#f59e0b"
                opacity={0.15}
                rx={8}
              />
              <text
                x={50}
                y={355}
                textAnchor="middle"
                fill="#f59e0b"
                fontSize={20}
                fontWeight={700}
              >
                Rarefaction
              </text>
              <text
                x={50}
                y={375}
                textAnchor="middle"
                fill="#f59e0b"
                fontSize={14}
              >
                (Low pressure)
              </text>
            </g>

            {/* Direction arrow */}
            <g opacity={labelsProgress}>
              <line
                x1={950}
                y1={200}
                x2={1100}
                y2={200}
                stroke={eduTheme.accent.primary}
                strokeWidth={3}
                markerEnd="url(#arrowhead)"
              />
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth={10}
                  markerHeight={7}
                  refX={9}
                  refY={3.5}
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill={eduTheme.accent.primary}
                  />
                </marker>
              </defs>
              <text
                x={1025}
                y={180}
                textAnchor="middle"
                fill={eduTheme.text.secondary}
                fontSize={16}
              >
                Wave direction
              </text>
            </g>
          </svg>
        </div>

        {/* Info cards */}
        <div style={{ display: "flex", gap: 24 }}>
          {/* Compression card */}
          <div
            style={{
              flex: 1,
              backgroundColor: eduTheme.card.background,
              borderRadius: 12,
              border: "2px solid #22c55e",
              padding: 20,
              opacity: labelsProgress,
              transform: `translateY(${interpolate(labelsProgress, [0, 1], [20, 0])}px)`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: "#22c55e20",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <svg width={24} height={24} viewBox="0 0 24 24">
                  <circle cx={8} cy={12} r={4} fill="#22c55e" />
                  <circle cx={16} cy={12} r={4} fill="#22c55e" />
                </svg>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: "#22c55e", margin: 0 }}>
                Compression
              </h3>
            </div>
            <p style={{ fontSize: 18, color: eduTheme.text.secondary, margin: 0 }}>
              Molecules are pushed <strong>closer together</strong>. This creates a region of <strong>high pressure</strong>.
            </p>
          </div>

          {/* Rarefaction card */}
          <div
            style={{
              flex: 1,
              backgroundColor: eduTheme.card.background,
              borderRadius: 12,
              border: "2px solid #f59e0b",
              padding: 20,
              opacity: labelsProgress,
              transform: `translateY(${interpolate(labelsProgress, [0, 1], [20, 0])}px)`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: "#f59e0b20",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <svg width={24} height={24} viewBox="0 0 24 24">
                  <circle cx={6} cy={12} r={3} fill="#f59e0b" />
                  <circle cx={18} cy={12} r={3} fill="#f59e0b" />
                </svg>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: "#f59e0b", margin: 0 }}>
                Rarefaction
              </h3>
            </div>
            <p style={{ fontSize: 18, color: eduTheme.text.secondary, margin: 0 }}>
              Molecules are <strong>spread apart</strong>. This creates a region of <strong>low pressure</strong>.
            </p>
          </div>

          {/* Key Point card */}
          <div
            style={{
              flex: 1,
              backgroundColor: eduTheme.card.background,
              borderRadius: 12,
              border: `2px solid ${eduTheme.accent.primary}`,
              padding: 20,
              opacity: interpolate(frame, [200, 220], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: `${eduTheme.accent.primary}20`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 20,
                }}
              >
                💡
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: eduTheme.accent.primary, margin: 0 }}>
                Key Point
              </h3>
            </div>
            <p style={{ fontSize: 18, color: eduTheme.text.secondary, margin: 0 }}>
              Sound is a <strong>longitudinal wave</strong>. The air molecules vibrate <strong>parallel</strong> to the wave direction, not up and down!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
