import { Composition } from "remotion";
import { DynamicProcessingRevision } from "../compositions/DynamicProcessingRevision";
import { SynthesisRevision } from "../compositions/SynthesisRevision";
import { WaveformExplainer } from "../compositions/WaveformExplainer";
import { WaveformExamTips } from "../compositions/WaveformExamTips";
import { EQExplainer } from "../compositions/EQExplainer";
import { ReverbVisualizer } from "../compositions/ReverbVisualizer";
import { StartupPitch } from "../compositions/StartupPitch";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Educational videos */}
      <Composition
        id="SynthesisRevision"
        component={SynthesisRevision}
        durationInFrames={3240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DynamicProcessingRevision"
        component={DynamicProcessingRevision}
        durationInFrames={2700}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="WaveformExplainer"
        component={WaveformExplainer}
        durationInFrames={1450}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="WaveformExamTips"
        component={WaveformExamTips}
        durationInFrames={3150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="EQExplainer"
        component={EQExplainer}
        durationInFrames={4805}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ReverbVisualizer"
        component={ReverbVisualizer}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="StartupPitch"
        component={StartupPitch}
        durationInFrames={1260}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
