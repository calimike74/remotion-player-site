import { interpolate, spring, useCurrentFrame, useVideoConfig, Sequence, Audio, staticFile } from "remotion";
import { eduTheme } from "../shared/EducationalBackground";

interface WaveformCardProps {
  name: string;
  color: string;
  generatePath: (offset: number) => string;
  harmonics: string;
  delay: number;
}

const WaveformCard: React.FC<WaveformCardProps> = ({
  name,
  color,
  generatePath,
  harmonics,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15 },
  });

  const waveOffset = frame * 0.03;
  const path = generatePath(waveOffset);

  return (
    <div
      style={{
        backgroundColor: eduTheme.card.background,
        borderRadius: 16,
        border: `2px solid ${eduTheme.card.border}`,
        boxShadow: eduTheme.card.shadow,
        padding: 24,
        transform: `scale(${entryProgress}) translateY(${interpolate(entryProgress, [0, 1], [20, 0])}px)`,
        opacity: entryProgress,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            backgroundColor: color,
          }}
        />
        <h3
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: eduTheme.text.primary,
            margin: 0,
          }}
        >
          {name}
        </h3>
      </div>

      <svg width={360} height={120} style={{ display: "block" }}>
        {/* Center line */}
        <line
          x1={0}
          y1={60}
          x2={360}
          y2={60}
          stroke={eduTheme.card.border}
          strokeWidth={1}
        />
        {/* Waveform */}
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div
        style={{
          marginTop: 12,
          padding: "8px 12px",
          backgroundColor: `${color}15`,
          borderRadius: 8,
          fontSize: 18,
          color: eduTheme.text.secondary,
        }}
      >
        <span style={{ color, fontWeight: 600 }}>Harmonics: </span>
        {harmonics}
      </div>
    </div>
  );
};

export const WaveformShapes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 15 } });

  // Waveform generators
  const generateSinePath = (offset: number) => {
    const points: string[] = [];
    for (let x = 0; x <= 360; x += 2) {
      const normalizedX = x / 360;
      const y = 60 - 45 * Math.sin(normalizedX * Math.PI * 4 + offset);
      points.push(x === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
    }
    return points.join(" ");
  };

  const generateSquarePath = (offset: number) => {
    const points: string[] = [];
    const period = 90;
    for (let x = 0; x <= 360; x++) {
      const phase = ((x + offset * 30) % period) / period;
      const y = phase < 0.5 ? 15 : 105;
      points.push(x === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
    }
    return points.join(" ");
  };

  const generateSawtoothPath = (offset: number) => {
    const points: string[] = [];
    const period = 90;
    for (let x = 0; x <= 360; x++) {
      const phase = ((x + offset * 30) % period) / period;
      const y = 15 + phase * 90;
      points.push(x === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
    }
    return points.join(" ");
  };

  const generateTrianglePath = (offset: number) => {
    const points: string[] = [];
    const period = 90;
    for (let x = 0; x <= 360; x++) {
      const phase = ((x + offset * 30) % period) / period;
      const y = phase < 0.5 ? 15 + phase * 180 : 105 - (phase - 0.5) * 180;
      points.push(x === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
    }
    return points.join(" ");
  };

  // Exit animation
  const exitOpacity = interpolate(frame, [580, 600], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      {/* Educational waveform tones - play each as its card appears */}
      {/* Staggered to demonstrate what each waveform sounds like */}
      <Sequence from={120} durationInFrames={90}>
        <Audio src={staticFile("audio/sound-fundamentals/tone_sine.wav")} volume={0.15} />
      </Sequence>
      <Sequence from={220} durationInFrames={90}>
        <Audio src={staticFile("audio/sound-fundamentals/tone_square.wav")} volume={0.12} />
      </Sequence>
      <Sequence from={320} durationInFrames={90}>
        <Audio src={staticFile("audio/sound-fundamentals/tone_sawtooth.wav")} volume={0.12} />
      </Sequence>
      <Sequence from={420} durationInFrames={90}>
        <Audio src={staticFile("audio/sound-fundamentals/tone_triangle.wav")} volume={0.15} />
      </Sequence>

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
          marginBottom: 48,
          opacity: titleProgress,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [30, 0])}px)`,
        }}
      >
        Four Basic Waveform Shapes
      </h2>

      {/* 2x2 Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
          maxWidth: 900,
        }}
      >
        <WaveformCard
          name="Sine Wave"
          color="#0ea5e9"
          generatePath={generateSinePath}
          harmonics="Fundamental only"
          delay={20}
        />
        <WaveformCard
          name="Square Wave"
          color="#f59e0b"
          generatePath={generateSquarePath}
          harmonics="Odd harmonics (1, 3, 5...)"
          delay={35}
        />
        <WaveformCard
          name="Sawtooth Wave"
          color="#22c55e"
          generatePath={generateSawtoothPath}
          harmonics="All harmonics (1, 2, 3...)"
          delay={50}
        />
        <WaveformCard
          name="Triangle Wave"
          color="#a855f7"
          generatePath={generateTrianglePath}
          harmonics="Odd harmonics (weaker)"
          delay={65}
        />
      </div>

      {/* Exam Tip */}
      <div
        style={{
          marginTop: 48,
          padding: "16px 32px",
          backgroundColor: eduTheme.card.background,
          border: `2px solid ${eduTheme.accent.primary}`,
          borderRadius: 12,
          opacity: interpolate(frame, [100, 120], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <span style={{ color: eduTheme.accent.primary, fontWeight: 700, fontSize: 20 }}>
          Exam Tip:{" "}
        </span>
        <span style={{ color: eduTheme.text.secondary, fontSize: 20 }}>
          Sine = pure tone, Square = hollow/clarinet, Saw = bright/brass, Triangle = mellow/flute
        </span>
      </div>
    </div>
    </>
  );
};
