import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { PersonalizedTitle } from "./PersonalizedTitle";
import { ScoreSummary } from "./ScoreSummary";
import { CycleExplainer } from "./CycleExplainer";
import { HearingRangeReview } from "./HearingRangeReview";

// Type for student data passed as props
export interface StudentData {
  name: string;
  q1Score: number;
  q1MaxScore: number;
  q1Answer: string;
  q1Feedback: string;
  q2Score: number;
  q2MaxScore: number;
  q2Answer: string;
  q2Feedback: string;
  hearingRangeLower?: number;
  hearingRangeUpper?: number;
  totalScore?: number;
  maxScore?: number;
  percentage?: number;
  needsCycleReview?: boolean;
  needsHearingReview?: boolean;
}

interface PersonalizedReviewProps {
  studentData?: StudentData;
}

// Default data (Elizabeth) for backwards compatibility
const defaultStudentData: StudentData = {
  name: "Elizabeth",
  q1Score: 1,
  q1MaxScore: 2,
  q1Answer: "the total amount of time it takes a wave form to complete from peak to trough",
  q1Feedback: "Peak to trough is only half - need both halves",
  q2Score: 1,
  q2MaxScore: 3,
  q2Answer: "20 - 200 hz (range of human hearing)",
  q2Feedback: "Correct frequency-pitch link, but range is wrong",
  hearingRangeLower: 20,
  hearingRangeUpper: 200,
};

export const PersonalizedReview: React.FC<PersonalizedReviewProps> = ({ studentData: propData }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Use provided data or fall back to default
  const studentData = propData || defaultStudentData;

  const totalScore = studentData.totalScore ?? (studentData.q1Score + studentData.q2Score);
  const maxScore = studentData.maxScore ?? (studentData.q1MaxScore + studentData.q2MaxScore);
  const percentage = studentData.percentage ?? Math.round((totalScore / maxScore) * 100);

  const needsCycleReview = studentData.needsCycleReview ?? (studentData.q1Score < studentData.q1MaxScore);
  const needsHearingReview = studentData.needsHearingReview ?? (studentData.q2Score < studentData.q2MaxScore);

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const questions = [
    {
      question: "Q1",
      topic: "Define a Cycle",
      score: studentData.q1Score,
      maxScore: studentData.q1MaxScore,
      feedback: studentData.q1Feedback,
      needsReview: needsCycleReview,
    },
    {
      question: "Q2",
      topic: "Frequency, Pitch & Hearing",
      score: studentData.q2Score,
      maxScore: studentData.q2MaxScore,
      feedback: studentData.q2Feedback,
      needsReview: needsHearingReview,
    },
  ];

  // Audio file prefix based on student name (lowercase)
  const audioPrefix = studentData.name.toLowerCase();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a1a",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Audio narration - uses student-specific files */}
      <Sequence from={30}>
        <Audio src={staticFile(`${audioPrefix}_01_title.mp3`)} />
      </Sequence>
      <Sequence from={240}>
        <Audio src={staticFile(`${audioPrefix}_02_summary.mp3`)} />
      </Sequence>
      <Sequence from={630}>
        <Audio src={staticFile(`${audioPrefix}_03_cycle.mp3`)} />
      </Sequence>
      <Sequence from={1230}>
        <Audio src={staticFile(`${audioPrefix}_04_hearing.mp3`)} />
      </Sequence>
      <Sequence from={1800}>
        <Audio src={staticFile(`${audioPrefix}_05_final.mp3`)} />
      </Sequence>

      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* Personalized Title: 0-210 (7 sec) */}
        <Sequence from={0} durationInFrames={210}>
          <PersonalizedTitle
            studentName={studentData.name}
            totalScore={totalScore}
            maxScore={maxScore}
            percentage={percentage}
          />
        </Sequence>

        {/* Score Summary: 210-570 (12 sec) */}
        <Sequence from={210} durationInFrames={360}>
          <ScoreSummary studentName={studentData.name} questions={questions} />
        </Sequence>

        {/* Cycle Explainer: 570-1170 (20 sec) - only if needed */}
        {needsCycleReview && (
          <Sequence from={570} durationInFrames={600}>
            <CycleExplainer studentAnswer={studentData.q1Answer || "(No answer provided)"} />
          </Sequence>
        )}

        {/* Hearing Range Review: 1170-1770 (20 sec) - only if needed */}
        {needsHearingReview && (
          <Sequence from={1170} durationInFrames={600}>
            <HearingRangeReview
              studentAnswer={studentData.q2Answer || "(No answer provided)"}
              studentLower={studentData.hearingRangeLower || 0}
              studentUpper={studentData.hearingRangeUpper || 0}
            />
          </Sequence>
        )}

        {/* Final encouragement card: 1770-2010 (8 sec) */}
        <Sequence from={1770} durationInFrames={240}>
          <FinalCard
            studentName={studentData.name}
            needsCycleReview={needsCycleReview}
            needsHearingReview={needsHearingReview}
          />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Final encouragement card component
interface FinalCardProps {
  studentName: string;
  needsCycleReview: boolean;
  needsHearingReview: boolean;
}

const FinalCard: React.FC<FinalCardProps> = ({ studentName, needsCycleReview, needsHearingReview }) => {
  const frame = useCurrentFrame();

  const cardProgress = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const checkmarkProgress = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 40,
        opacity: cardProgress,
        transform: `scale(${0.8 + cardProgress * 0.2})`,
      }}
    >
      {/* Checkmark circle */}
      <div
        style={{
          width: 150,
          height: 150,
          borderRadius: "50%",
          backgroundColor: "#22c55e",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${checkmarkProgress})`,
          boxShadow: "0 0 60px #22c55e66",
        }}
      >
        <svg width="80" height="80" viewBox="0 0 24 24">
          <path
            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
            fill="white"
            strokeDasharray={100}
            strokeDashoffset={100 - checkmarkProgress * 100}
          />
        </svg>
      </div>

      {/* Message */}
      <h2
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: "#ffffff",
          margin: 0,
          textAlign: "center",
        }}
      >
        Great work, {studentName}!
      </h2>

      <p
        style={{
          fontSize: 32,
          color: "#94a3b8",
          margin: 0,
          textAlign: "center",
          maxWidth: 800,
          lineHeight: 1.5,
        }}
      >
        {needsCycleReview && (
          <>Remember: A cycle is zero → peak → trough → back to zero<br /></>
        )}
        {needsHearingReview && (
          <>Human hearing is <span style={{ color: "#4ade80", fontWeight: 700 }}>20Hz to 20kHz</span></>
        )}
      </p>

      {/* Topic badge */}
      <div
        style={{
          backgroundColor: "#3b82f6",
          color: "#ffffff",
          padding: "12px 32px",
          borderRadius: 50,
          fontSize: 24,
          fontWeight: 600,
          marginTop: 20,
        }}
      >
        Topic 2.5 Waveforms
      </div>
    </div>
  );
};
