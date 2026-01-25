import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { eduTheme } from "../shared/EducationalBackground";

export const WaveformDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entry animation
  const entryProgress = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  // Compression animation starts at frame 60
  const compressionProgress = interpolate(frame, [60, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Generate waveform points
  const waveformWidth = 1400;
  const waveformHeight = 300;
  const points = 100;

  // Threshold level (in percentage of max height)
  const threshold = 0.5;
  const ratio = 4; // 4:1 compression

  const generateWaveform = (compressed: boolean) => {
    const path: string[] = [];

    for (let i = 0; i <= points; i++) {
      const x = (i / points) * waveformWidth;

      // Create a dynamic waveform shape
      let amplitude =
        Math.sin(i * 0.15) * 0.3 +
        Math.sin(i * 0.08) * 0.5 +
        Math.sin(i * 0.25) * 0.2;

      // Add some peaks
      if (i > 20 && i < 35) amplitude *= 1.4;
      if (i > 55 && i < 70) amplitude *= 1.6;
      if (i > 80 && i < 90) amplitude *= 1.3;

      // Normalize to 0-1 range
      amplitude = (amplitude + 1) / 2;

      // Apply compression if needed
      if (compressed && amplitude > threshold) {
        const excess = amplitude - threshold;
        const compressedExcess = excess / ratio;
        amplitude = threshold + compressedExcess;
      }

      // Interpolate between original and compressed
      const finalAmplitude = amplitude;
      const y = (1 - finalAmplitude) * waveformHeight;

      if (i === 0) {
        path.push(`M ${x} ${y}`);
      } else {
        path.push(`L ${x} ${y}`);
      }
    }

    return path.join(" ");
  };

  const originalPath = generateWaveform(false);
  const compressedPath = generateWaveform(true);

  // Interpolate between paths for smooth transition
  const thresholdY = (1 - threshold) * waveformHeight;

  // Label animations
  const labelOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const compressedLabelOpacity = interpolate(frame, [80, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit animation
  const exitOpacity = interpolate(frame, [130, 150], [1, 0], {
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
        opacity: exitOpacity,
      }}
    >
      {/* Title */}
      <h2
        style={{
          fontSize: 52,
          fontWeight: 700,
          color: eduTheme.text.primary,
          marginBottom: 40,
          opacity: labelOpacity,
          transform: `translateY(${interpolate(entryProgress, [0, 1], [-30, 0])}px)`,
        }}
      >
        Compression Reduces Dynamic Range
      </h2>

      {/* Waveform card container */}
      <div
        style={{
          position: "relative",
          width: waveformWidth + 60,
          padding: 30,
          backgroundColor: eduTheme.card.background,
          borderRadius: 16,
          border: `1px solid ${eduTheme.card.border}`,
          boxShadow: eduTheme.card.shadow,
          transform: `scale(${entryProgress})`,
        }}
      >
        <div style={{ position: "relative", width: waveformWidth, height: waveformHeight }}>
          {/* Original waveform (fades out) */}
          <svg
            width={waveformWidth}
            height={waveformHeight}
            style={{
              position: "absolute",
              opacity: 1 - compressionProgress * 0.7,
            }}
          >
            <path
              d={originalPath}
              fill="none"
              stroke={eduTheme.accent.primary}
              strokeWidth={4}
              strokeLinecap="round"
            />
          </svg>

          {/* Compressed waveform (fades in) */}
          <svg
            width={waveformWidth}
            height={waveformHeight}
            style={{
              position: "absolute",
              opacity: compressionProgress,
            }}
          >
            <path
              d={compressedPath}
              fill="none"
              stroke="#16a34a"
              strokeWidth={4}
              strokeLinecap="round"
            />
          </svg>

          {/* Threshold line */}
          <div
            style={{
              position: "absolute",
              top: thresholdY,
              left: 0,
              right: 0,
              height: 3,
              background: "#dc2626",
              opacity: interpolate(frame, [40, 55], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          />

          {/* Threshold label */}
          <div
            style={{
              position: "absolute",
              top: thresholdY - 40,
              right: 20,
              color: "#dc2626",
              fontSize: 24,
              fontWeight: 600,
              opacity: interpolate(frame, [45, 60], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            THRESHOLD
          </div>
        </div>
      </div>

      {/* Labels */}
      <div
        style={{
          display: "flex",
          gap: 80,
          marginTop: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: labelOpacity,
          }}
        >
          <div
            style={{
              width: 40,
              height: 6,
              backgroundColor: eduTheme.accent.primary,
              borderRadius: 3,
            }}
          />
          <span style={{ color: eduTheme.text.secondary, fontSize: 24, fontWeight: 500 }}>Original Signal</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: compressedLabelOpacity,
          }}
        >
          <div
            style={{
              width: 40,
              height: 6,
              backgroundColor: "#16a34a",
              borderRadius: 3,
            }}
          />
          <span style={{ color: eduTheme.text.secondary, fontSize: 24, fontWeight: 500 }}>Compressed (4:1)</span>
        </div>
      </div>

      {/* Explanation text */}
      <p
        style={{
          color: eduTheme.text.secondary,
          fontSize: 28,
          marginTop: 32,
          textAlign: "center",
          maxWidth: 1000,
          opacity: compressedLabelOpacity,
        }}
      >
        Signals above the threshold are reduced, making loud parts quieter
      </p>
    </div>
  );
};
