import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TitleCard } from "./TitleCard";
import { WaveformDemo } from "./WaveformDemo";
import { CompressionGraph } from "./CompressionGraph";
import { ParameterExplainer } from "./ParameterExplainer";

export const CompressionExplainer: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Fade out at end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a1a",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ElevenLabs narration - timed to not overlap */}
      {/* Section 1: 0-126 frames */}
      <Sequence from={0}>
        <Audio src={staticFile("narration_01.mp3")} />
      </Sequence>
      {/* Section 2: 140-443 frames */}
      <Sequence from={140}>
        <Audio src={staticFile("narration_02.mp3")} />
      </Sequence>
      {/* Section 3: 460-906 frames */}
      <Sequence from={460}>
        <Audio src={staticFile("narration_03.mp3")} />
      </Sequence>
      {/* Section 4: 920-1450 frames */}
      <Sequence from={920}>
        <Audio src={staticFile("narration_04.mp3")} />
      </Sequence>

      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* Title sequence: 0-140 frames */}
        <Sequence from={0} durationInFrames={140}>
          <TitleCard
            title="DYNAMIC PROCESSING"
            subtitle="Understanding Compression"
            topic="1.9"
          />
        </Sequence>

        {/* Waveform demo: 140-460 frames */}
        <Sequence from={140} durationInFrames={320}>
          <WaveformDemo />
        </Sequence>

        {/* Compression graph: 460-920 frames */}
        <Sequence from={460} durationInFrames={460}>
          <CompressionGraph />
        </Sequence>

        {/* Key parameters: 920-1480 frames */}
        <Sequence from={920} durationInFrames={560}>
          <ParameterExplainer />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
