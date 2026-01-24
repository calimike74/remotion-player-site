import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface HearingRangeReviewProps {
  studentAnswer: string;
  studentLower: number;
  studentUpper: number;
}

export const HearingRangeReview: React.FC<HearingRangeReviewProps> = ({
  studentAnswer,
  studentLower,
  studentUpper,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  // Student answer animation
  const studentProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 15 },
  });

  // Spectrum bar animation
  const spectrumProgress = interpolate(frame, [100, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Student range highlight
  const studentRangeProgress = interpolate(frame, [220, 280], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Correct range highlight
  const correctRangeProgress = interpolate(frame, [300, 380], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Memorize box
  const memorizeProgress = spring({
    frame: frame - 400,
    fps,
    config: { damping: 15 },
  });

  // Exit animation - starts at frame 560, completes by 600
  const exitProgress = interpolate(frame, [560, 590], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  // Frequency to position on spectrum (log scale)
  const freqToX = (freq: number) => {
    const minFreq = 1;
    const maxFreq = 100000;
    const logMin = Math.log10(minFreq);
    const logMax = Math.log10(maxFreq);
    const logFreq = Math.log10(freq);
    const normalized = (logFreq - logMin) / (logMax - logMin);
    return 200 + normalized * 1520;
  };

  const frequencies = [1, 10, 20, 100, 1000, 10000, 20000, 100000];
  const labels = ["1Hz", "10Hz", "20Hz", "100Hz", "1kHz", "10kHz", "20kHz", "100kHz"];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        padding: 80,
        opacity: exitOpacity,
      }}
    >
      {/* Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginBottom: 40,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [30, 0])}px)`,
          opacity: titleProgress,
        }}
      >
        <div
          style={{
            backgroundColor: "#f97316",
            padding: "10px 24px",
            borderRadius: 30,
            fontSize: 24,
            fontWeight: 700,
            color: "#ffffff",
          }}
        >
          REVIEW AREA 2
        </div>
        <h2
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
          }}
        >
          Human Hearing Range
        </h2>
      </div>

      {/* Your answer box */}
      <div
        style={{
          backgroundColor: "#7c2d1233",
          border: "2px solid #f97316",
          borderRadius: 16,
          padding: 30,
          marginBottom: 50,
          maxWidth: 700,
          transform: `translateX(${interpolate(studentProgress, [0, 1], [-50, 0])}px)`,
          opacity: studentProgress,
        }}
      >
        <div
          style={{
            fontSize: 20,
            color: "#fb923c",
            fontWeight: 600,
            marginBottom: 10,
          }}
        >
          YOUR ANSWER
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#fcd34d",
            fontStyle: "italic",
          }}
        >
          "{studentAnswer}"
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#f87171",
            marginTop: 12,
          }}
        >
          Upper limit off by factor of 100!
        </div>
      </div>

      {/* Frequency spectrum visualization */}
      <div
        style={{
          position: "relative",
          height: 300,
          marginBottom: 40,
        }}
      >
        <svg width="1920" height="300" style={{ position: "absolute", top: 0, left: 0 }}>
          {/* Background spectrum bar */}
          <rect
            x="200"
            y="100"
            width={1520 * spectrumProgress}
            height="60"
            fill="#334155"
            rx="8"
          />

          {/* Student's range (wrong) */}
          {studentRangeProgress > 0 && (
            <>
              <rect
                x={freqToX(studentLower)}
                y="100"
                width={(freqToX(studentUpper) - freqToX(studentLower)) * studentRangeProgress}
                height="60"
                fill="#f9731666"
                rx="8"
              />
              <text
                x={(freqToX(studentLower) + freqToX(studentUpper)) / 2}
                y="85"
                fontSize="24"
                fill="#fb923c"
                textAnchor="middle"
                opacity={studentRangeProgress}
              >
                Your answer: {studentLower}-{studentUpper}Hz
              </text>
            </>
          )}

          {/* Correct range */}
          {correctRangeProgress > 0 && (
            <>
              <rect
                x={freqToX(20)}
                y="100"
                width={(freqToX(20000) - freqToX(20)) * correctRangeProgress}
                height="60"
                fill="#22c55e88"
                rx="8"
                stroke="#22c55e"
                strokeWidth="3"
              />
              <text
                x={(freqToX(20) + freqToX(20000)) / 2}
                y="200"
                fontSize="28"
                fill="#4ade80"
                textAnchor="middle"
                fontWeight="bold"
                opacity={correctRangeProgress}
              >
                CORRECT: 20Hz to 20kHz
              </text>
            </>
          )}

          {/* Frequency markers */}
          {frequencies.map((freq, i) => {
            const x = freqToX(freq);
            const isCorrectBoundary = freq === 20 || freq === 20000;
            return (
              <g key={freq} opacity={spectrumProgress}>
                <line
                  x1={x}
                  y1="160"
                  x2={x}
                  y2="180"
                  stroke={isCorrectBoundary ? "#22c55e" : "#64748b"}
                  strokeWidth={isCorrectBoundary ? 3 : 1}
                />
                <text
                  x={x}
                  y="210"
                  fontSize={isCorrectBoundary ? 24 : 18}
                  fill={isCorrectBoundary ? "#22c55e" : "#64748b"}
                  textAnchor="middle"
                  fontWeight={isCorrectBoundary ? "bold" : "normal"}
                >
                  {labels[i]}
                </text>
              </g>
            );
          })}

          {/* Infrasound and Ultrasound labels */}
          <text x="120" y="135" fontSize="20" fill="#64748b" opacity={spectrumProgress}>
            Infrasound
          </text>
          <text x="1750" y="135" fontSize="20" fill="#64748b" textAnchor="end" opacity={spectrumProgress}>
            Ultrasound
          </text>
        </svg>
      </div>

      {/* Memorize box */}
      <div
        style={{
          backgroundColor: "#14532d33",
          border: "3px solid #22c55e",
          borderRadius: 16,
          padding: 40,
          maxWidth: 800,
          alignSelf: "center",
          textAlign: "center",
          transform: `scale(${memorizeProgress})`,
          boxShadow: "0 0 40px #22c55e44",
        }}
      >
        <div
          style={{
            fontSize: 24,
            color: "#4ade80",
            fontWeight: 600,
            marginBottom: 16,
            letterSpacing: 2,
          }}
        >
          MEMORISE THIS
        </div>
        <div
          style={{
            fontSize: 64,
            color: "#ffffff",
            fontWeight: 900,
          }}
        >
          20Hz – 20kHz
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#94a3b8",
            marginTop: 16,
          }}
        >
          Human hearing range • Always appears in exams
        </div>
      </div>
    </div>
  );
};
