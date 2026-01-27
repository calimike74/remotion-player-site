import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { eduTheme } from "../shared/EducationalBackground";

export const ClippingDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation phases
  const titleProgress = spring({ frame, fps, config: { damping: 15 } });
  const waveProgress = spring({ frame: frame - 20, fps, config: { damping: 15 } });
  const amplitudeGrow = interpolate(frame, [60, 200], [0.6, 1.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const clippingLabelProgress = spring({ frame: frame - 150, fps, config: { damping: 15 } });
  const headroomProgress = spring({ frame: frame - 250, fps, config: { damping: 15 } });

  const waveOffset = frame * 0.02;

  // Generate waveform path with optional clipping
  const generateWavePath = (clip: boolean) => {
    const width = 800;
    const height = 300;
    const centerY = height / 2;
    const amplitude = 120 * amplitudeGrow;
    const points: string[] = [];

    for (let x = 0; x <= width; x += 2) {
      const normalizedX = x / width;
      let y = centerY - amplitude * Math.sin(normalizedX * Math.PI * 4 + waveOffset);

      if (clip) {
        // Clip at boundaries
        if (y < 30) y = 30; // +1.0 level
        if (y > 270) y = 270; // -1.0 level
      }

      points.push(x === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
    }
    return points.join(" ");
  };

  // Check if currently clipping
  const isClipping = amplitudeGrow > 1.0;
  const clippingIntensity = Math.max(0, (amplitudeGrow - 1.0) / 0.4);

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
        Digital Clipping
      </h2>

      <div style={{ display: "flex", gap: 60, alignItems: "flex-start" }}>
        {/* Main Waveform Display */}
        <div
          style={{
            position: "relative",
            backgroundColor: eduTheme.card.background,
            borderRadius: 16,
            border: `2px solid ${isClipping ? "#dc2626" : eduTheme.card.border}`,
            boxShadow: isClipping
              ? `0 0 30px rgba(220, 38, 38, ${clippingIntensity * 0.5})`
              : eduTheme.card.shadow,
            padding: 24,
            transform: `scale(${waveProgress})`,
            opacity: waveProgress,
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
        >
          <svg width={800} height={300}>
            {/* Clipping zone indicators */}
            <rect
              x={0}
              y={0}
              width={800}
              height={30}
              fill={`rgba(220, 38, 38, ${clippingIntensity * 0.2})`}
            />
            <rect
              x={0}
              y={270}
              width={800}
              height={30}
              fill={`rgba(220, 38, 38, ${clippingIntensity * 0.2})`}
            />

            {/* Clip boundary lines */}
            <line
              x1={0}
              y1={30}
              x2={800}
              y2={30}
              stroke="#dc2626"
              strokeWidth={2}
              strokeDasharray="10,5"
            />
            <line
              x1={0}
              y1={270}
              x2={800}
              y2={270}
              stroke="#dc2626"
              strokeWidth={2}
              strokeDasharray="10,5"
            />

            {/* Center line */}
            <line
              x1={0}
              y1={150}
              x2={800}
              y2={150}
              stroke={eduTheme.card.border}
              strokeWidth={1}
            />

            {/* The waveform (clipped) */}
            <path
              d={generateWavePath(true)}
              fill="none"
              stroke={isClipping ? "#dc2626" : eduTheme.accent.primary}
              strokeWidth={4}
              strokeLinecap="round"
            />
          </svg>

          {/* Boundary Labels */}
          <div
            style={{
              position: "absolute",
              top: 28,
              left: -60,
              color: "#dc2626",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            +1.0
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 28,
              left: -60,
              color: "#dc2626",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            -1.0
          </div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: -50,
              transform: "translateY(-50%)",
              color: eduTheme.text.secondary,
              fontSize: 18,
            }}
          >
            0
          </div>
        </div>

        {/* Info Panel */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: 400,
          }}
        >
          {/* Amplitude Meter */}
          <div
            style={{
              backgroundColor: eduTheme.card.background,
              borderRadius: 12,
              border: `1px solid ${eduTheme.card.border}`,
              padding: 20,
              opacity: waveProgress,
            }}
          >
            <div
              style={{
                fontSize: 18,
                color: eduTheme.text.secondary,
                marginBottom: 12,
              }}
            >
              Signal Level
            </div>
            <div
              style={{
                height: 24,
                backgroundColor: "#f1f5f9",
                borderRadius: 6,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.min(amplitudeGrow / 1.4, 1) * 100}%`,
                  backgroundColor: isClipping ? "#dc2626" : "#22c55e",
                  transition: "background-color 0.2s",
                }}
              />
              {/* 0dB marker */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: `${(1.0 / 1.4) * 100}%`,
                  width: 2,
                  backgroundColor: "#0f172a",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 8,
                fontSize: 14,
                color: eduTheme.text.secondary,
              }}
            >
              <span>-inf</span>
              <span style={{ fontWeight: 600 }}>0dB</span>
              <span>+3dB</span>
            </div>
          </div>

          {/* Clipping Warning */}
          <div
            style={{
              backgroundColor: isClipping ? "#fef2f2" : "#f0fdf4",
              borderRadius: 12,
              border: `2px solid ${isClipping ? "#dc2626" : "#22c55e"}`,
              padding: 20,
              opacity: clippingLabelProgress,
              transform: `translateY(${interpolate(clippingLabelProgress, [0, 1], [20, 0])}px)`,
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: isClipping ? "#dc2626" : "#22c55e",
                marginBottom: 8,
              }}
            >
              {isClipping ? "CLIPPING!" : "Clean Signal"}
            </div>
            <p
              style={{
                fontSize: 16,
                color: eduTheme.text.secondary,
                margin: 0,
              }}
            >
              {isClipping
                ? "Signal exceeds digital maximum - flat tops cause harsh distortion"
                : "Signal stays within digital range - no distortion"}
            </p>
          </div>

          {/* Headroom Concept */}
          <div
            style={{
              backgroundColor: eduTheme.card.background,
              borderRadius: 12,
              border: `2px solid ${eduTheme.accent.primary}`,
              padding: 20,
              opacity: headroomProgress,
              transform: `translateY(${interpolate(headroomProgress, [0, 1], [20, 0])}px)`,
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: eduTheme.accent.primary,
                marginBottom: 8,
              }}
            >
              Headroom
            </div>
            <p
              style={{
                fontSize: 16,
                color: eduTheme.text.secondary,
                margin: 0,
              }}
            >
              The safety margin between your signal peak and 0dBFS. Professional mixes leave 3-6dB headroom.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Key Point */}
      <div
        style={{
          marginTop: 40,
          padding: "16px 32px",
          backgroundColor: "#fef2f2",
          border: "2px solid #dc2626",
          borderRadius: 12,
          opacity: interpolate(frame, [300, 320], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <span style={{ color: "#dc2626", fontWeight: 700, fontSize: 20 }}>
          Key Point:{" "}
        </span>
        <span style={{ color: eduTheme.text.secondary, fontSize: 20 }}>
          Digital clipping cannot be fixed in post - always record with headroom!
        </span>
      </div>
    </div>
  );
};
