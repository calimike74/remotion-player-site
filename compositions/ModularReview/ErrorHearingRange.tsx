import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Addresses: Student gave wrong hearing range
// Duration: 540 frames (18 seconds at 30fps)

export const ErrorHearingRange: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  // Spectrum bar animation
  const spectrumProgress = interpolate(frame, [30, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Marker animations
  const lowerMarkerProgress = interpolate(frame, [200, 250], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const upperMarkerProgress = interpolate(frame, [260, 310], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Labels animation
  const labelProgress = spring({
    frame: frame - 330,
    fps,
    config: { damping: 15 },
  });

  // Key numbers animation
  const keyNumberProgress = spring({
    frame: frame - 400,
    fps,
    config: { damping: 15 },
  });

  // Exit animation - extended to match longer segment duration
  const exitProgress = interpolate(frame, [590, 620], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  // Spectrum dimensions
  const spectrumX = 100;
  const spectrumY = 200;
  const spectrumWidth = 1300;
  const spectrumHeight = 80;

  // Convert frequency to x position (log scale)
  const freqToX = (freq: number) => {
    const minLog = Math.log10(1);
    const maxLog = Math.log10(100000);
    const freqLog = Math.log10(freq);
    return spectrumX + ((freqLog - minLog) / (maxLog - minLog)) * spectrumWidth;
  };

  // Key frequencies
  const lowerLimit = freqToX(20);
  const upperLimit = freqToX(20000);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        padding: 60,
        opacity: exitOpacity,
        backgroundColor: "#0a0a1a",
      }}
    >
      {/* Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginBottom: 30,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [30, 0])}px)`,
          opacity: titleProgress,
        }}
      >
        <div
          style={{
            backgroundColor: "#3b82f6",
            padding: "10px 24px",
            borderRadius: 30,
            fontSize: 22,
            fontWeight: 700,
            color: "#ffffff",
          }}
        >
          KEY FACT
        </div>
        <h2
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
          }}
        >
          Human Hearing Range
        </h2>
      </div>

      {/* Spectrum visualization */}
      <div style={{ position: "relative", height: 350, marginBottom: 20 }}>
        <svg width="1920" height="350" style={{ position: "absolute", top: 0, left: 0 }}>
          {/* Spectrum background bar */}
          <defs>
            <linearGradient id="spectrumGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="25%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#22c55e" />
              <stop offset="75%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Full spectrum bar */}
          <rect
            x={spectrumX}
            y={spectrumY}
            width={spectrumWidth * spectrumProgress}
            height={spectrumHeight}
            fill="url(#spectrumGradient)"
            rx="8"
          />

          {/* Spectrum border */}
          <rect
            x={spectrumX}
            y={spectrumY}
            width={spectrumWidth}
            height={spectrumHeight}
            fill="none"
            stroke="#475569"
            strokeWidth="2"
            rx="8"
          />

          {/* Frequency labels on spectrum */}
          {spectrumProgress >= 1 && (
            <>
              <text x={freqToX(1)} y={spectrumY + spectrumHeight + 30} fontSize="16" fill="#64748b" textAnchor="middle">1 Hz</text>
              <text x={freqToX(100)} y={spectrumY + spectrumHeight + 30} fontSize="16" fill="#64748b" textAnchor="middle">100 Hz</text>
              <text x={freqToX(1000)} y={spectrumY + spectrumHeight + 30} fontSize="16" fill="#64748b" textAnchor="middle">1 kHz</text>
              <text x={freqToX(10000)} y={spectrumY + spectrumHeight + 30} fontSize="16" fill="#64748b" textAnchor="middle">10 kHz</text>
              <text x={freqToX(100000)} y={spectrumY + spectrumHeight + 30} fontSize="16" fill="#64748b" textAnchor="middle">100 kHz</text>
            </>
          )}

          {/* Human hearing range highlight */}
          {lowerMarkerProgress > 0 && upperMarkerProgress > 0 && (
            <rect
              x={lowerLimit}
              y={spectrumY - 10}
              width={(upperLimit - lowerLimit) * upperMarkerProgress}
              height={spectrumHeight + 20}
              fill="none"
              stroke="#22c55e"
              strokeWidth="4"
              rx="8"
            />
          )}

          {/* Lower limit marker (20 Hz) */}
          {lowerMarkerProgress > 0 && (
            <>
              <line
                x1={lowerLimit}
                y1={spectrumY - 30}
                x2={lowerLimit}
                y2={spectrumY + spectrumHeight + 10}
                stroke="#22c55e"
                strokeWidth="3"
                opacity={lowerMarkerProgress}
              />
              <circle cx={lowerLimit} cy={spectrumY - 40} r="8" fill="#22c55e" opacity={lowerMarkerProgress} />
              <text
                x={lowerLimit}
                y={spectrumY - 60}
                fontSize="24"
                fill="#22c55e"
                textAnchor="middle"
                fontWeight="bold"
                opacity={lowerMarkerProgress}
              >
                20 Hz
              </text>
              <text
                x={lowerLimit}
                y={spectrumY - 85}
                fontSize="16"
                fill="#86efac"
                textAnchor="middle"
                opacity={lowerMarkerProgress}
              >
                LOWER LIMIT
              </text>
            </>
          )}

          {/* Upper limit marker (20 kHz) */}
          {upperMarkerProgress > 0 && (
            <>
              <line
                x1={upperLimit}
                y1={spectrumY - 30}
                x2={upperLimit}
                y2={spectrumY + spectrumHeight + 10}
                stroke="#22c55e"
                strokeWidth="3"
                opacity={upperMarkerProgress}
              />
              <circle cx={upperLimit} cy={spectrumY - 40} r="8" fill="#22c55e" opacity={upperMarkerProgress} />
              <text
                x={upperLimit}
                y={spectrumY - 60}
                fontSize="24"
                fill="#22c55e"
                textAnchor="middle"
                fontWeight="bold"
                opacity={upperMarkerProgress}
              >
                20 kHz
              </text>
              <text
                x={upperLimit}
                y={spectrumY - 85}
                fontSize="16"
                fill="#86efac"
                textAnchor="middle"
                opacity={upperMarkerProgress}
              >
                UPPER LIMIT
              </text>
            </>
          )}

          {/* Human hearing label */}
          {labelProgress > 0 && (
            <text
              x={(lowerLimit + upperLimit) / 2}
              y={spectrumY + spectrumHeight / 2 + 8}
              fontSize="28"
              fill="#ffffff"
              textAnchor="middle"
              fontWeight="bold"
              opacity={labelProgress}
            >
              HUMAN HEARING RANGE
            </text>
          )}

          {/* Infrasound and Ultrasound labels */}
          {labelProgress > 0 && (
            <>
              <text
                x={(spectrumX + lowerLimit) / 2}
                y={spectrumY + spectrumHeight / 2 + 8}
                fontSize="18"
                fill="#64748b"
                textAnchor="middle"
                opacity={labelProgress}
              >
                Infrasound
              </text>
              <text
                x={(upperLimit + spectrumX + spectrumWidth) / 2}
                y={spectrumY + spectrumHeight / 2 + 8}
                fontSize="18"
                fill="#64748b"
                textAnchor="middle"
                opacity={labelProgress}
              >
                Ultrasound
              </text>
            </>
          )}
        </svg>
      </div>

      {/* Key numbers to memorise */}
      <div
        style={{
          backgroundColor: "#14532d33",
          border: "2px solid #22c55e",
          borderRadius: 16,
          padding: 30,
          maxWidth: 900,
          transform: `translateY(${interpolate(keyNumberProgress, [0, 1], [30, 0])}px)`,
          opacity: keyNumberProgress,
        }}
      >
        <div style={{ fontSize: 20, color: "#4ade80", fontWeight: 600, marginBottom: 15 }}>
          MEMORISE THIS
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 56, fontWeight: 700, color: "#22c55e" }}>20 Hz</div>
            <div style={{ fontSize: 18, color: "#94a3b8" }}>Lower limit</div>
          </div>
          <div style={{ fontSize: 48, color: "#475569" }}>→</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 56, fontWeight: 700, color: "#22c55e" }}>20 kHz</div>
            <div style={{ fontSize: 18, color: "#94a3b8" }}>Upper limit</div>
          </div>
        </div>
        <div style={{ fontSize: 20, color: "#94a3b8", textAlign: "center", marginTop: 20 }}>
          This appears in almost every exam paper!
        </div>
      </div>
    </div>
  );
};
