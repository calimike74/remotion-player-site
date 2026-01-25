import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const FrequencyDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({ frame, fps, config: { damping: 15 } });

  // Animated waves
  const waveOffset = frame * 0.1;

  // Generate wave with variable frequency
  const generateWave = (frequency: number, yOffset: number, color: string) => {
    const width = 500;
    const height = 80;
    const centerY = height / 2;
    const amplitude = 30;
    const points: string[] = [];

    for (let x = 0; x <= width; x += 2) {
      const normalizedX = x / width;
      const y = centerY - amplitude * Math.sin((normalizedX * frequency * Math.PI * 2) + waveOffset);
      points.push(x === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
    }

    return (
      <svg width={width} height={height}>
        <line x1={0} y1={centerY} x2={width} y2={centerY} stroke="#334155" strokeWidth={1} />
        <path d={points.join(" ")} fill="none" stroke={color} strokeWidth={3} />
      </svg>
    );
  };

  // Different frequencies to show
  const frequencies = [
    { hz: 110, cycles: 1, color: "#ef4444", note: "A2" },
    { hz: 220, cycles: 2, color: "#f59e0b", note: "A3" },
    { hz: 440, cycles: 4, color: "#22c55e", note: "A4" },
    { hz: 880, cycles: 8, color: "#3b82f6", note: "A5" },
  ];

  // Staggered entry for each frequency row
  const getRowProgress = (index: number) => {
    return spring({
      frame: frame - 20 - index * 25,
      fps,
      config: { damping: 15 },
    });
  };

  // Reference frequency highlight
  const highlightProgress = interpolate(frame, [150, 170], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit
  const exitOpacity = interpolate(frame, [320, 340], [1, 0], {
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
      <h2
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: "#ffffff",
          marginBottom: 50,
          opacity: entryProgress,
        }}
      >
        Frequency = Cycles per Second (Hz)
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
        {frequencies.map((f, index) => {
          const rowProgress = getRowProgress(index);
          const isReference = f.hz === 440;

          return (
            <div
              key={f.hz}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 40,
                opacity: rowProgress,
                transform: `translateX(${interpolate(rowProgress, [0, 1], [-50, 0])}px)`,
                backgroundColor: isReference ? `${f.color}22` : "transparent",
                padding: "15px 30px",
                borderRadius: 12,
                border: isReference ? `2px solid ${f.color}` : "2px solid transparent",
              }}
            >
              {/* Note name */}
              <div
                style={{
                  width: 80,
                  fontSize: 36,
                  fontWeight: 800,
                  color: f.color,
                }}
              >
                {f.note}
              </div>

              {/* Frequency value */}
              <div
                style={{
                  width: 140,
                  fontSize: 32,
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                {f.hz} Hz
              </div>

              {/* Waveform visualization */}
              {generateWave(f.cycles, 0, f.color)}

              {/* Cycles count */}
              <div
                style={{
                  width: 150,
                  fontSize: 24,
                  color: "#94a3b8",
                }}
              >
                {f.cycles} cycle{f.cycles > 1 ? "s" : ""}/window
              </div>

              {/* Reference label */}
              {isReference && (
                <div
                  style={{
                    fontSize: 20,
                    color: f.color,
                    fontWeight: 600,
                    opacity: highlightProgress,
                  }}
                >
                  ← CONCERT PITCH
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Key insight */}
      <div
        style={{
          marginTop: 50,
          padding: "20px 40px",
          backgroundColor: "#1e293b",
          borderRadius: 12,
          opacity: interpolate(frame, [200, 220], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <span style={{ color: "#94a3b8", fontSize: 28 }}>
          Higher frequency = More cycles = Higher pitch
        </span>
      </div>
    </div>
  );
};
