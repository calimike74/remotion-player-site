import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TitleCard } from "./TitleCard";
import { CalculationDemo } from "./CalculationDemo";
import { PitchAmplitude } from "./PitchAmplitude";
import { AxisLabels } from "./AxisLabels";
import { EducationalBackground } from "../shared/EducationalBackground";

export const WaveformExamTips: React.FC = () => {
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
        <Audio src={staticFile("examtips_01.mp3")} />
      </Sequence>
      <Sequence from={540}>
        <Audio src={staticFile("examtips_02.mp3")} />
      </Sequence>
      <Sequence from={1620}>
        <Audio src={staticFile("examtips_03.mp3")} />
      </Sequence>
      <Sequence from={2530}>
        <Audio src={staticFile("examtips_04.mp3")} />
      </Sequence>

      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* Title with stats: 0-540 */}
        <Sequence from={0} durationInFrames={540}>
          <TitleCard
            title="EXAM TIPS"
            subtitle="Common Waveform Mistakes"
            topic="2.5"
          />
        </Sequence>

        {/* Mistake 1: Show Your Working (calculation) 540-1620 */}
        <Sequence from={540} durationInFrames={1080}>
          <CalculationDemo />
        </Sequence>

        {/* Mistake 2: Pitch vs Amplitude 1620-2530 */}
        <Sequence from={1620} durationInFrames={910}>
          <PitchAmplitude />
        </Sequence>

        {/* Mistake 3: Axis Labels 2530-3120 */}
        <Sequence from={2530} durationInFrames={590}>
          <AxisLabels />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
