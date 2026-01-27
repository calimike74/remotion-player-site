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
  // Extended for 0.9 speed narration (~11% longer audio)
  const sections = {
    title: { from: 0, duration: 135 },             // 0-4.5s
    problem: { from: 135, duration: 370 },         // 4.5-16.8s
    graphicArch: { from: 505, duration: 570 },     // 16.8-35.8s
    freqBands: { from: 1075, duration: 640 },      // 35.8-57.2s
    parametricArch: { from: 1715, duration: 670 }, // 57.2-79.5s
    qFactor: { from: 2385, duration: 605 },        // 79.5-99.7s
    headToHead: { from: 2990, duration: 670 },     // 99.7-122s
    routing: { from: 3660, duration: 540 },        // 122-140s
    examSummary: { from: 4200, duration: 605 },    // 140-160s
  };

  return (
    <AbsoluteFill
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
      }}
    >
      {/* Dark professional background for EQ content */}
      <EQBackground />

      {/* ElevenLabs narration - timed to match extended sections (0.9 speed) */}
      <Sequence from={0} durationInFrames={135}>
        <Audio src={staticFile("audio/eq-explainer/eq_01_title.mp3")} />
      </Sequence>
      <Sequence from={135} durationInFrames={370}>
        <Audio src={staticFile("audio/eq-explainer/eq_02_problem.mp3")} />
      </Sequence>
      <Sequence from={505} durationInFrames={570}>
        <Audio src={staticFile("audio/eq-explainer/eq_03_graphic.mp3")} />
      </Sequence>
      <Sequence from={1075} durationInFrames={640}>
        <Audio src={staticFile("audio/eq-explainer/eq_04_bands.mp3")} />
      </Sequence>
      <Sequence from={1715} durationInFrames={670}>
        <Audio src={staticFile("audio/eq-explainer/eq_05_parametric.mp3")} />
      </Sequence>
      <Sequence from={2385} durationInFrames={605}>
        <Audio src={staticFile("audio/eq-explainer/eq_06_qfactor.mp3")} />
      </Sequence>
      <Sequence from={2990} durationInFrames={670}>
        <Audio src={staticFile("audio/eq-explainer/eq_07_headtohead.mp3")} />
      </Sequence>
      <Sequence from={3660} durationInFrames={540}>
        <Audio src={staticFile("audio/eq-explainer/eq_08_routing.mp3")} />
      </Sequence>
      <Sequence from={4200} durationInFrames={605}>
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
