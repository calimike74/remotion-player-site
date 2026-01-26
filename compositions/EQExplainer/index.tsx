import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Sequence, staticFile, Audio } from "remotion";
import { TitleCard } from "./TitleCard";
import { ProblemStatement } from "./ProblemStatement";
import { GraphicEQArchitecture } from "./GraphicEQArchitecture";
import { FrequencyBands } from "./FrequencyBands";
import { ParametricEQArchitecture } from "./ParametricEQArchitecture";
import { QFactorDemo } from "./QFactorDemo";
import { HeadToHead } from "./HeadToHead";
import { RoutingComparison } from "./RoutingComparison";
import { ExamSummary } from "./ExamSummary";
import { EQBackground } from "./EQBackground";

/**
 * EQ Explainer: Graphic vs Parametric Equalizers
 *
 * Target: Lower Sixth A-Level Music Technology (Year 12)
 * Level: Extension material for middle-to-high ability
 * Curriculum: Edexcel 1.11 EQ
 *
 * Duration: ~3 minutes (5400 frames at 30fps)
 */
export const EQExplainer: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Global fade out at end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Section timing (in frames at 30fps)
  // Extended to fit audio durations with ~1s buffer each
  const sections = {
    title: { from: 0, duration: 120 },             // 0-4s (audio: 3.4s)
    problem: { from: 120, duration: 330 },         // 4-15s (audio: 9.9s)
    graphicArch: { from: 450, duration: 510 },     // 15-32s (audio: 16.1s)
    freqBands: { from: 960, duration: 570 },       // 32-51s (audio: 18.4s)
    parametricArch: { from: 1530, duration: 600 }, // 51-71s (audio: 19.4s)
    qFactor: { from: 2130, duration: 540 },        // 71-89s (audio: 17.6s)
    headToHead: { from: 2670, duration: 600 },     // 89-109s (audio: 19.0s)
    routing: { from: 3270, duration: 480 },        // 109-125s (audio: 15.2s)
    examSummary: { from: 3750, duration: 540 },    // 125-143s (audio: 17.0s)
  };

  return (
    <AbsoluteFill
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
      }}
    >
      {/* Dark professional background for EQ content */}
      <EQBackground />

      {/* ElevenLabs narration - timed to match extended sections */}
      <Sequence from={0} durationInFrames={120}>
        <Audio src={staticFile("audio/eq-explainer/eq_01_title.mp3")} />
      </Sequence>
      <Sequence from={120} durationInFrames={330}>
        <Audio src={staticFile("audio/eq-explainer/eq_02_problem.mp3")} />
      </Sequence>
      <Sequence from={450} durationInFrames={510}>
        <Audio src={staticFile("audio/eq-explainer/eq_03_graphic.mp3")} />
      </Sequence>
      <Sequence from={960} durationInFrames={570}>
        <Audio src={staticFile("audio/eq-explainer/eq_04_bands.mp3")} />
      </Sequence>
      <Sequence from={1530} durationInFrames={600}>
        <Audio src={staticFile("audio/eq-explainer/eq_05_parametric.mp3")} />
      </Sequence>
      <Sequence from={2130} durationInFrames={540}>
        <Audio src={staticFile("audio/eq-explainer/eq_06_qfactor.mp3")} />
      </Sequence>
      <Sequence from={2670} durationInFrames={600}>
        <Audio src={staticFile("audio/eq-explainer/eq_07_headtohead.mp3")} />
      </Sequence>
      <Sequence from={3270} durationInFrames={480}>
        <Audio src={staticFile("audio/eq-explainer/eq_08_routing.mp3")} />
      </Sequence>
      <Sequence from={3750} durationInFrames={540}>
        <Audio src={staticFile("audio/eq-explainer/eq_09_summary.mp3")} />
      </Sequence>

      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* Section 1: Title Card */}
        <Sequence from={sections.title.from} durationInFrames={sections.title.duration}>
          <TitleCard
            title="EQUALIZATION"
            subtitle="Graphic vs Parametric Architecture"
            topic="1.11"
          />
        </Sequence>

        {/* Section 2: The Problem EQ Solves */}
        <Sequence from={sections.problem.from} durationInFrames={sections.problem.duration}>
          <ProblemStatement />
        </Sequence>

        {/* Section 3: Graphic EQ Architecture */}
        <Sequence from={sections.graphicArch.from} durationInFrames={sections.graphicArch.duration}>
          <GraphicEQArchitecture />
        </Sequence>

        {/* Section 4: Standard Frequency Bands */}
        <Sequence from={sections.freqBands.from} durationInFrames={sections.freqBands.duration}>
          <FrequencyBands />
        </Sequence>

        {/* Section 5: Parametric EQ Architecture */}
        <Sequence from={sections.parametricArch.from} durationInFrames={sections.parametricArch.duration}>
          <ParametricEQArchitecture />
        </Sequence>

        {/* Section 6: Q Factor Deep Dive */}
        <Sequence from={sections.qFactor.from} durationInFrames={sections.qFactor.duration}>
          <QFactorDemo />
        </Sequence>

        {/* Section 7: Head-to-Head Comparison */}
        <Sequence from={sections.headToHead.from} durationInFrames={sections.headToHead.duration}>
          <HeadToHead />
        </Sequence>

        {/* Section 8: Routing Implications (Extension) */}
        <Sequence from={sections.routing.from} durationInFrames={sections.routing.duration}>
          <RoutingComparison />
        </Sequence>

        {/* Section 9: Exam Summary */}
        <Sequence from={sections.examSummary.from} durationInFrames={sections.examSummary.duration}>
          <ExamSummary />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
