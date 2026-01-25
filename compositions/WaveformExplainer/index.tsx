import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TitleCard } from "./TitleCard";
import { WaveformBasics } from "./WaveformBasics";
import { FrequencyDemo } from "./FrequencyDemo";
import { OctaveRelationship } from "./OctaveRelationship";
import { EducationalBackground } from "../shared/EducationalBackground";

export const WaveformExplainer: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <EducationalBackground />
      {/* ElevenLabs narration - timed to not overlap */}
      <Sequence from={0}>
        <Audio src={staticFile("waveform_01.mp3")} />
      </Sequence>
      <Sequence from={240}>
        <Audio src={staticFile("waveform_02.mp3")} />
      </Sequence>
      <Sequence from={620}>
        <Audio src={staticFile("waveform_03.mp3")} />
      </Sequence>
      <Sequence from={1010}>
        <Audio src={staticFile("waveform_04.mp3")} />
      </Sequence>

      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* Title: 0-240 */}
        <Sequence from={0} durationInFrames={240}>
          <TitleCard
            title="WAVEFORMS"
            subtitle="Frequency, Period & Octaves"
            topic="2.5"
          />
        </Sequence>

        {/* Waveform basics: 240-620 */}
        <Sequence from={240} durationInFrames={380}>
          <WaveformBasics />
        </Sequence>

        {/* Frequency demo: 620-1010 */}
        <Sequence from={620} durationInFrames={390}>
          <FrequencyDemo />
        </Sequence>

        {/* Octave relationship: 1010-1420 */}
        <Sequence from={1010} durationInFrames={410}>
          <OctaveRelationship />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
