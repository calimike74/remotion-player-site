import { Sequence, Audio, staticFile, useVideoConfig } from "remotion";
import { TitleCard } from "./TitleCard";
import { WhatIsCompression } from "./WhatIsCompression";
import { IOGraph } from "./IOGraph";
import { RatioExamples } from "./RatioExamples";
import { AttackRelease } from "./AttackRelease";
import { ExamTip } from "./ExamTip";

// Scene durations scaled to match 85.5s voiceover
// VO starts after 3s title. Script VO sections totalled ~65s but actual speech is ~85.5s
// Each VO scene scaled by ~1.31x to fill the audio naturally
const SCENES = [
  { duration: 3, Component: TitleCard },          // 0-3s: no voiceover
  { duration: 16, Component: WhatIsCompression },  // 3-19s
  { duration: 24, Component: IOGraph },            // 19-43s
  { duration: 16, Component: RatioExamples },      // 43-59s
  { duration: 20, Component: AttackRelease },      // 59-79s
  { duration: 11, Component: ExamTip },            // 79-90s
];

// 90s total to accommodate 85.5s voiceover + 3s title + buffer
export const TOTAL_DURATION_SECONDS = 90;

export const DynamicProcessing: React.FC = () => {
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
        <Audio src={staticFile("audio/dynamic-processing-revision.mp3")} />
      </Sequence>
    </div>
  );
};
