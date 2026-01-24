// Student tokens for personalized review access
// In production, this would be stored in Supabase

export interface StudentReviewData {
  token: string;
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
  totalScore: number;
  maxScore: number;
  percentage: number;
  needsCycleReview: boolean;
  needsHearingReview: boolean;
}

// Generate a random token
function generateToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 12; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Students who need support (below 60%)
// Tokens are pre-generated and fixed for distribution
export const studentTokens: Record<string, StudentReviewData> = {
  // Elizabeth - 40%
  "e7x9k2mw4p1q": {
    token: "e7x9k2mw4p1q",
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
    totalScore: 2,
    maxScore: 5,
    percentage: 40,
    needsCycleReview: true,
    needsHearingReview: true,
  },

  // Ned Jones - 20%
  "n3d8j5kx7r2t": {
    token: "n3d8j5kx7r2t",
    name: "Ned",
    q1Score: 0,
    q1MaxScore: 2,
    q1Answer: "formation of how the sound wave moves",
    q1Feedback: "Too vague - use terms like oscillation, peak, trough",
    q2Score: 1,
    q2MaxScore: 3,
    q2Answer: "higher frequency = higher pitch, frequency determines loudness",
    q2Feedback: "Frequency determines pitch, not loudness - amplitude determines loudness",
    hearingRangeLower: 0,
    hearingRangeUpper: 0, // Not provided
    totalScore: 1,
    maxScore: 5,
    percentage: 20,
    needsCycleReview: true,
    needsHearingReview: true,
  },

  // Fergus Hallett - 20%
  "f4g2h8lm9n5v": {
    token: "f4g2h8lm9n5v",
    name: "Fergus",
    q1Score: 0,
    q1MaxScore: 2,
    q1Answer: "", // Not attempted
    q1Feedback: "Q1 not attempted - a cycle is one complete oscillation",
    q2Score: 1,
    q2MaxScore: 3,
    q2Answer: "higher frequency = higher pitch, 44kHz hearing range",
    q2Feedback: "Correct frequency-pitch, but 44kHz is sample rate not hearing range",
    hearingRangeLower: 0,
    hearingRangeUpper: 44000,
    totalScore: 1,
    maxScore: 5,
    percentage: 20,
    needsCycleReview: true,
    needsHearingReview: true,
  },

  // Alex Grover - 0%
  "a1x7g3rv5k8m": {
    token: "a1x7g3rv5k8m",
    name: "Alex",
    q1Score: 0,
    q1MaxScore: 2,
    q1Answer: "The amount of waves in 1 second",
    q1Feedback: "This defines frequency, not a cycle. A cycle is ONE complete oscillation",
    q2Score: 0,
    q2MaxScore: 3,
    q2Answer: "Pitch is the loudness",
    q2Feedback: "Pitch is how high/low (frequency), loudness is amplitude - different properties",
    hearingRangeLower: 0,
    hearingRangeUpper: 0,
    totalScore: 0,
    maxScore: 5,
    percentage: 0,
    needsCycleReview: true,
    needsHearingReview: true,
  },

  // Lachy Geddes - 0% (incomplete)
  "l9c4y6gd2s8w": {
    token: "l9c4y6gd2s8w",
    name: "Lachy",
    q1Score: 0,
    q1MaxScore: 2,
    q1Answer: "", // Not attempted
    q1Feedback: "Q1 not attempted",
    q2Score: 0,
    q2MaxScore: 3,
    q2Answer: "", // Not attempted
    q2Feedback: "Q2 not attempted - please complete the assessment",
    hearingRangeLower: 0,
    hearingRangeUpper: 0,
    totalScore: 0,
    maxScore: 5,
    percentage: 0,
    needsCycleReview: true,
    needsHearingReview: true,
  },
};

// Validate a token and return student data
export function validateToken(token: string): StudentReviewData | null {
  return studentTokens[token] || null;
}

// Get all tokens for teacher reference
export function getAllTokens(): Array<{ name: string; token: string; percentage: number }> {
  return Object.values(studentTokens).map(s => ({
    name: s.name,
    token: s.token,
    percentage: s.percentage,
  }));
}
