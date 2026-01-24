import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { ErrorType, errorSegments, getStudentErrors, calculateVideoDuration } from "../../lib/error-segments";
import { ModularIntro } from "./ModularIntro";
import { ModularOutro } from "./ModularOutro";
import { ErrorCycleHalf } from "./ErrorCycleHalf";
import { ErrorCycleVague } from "./ErrorCycleVague";
import { ErrorCycleFrequency } from "./ErrorCycleFrequency";
import { ErrorPitchLoudness } from "./ErrorPitchLoudness";
import { ErrorHearingRange } from "./ErrorHearingRange";

// Student data interface
export interface ModularStudentData {
  name: string;
  q1Score: number;
  q1MaxScore: number;
  q1Answer: string;
  q2Score: number;
  q2MaxScore: number;
  q2Answer: string;
  totalScore?: number;
  maxScore?: number;
  percentage?: number;
}

interface ModularReviewProps {
  studentData?: ModularStudentData;
}

// Default data for preview
const defaultStudentData: ModularStudentData = {
  name: "Student",
  q1Score: 0,
  q1MaxScore: 2,
  q1Answer: "peak to trough",
  q2Score: 0,
  q2MaxScore: 3,
  q2Answer: "pitch is loudness, 20-200Hz",
};

// Map error type to component
const ErrorComponents: Record<ErrorType, React.FC> = {
  'cycle-half': ErrorCycleHalf,
  'cycle-vague': ErrorCycleVague,
  'cycle-frequency': ErrorCycleFrequency,
  'pitch-loudness': ErrorPitchLoudness,
  'hearing-range': ErrorHearingRange,
};

export const ModularReview: React.FC<ModularReviewProps> = ({ studentData: propData }) => {
  // Use provided data or fall back to default
  const studentData = propData || defaultStudentData;

  // Calculate scores
  const totalScore = studentData.totalScore ?? (studentData.q1Score + studentData.q2Score);
  const maxScore = studentData.maxScore ?? (studentData.q1MaxScore + studentData.q2MaxScore);
  const percentage = studentData.percentage ?? Math.round((totalScore / maxScore) * 100);

  // Get errors based on student answers
  const errors = getStudentErrors({
    q1Score: studentData.q1Score,
    q1MaxScore: studentData.q1MaxScore,
    q1Answer: studentData.q1Answer,
    q2Score: studentData.q2Score,
    q2MaxScore: studentData.q2MaxScore,
    q2Answer: studentData.q2Answer,
  });

  // Timing constants - includes buffer to prevent audio overlap
  const INTRO_DURATION = 330;  // 11 sec (10 sec content + 1 sec buffer)
  const SEGMENT_DURATION = 630; // 21 sec per error segment (18 sec content + 3 sec buffer)
  const OUTRO_DURATION = 270;  // 9 sec

  // Calculate segment start times
  let currentFrame = INTRO_DURATION;
  const segmentTiming: { error: ErrorType; start: number }[] = [];

  errors.forEach((error) => {
    segmentTiming.push({ error, start: currentFrame });
    currentFrame += SEGMENT_DURATION;
  });

  const outroStart = currentFrame;

  // Audio file prefix (lowercase name)
  const audioPrefix = studentData.name.toLowerCase();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a1a",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Audio narration - intro audio */}
      <Sequence from={30}>
        <Audio src={staticFile(`error_intro_${audioPrefix}.mp3`)} />
      </Sequence>

      {/* Audio for each error segment */}
      {segmentTiming.map(({ error, start }, index) => (
        <Sequence key={`audio-${error}`} from={start + 30}>
          <Audio src={staticFile(`error_${error}.mp3`)} />
        </Sequence>
      ))}

      {/* Outro audio */}
      <Sequence from={outroStart + 30}>
        <Audio src={staticFile(`error_outro_${audioPrefix}.mp3`)} />
      </Sequence>

      {/* Intro sequence */}
      <Sequence from={0} durationInFrames={INTRO_DURATION}>
        <ModularIntro
          studentName={studentData.name}
          totalScore={totalScore}
          maxScore={maxScore}
          percentage={percentage}
          errorCount={errors.length}
        />
      </Sequence>

      {/* Error segment sequences */}
      {segmentTiming.map(({ error, start }) => {
        const ErrorComponent = ErrorComponents[error];
        return (
          <Sequence key={error} from={start} durationInFrames={SEGMENT_DURATION}>
            <ErrorComponent />
          </Sequence>
        );
      })}

      {/* Outro sequence */}
      <Sequence from={outroStart} durationInFrames={OUTRO_DURATION}>
        <ModularOutro studentName={studentData.name} errors={errors} />
      </Sequence>
    </AbsoluteFill>
  );
};

// Export helper to calculate duration for external use
export { calculateVideoDuration };
