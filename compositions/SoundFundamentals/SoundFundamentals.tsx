import { AbsoluteFill, Sequence, useCurrentFrame, spring, useVideoConfig, interpolate, Audio, staticFile } from "remotion";
import { EducationalBackground, eduTheme } from "../shared/EducationalBackground";
import { WaveformShapes } from "./WaveformShapes";
import { ClippingDemo } from "./ClippingDemo";
import { DecibelScale } from "./DecibelScale";
import { CompressionRarefaction } from "./CompressionRarefaction";

// Reusable TitleCard component
const TitleCard: React.FC<{ title: string; subtitle: string; topic: string }> = ({
  title,
  subtitle,
  topic,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeProgress = spring({ frame, fps, config: { damping: 15 } });
  const titleProgress = spring({ frame: frame - 15, fps, config: { damping: 12 } });
  const subtitleProgress = spring({ frame: frame - 30, fps, config: { damping: 15 } });
  const lineWidth = interpolate(subtitleProgress, [0, 1], [0, 400]);

  const exitProgress = interpolate(frame, [150, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitY = interpolate(exitProgress, [0, 1], [0, -100]);
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
        transform: `translateY(${exitY}px)`,
        opacity: exitOpacity,
      }}
    >
      <div
        style={{
          backgroundColor: eduTheme.accent.primary,
          color: "#ffffff",
          padding: "12px 32px",
          borderRadius: 50,
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: 2,
          transform: `scale(${badgeProgress})`,
          boxShadow: `0 0 30px ${eduTheme.accent.primary}88`,
        }}
      >
        TOPIC {topic}
      </div>

      <h1
        style={{
          fontSize: 120,
          fontWeight: 900,
          color: eduTheme.text.primary,
          margin: 0,
          letterSpacing: -2,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [50, 0])}px)`,
          opacity: titleProgress,
          textShadow: `0 4px 40px ${eduTheme.accent.primary}50`,
        }}
      >
        {title}
      </h1>

      <p
        style={{
          fontSize: 48,
          fontWeight: 500,
          color: eduTheme.text.secondary,
          margin: 0,
          letterSpacing: 4,
          transform: `translateY(${interpolate(subtitleProgress, [0, 1], [30, 0])}px)`,
          opacity: subtitleProgress,
        }}
      >
        {subtitle}
      </p>

      <div
        style={{
          width: lineWidth,
          height: 4,
          background: `linear-gradient(90deg, transparent, ${eduTheme.accent.primary}, ${eduTheme.accent.secondary}, transparent)`,
          borderRadius: 2,
        }}
      />
    </div>
  );
};

// Outro component
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const summaryProgress = spring({ frame, fps, config: { damping: 15 } });

  const summaryItems = [
    { icon: "~", label: "Waveform Shapes", color: "#0ea5e9" },
    { icon: "!", label: "Digital Clipping", color: "#dc2626" },
    { icon: "dB", label: "Decibel Scale", color: "#22c55e" },
    { icon: "((", label: "Compression & Rarefaction", color: "#f59e0b" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 40,
      }}
    >
      <h2
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: eduTheme.text.primary,
          margin: 0,
          opacity: summaryProgress,
          transform: `translateY(${interpolate(summaryProgress, [0, 1], [30, 0])}px)`,
        }}
      >
        What We Covered
      </h2>

      <div
        style={{
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {summaryItems.map((item, i) => {
          const itemProgress = spring({
            frame: frame - 20 - i * 15,
            fps,
            config: { damping: 15 },
          });

          return (
            <div
              key={item.label}
              style={{
                backgroundColor: eduTheme.card.background,
                borderRadius: 16,
                border: `2px solid ${item.color}`,
                padding: "20px 32px",
                display: "flex",
                alignItems: "center",
                gap: 16,
                opacity: itemProgress,
                transform: `scale(${itemProgress}) translateY(${interpolate(itemProgress, [0, 1], [20, 0])}px)`,
                boxShadow: `0 4px 20px ${item.color}30`,
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: `${item.color}20`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 24,
                  fontWeight: 700,
                  color: item.color,
                }}
              >
                {item.icon}
              </div>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: eduTheme.text.primary,
                }}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 40,
          display: "flex",
          alignItems: "center",
          gap: 16,
          opacity: interpolate(frame, [80, 100], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <span style={{ color: eduTheme.text.secondary, fontSize: 20 }}>
          Built with Remotion + Claude
        </span>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: eduTheme.accent.primary,
          }}
        />
        <span style={{ color: eduTheme.text.secondary, fontSize: 20 }}>
          A-Level Music Technology
        </span>
      </div>
    </div>
  );
};

/*
 * Timeline (~90 seconds at 30fps = ~2700 frames):
 *
 * 0-180 frames (0-6s): Title Card
 * 180-780 frames (6-26s): Waveform Shapes
 * 780-1380 frames (26-46s): Digital Clipping
 * 1380-1980 frames (46-66s): The Decibel Scale
 * 1980-2580 frames (66-86s): Compression & Rarefaction
 * 2580-2700 frames (86-90s): Outro
 */
export const SoundFundamentals: React.FC = () => {
  return (
    <AbsoluteFill>
      <EducationalBackground />

      {/* ElevenLabs Narration - timed to each section */}
      <Sequence from={0}>
        <Audio src={staticFile("audio/sound-fundamentals/sf_01_title.mp3")} />
      </Sequence>
      <Sequence from={180}>
        <Audio src={staticFile("audio/sound-fundamentals/sf_02_waveforms.mp3")} />
      </Sequence>
      <Sequence from={780}>
        <Audio src={staticFile("audio/sound-fundamentals/sf_03_clipping.mp3")} />
      </Sequence>
      <Sequence from={1380}>
        <Audio src={staticFile("audio/sound-fundamentals/sf_04_decibels.mp3")} />
      </Sequence>
      <Sequence from={1980}>
        <Audio src={staticFile("audio/sound-fundamentals/sf_05_compression_rarefaction.mp3")} />
      </Sequence>
      <Sequence from={2580}>
        <Audio src={staticFile("audio/sound-fundamentals/sf_06_outro.mp3")} />
      </Sequence>

      {/* Title Card */}
      <Sequence from={0} durationInFrames={180}>
        <TitleCard
          title="Sound Fundamentals"
          subtitle="A-LEVEL MUSIC TECHNOLOGY"
          topic="2.5"
        />
      </Sequence>

      {/* Section 1: Waveform Shapes */}
      <Sequence from={180} durationInFrames={600}>
        <WaveformShapes />
      </Sequence>

      {/* Section 2: Digital Clipping */}
      <Sequence from={780} durationInFrames={600}>
        <ClippingDemo />
      </Sequence>

      {/* Section 3: The Decibel Scale */}
      <Sequence from={1380} durationInFrames={600}>
        <DecibelScale />
      </Sequence>

      {/* Section 4: Compression & Rarefaction */}
      <Sequence from={1980} durationInFrames={600}>
        <CompressionRarefaction />
      </Sequence>

      {/* Outro */}
      <Sequence from={2580} durationInFrames={120}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
