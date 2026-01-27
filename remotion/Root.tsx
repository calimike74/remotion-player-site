import { Composition } from "remotion";
import { CompressionExplainer } from "../compositions/CompressionExplainer";
import { WaveformExplainer } from "../compositions/WaveformExplainer";
import { WaveformExamTips } from "../compositions/WaveformExamTips";
import { EQExplainer } from "../compositions/EQExplainer";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Educational videos */}
      <Composition
        id="CompressionExplainer"
        component={CompressionExplainer}
        durationInFrames={1500}
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
    </>
  );
};
