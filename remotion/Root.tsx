import { Composition } from "remotion";
import { DemoShowcase } from "../compositions/DemoShowcase";
import { DemoShowcase2D } from "../compositions/DemoShowcase2D";
import { LogoReveal } from "../compositions/LogoReveal";
import { ImageDemo } from "../compositions/ImageDemo";
import { ImageDemo3D } from "../compositions/ImageDemo3D";
import { CompressionExplainer } from "../compositions/CompressionExplainer";
import { WaveformExplainer } from "../compositions/WaveformExplainer";
import { WaveformExamTips } from "../compositions/WaveformExamTips";
import { EQExplainer } from "../compositions/EQExplainer";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Demo videos for YouTube */}
      <Composition
        id="DemoShowcase"
        component={DemoShowcase}
        durationInFrames={2000}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DemoShowcase2D"
        component={DemoShowcase2D}
        durationInFrames={2000}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LogoReveal"
        component={LogoReveal}
        durationInFrames={480}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ImageDemo"
        component={ImageDemo}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ImageDemo3D"
        component={ImageDemo3D}
        durationInFrames={800}
        fps={30}
        width={1920}
        height={1080}
      />

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
        durationInFrames={4290}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
