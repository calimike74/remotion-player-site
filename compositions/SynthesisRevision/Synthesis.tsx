import { Sequence, Audio, staticFile, useVideoConfig } from "remotion";
import { TitleCard } from "./TitleCard";
import { Waveforms } from "./Waveforms";
import { HarmonicContent } from "./HarmonicContent";
import { ADSREnvelope } from "./ADSREnvelope";
import { FilterSweep } from "./FilterSweep";
import { ExamTip } from "./ExamTip";

// Scene durations synced to voiceover word-level timestamps:
// VO starts at 0.08s, title card plays first 3s with no audio
// Waveforms: 0.08s-29.84s, HarmonicContent: 30.72s-50.86s,
// ADSR: 50.92s-79.02s, Filter: 79.08s-91.86s, ExamTip: 91.90s-104.32s
const SCENES = [
  { duration: 3, Component: TitleCard },       // 0-3s: no voiceover
  { duration: 30, Component: Waveforms },       // 3-33s (VO: 0-30s)
  { duration: 21, Component: HarmonicContent }, // 33-54s (VO: 30-51s)
  { duration: 28, Component: ADSREnvelope },    // 54-82s (VO: 51-79s)
  { duration: 13, Component: FilterSweep },     // 82-95s (VO: 79-92s)
  { duration: 13, Component: ExamTip },         // 95-108s (VO: 92-105s)
];

// 108s total: 3s title + 105s of voiceover-synced scenes
export const TOTAL_DURATION_SECONDS = 108;

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
