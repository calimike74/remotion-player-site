import { Sequence, Audio, staticFile, useVideoConfig } from "remotion";
import { TitleCard } from "./TitleCard";
import { Waveforms } from "./Waveforms";
import { HarmonicContent } from "./HarmonicContent";
import { ADSREnvelope } from "./ADSREnvelope";
import { FilterSweep } from "./FilterSweep";
import { ExamTip } from "./ExamTip";

const SCENES = [
  { duration: 3, Component: TitleCard },
  { duration: 27, Component: Waveforms },
  { duration: 20, Component: HarmonicContent },
  { duration: 27, Component: ADSREnvelope },
  { duration: 14, Component: FilterSweep },
  { duration: 9, Component: ExamTip },
];

// 110s total to accommodate 104s voiceover + 3s title + buffer
export const TOTAL_DURATION_SECONDS = 110;

export const Synthesis: React.FC = () => {
  const { fps } = useVideoConfig();

  let currentFrame = 0;

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#1a1a2e",
        width: "100%",
        height: "100%",
      }}
    >
      {SCENES.map(({ duration, Component }, i) => {
        const from = currentFrame;
        const durationInFrames = duration * fps;
        currentFrame += durationInFrames;

        return (
          <Sequence
            key={i}
            from={from}
            durationInFrames={durationInFrames}
            layout="none"
          >
            <Component />
          </Sequence>
        );
      })}

      {/* Voiceover starts after title card */}
      <Sequence from={3 * fps} layout="none">
        <Audio src={staticFile("audio/synthesis-revision.mp3")} />
      </Sequence>
    </div>
  );
};
