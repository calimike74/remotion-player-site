// Modular Error Segment Definitions
// Each segment addresses a specific misconception and can be reused for any student

export type ErrorType =
  | 'cycle-half'        // Thinks peak→trough is a full cycle
  | 'cycle-vague'       // Vague or missing cycle definition
  | 'cycle-frequency'   // Confused cycle with frequency
  | 'pitch-loudness'    // Thinks pitch = loudness
  | 'hearing-range';    // Wrong hearing range

export interface ErrorSegment {
  id: ErrorType;
  title: string;
  duration: number; // frames at 30fps
  audioFile: string;
  description: string;
}

// Each segment is designed to be ~15-20 seconds (450-600 frames)
export const errorSegments: Record<ErrorType, ErrorSegment> = {
  'cycle-half': {
    id: 'cycle-half',
    title: 'Understanding a Full Cycle',
    duration: 540, // 18 seconds
    audioFile: 'error_cycle_half.mp3',
    description: 'Addresses the misconception that peak to trough is a complete cycle',
  },
  'cycle-vague': {
    id: 'cycle-vague',
    title: 'What is a Cycle?',
    duration: 540,
    audioFile: 'error_cycle_vague.mp3',
    description: 'Teaches the cycle definition from fundamentals',
  },
  'cycle-frequency': {
    id: 'cycle-frequency',
    title: 'Cycle vs Frequency',
    duration: 540,
    audioFile: 'error_cycle_frequency.mp3',
    description: 'Distinguishes one cycle from cycles per second (frequency)',
  },
  'pitch-loudness': {
    id: 'pitch-loudness',
    title: 'Pitch vs Loudness',
    duration: 540,
    audioFile: 'error_pitch_loudness.mp3',
    description: 'Clarifies that pitch (frequency) and loudness (amplitude) are different',
  },
  'hearing-range': {
    id: 'hearing-range',
    title: 'Human Hearing Range',
    duration: 540,
    audioFile: 'error_hearing_range.mp3',
    description: 'Teaches the correct 20Hz-20kHz range',
  },
};

// Map student errors to segment IDs
export function getStudentErrors(studentData: {
  q1Score: number;
  q1MaxScore: number;
  q1Answer: string;
  q2Score: number;
  q2MaxScore: number;
  q2Answer: string;
}): ErrorType[] {
  const errors: ErrorType[] = [];

  // Q1: Cycle definition errors
  if (studentData.q1Score < studentData.q1MaxScore) {
    const answer = studentData.q1Answer.toLowerCase();

    if (answer.includes('peak') && answer.includes('trough') && !answer.includes('back')) {
      // Mentioned peak/trough but not returning - half cycle error
      errors.push('cycle-half');
    } else if (answer.includes('waves in') || answer.includes('per second') || answer.includes('frequency')) {
      // Defined frequency instead of cycle
      errors.push('cycle-frequency');
    } else {
      // Vague or missing
      errors.push('cycle-vague');
    }
  }

  // Q2: Frequency/pitch/hearing errors
  if (studentData.q2Score < studentData.q2MaxScore) {
    const answer = studentData.q2Answer.toLowerCase();

    // Check for pitch/loudness confusion
    if (answer.includes('loudness') || answer.includes('loud')) {
      errors.push('pitch-loudness');
    }

    // Everyone who got Q2 wrong needs hearing range review
    errors.push('hearing-range');
  }

  return errors;
}

// Calculate total duration based on student's errors
export function calculateVideoDuration(errors: ErrorType[]): number {
  const introDuration = 330;  // 11 sec - personalized intro + buffer
  const outroDuration = 270;  // 9 sec - personalized outro
  const segmentDuration = 630; // 21 sec per segment (18 sec content + 3 sec buffer)

  return introDuration + (errors.length * segmentDuration) + outroDuration;
}
