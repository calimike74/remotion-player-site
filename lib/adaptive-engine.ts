// lib/adaptive-engine.ts
import type { CheckpointQuestion, VideoCheckpointConfig } from "./checkpoint-questions";
import { getQuestionsAtDifficulty } from "./checkpoint-questions";

export type Difficulty = 1 | 2 | 3;

export interface AnswerRecord {
  checkpointIndex: number;
  questionId: string;
  difficulty: Difficulty;
  answer: number;       // selected option index
  correct: boolean;
  timeTakenMs: number;
}

export interface SessionState {
  currentDifficulty: Difficulty;
  streak: number;             // positive = consecutive correct, negative = consecutive wrong
  answers: AnswerRecord[];
  currentCheckpoint: number;  // which checkpoint we're on (0-indexed)
  completed: boolean;
}

export function createSession(): SessionState {
  return {
    currentDifficulty: 2,
    streak: 0,
    answers: [],
    currentCheckpoint: 0,
    completed: false,
  };
}

/**
 * Pick a question for the current checkpoint + difficulty.
 * Avoids questions already answered in this session.
 * Falls back to adjacent difficulty if no questions available.
 */
export function pickQuestion(
  config: VideoCheckpointConfig,
  session: SessionState,
): CheckpointQuestion | null {
  const answeredIds = new Set(session.answers.map((a) => a.questionId));
  const cp = session.currentCheckpoint;

  // Try current difficulty first, then fall back
  const difficultiesToTry: Difficulty[] = [
    session.currentDifficulty,
    ...(session.currentDifficulty === 1
      ? [2, 3] as Difficulty[]
      : session.currentDifficulty === 3
        ? [2, 1] as Difficulty[]
        : [1, 3] as Difficulty[]),
  ];

  for (const diff of difficultiesToTry) {
    const pool = getQuestionsAtDifficulty(config, cp, diff)
      .filter((q) => !answeredIds.has(q.id));
    if (pool.length > 0) {
      // Random pick from available pool
      return pool[Math.floor(Math.random() * pool.length)];
    }
  }

  return null; // No questions left (shouldn't happen with enough authored Qs)
}

/**
 * Record an answer and update difficulty.
 * Returns the updated session state (immutable).
 */
export function recordAnswer(
  session: SessionState,
  record: AnswerRecord,
): SessionState {
  const newAnswers = [...session.answers, record];
  let newStreak = session.streak;
  let newDifficulty = session.currentDifficulty;

  if (record.correct) {
    newStreak = Math.max(newStreak, 0) + 1;
    if (newStreak >= 2) {
      newDifficulty = Math.min(3, newDifficulty + 1) as Difficulty;
      newStreak = 0;
    }
  } else {
    newStreak = Math.min(newStreak, 0) - 1;
    if (newStreak <= -2) {
      newDifficulty = Math.max(1, newDifficulty - 1) as Difficulty;
      newStreak = 0;
    }
  }

  return {
    ...session,
    answers: newAnswers,
    streak: newStreak,
    currentDifficulty: newDifficulty,
  };
}

/**
 * Advance to the next checkpoint.
 * Returns updated session (or marks completed if past last checkpoint).
 */
export function advanceCheckpoint(
  session: SessionState,
  totalCheckpoints: number,
): SessionState {
  const next = session.currentCheckpoint + 1;
  if (next >= totalCheckpoints) {
    return { ...session, completed: true };
  }
  return { ...session, currentCheckpoint: next };
}

/**
 * Calculate the student's final level (1–5) based on weighted score.
 *
 * Weighted score = sum(difficulty × correct) / sum(difficulty)
 * Level mapping: 0–0.2 → 1, 0.2–0.4 → 2, 0.4–0.6 → 3, 0.6–0.8 → 4, 0.8–1.0 → 5
 */
export function calculateLevel(session: SessionState): {
  level: number;
  weightedScore: number;
  totalCorrect: number;
  totalQuestions: number;
} {
  const totalQuestions = session.answers.length;
  if (totalQuestions === 0) return { level: 1, weightedScore: 0, totalCorrect: 0, totalQuestions: 0 };

  const totalCorrect = session.answers.filter((a) => a.correct).length;
  const weightedNumerator = session.answers.reduce(
    (sum, a) => sum + (a.correct ? a.difficulty : 0),
    0,
  );
  const weightedDenominator = session.answers.reduce(
    (sum, a) => sum + a.difficulty,
    0,
  );
  const weightedScore = weightedDenominator > 0 ? weightedNumerator / weightedDenominator : 0;

  // Map to 1–5
  const level = Math.min(5, Math.max(1, Math.ceil(weightedScore * 5)));

  return { level, weightedScore: Math.round(weightedScore * 1000) / 1000, totalCorrect, totalQuestions };
}

/**
 * Get level label and recommendation text.
 */
export function getLevelFeedback(level: number, topic: string): {
  label: string;
  emoji: string;
  message: string;
  nextSteps: string;
} {
  const feedback: Record<number, { label: string; emoji: string; message: string; nextSteps: string }> = {
    1: {
      label: "Getting Started",
      emoji: "🌱",
      message: "You're building the foundations — and that's exactly where everyone starts.",
      nextSteps: `Rewatch this video, pausing to take notes on key terms. Then try the interactive resource for ${topic} on the main site.`,
    },
    2: {
      label: "Building Understanding",
      emoji: "📚",
      message: "You know the basics — now it's about connecting them together.",
      nextSteps: `Focus on the 'why' behind each concept. Try explaining threshold and ratio to a friend in your own words. Then revisit the harder questions.`,
    },
    3: {
      label: "Confident",
      emoji: "💪",
      message: "Solid understanding — you can recall and apply the key concepts.",
      nextSteps: `Try the exam-style questions on the interactive resources site. Focus on calculation questions involving threshold, ratio, and gain reduction.`,
    },
    4: {
      label: "Strong",
      emoji: "🔥",
      message: "Excellent recall and application — you're handling the harder material well.",
      nextSteps: `Push into the extended topics: side-chain compression, parallel compression, and multiband dynamics. Try writing exam answers explaining these concepts.`,
    },
    5: {
      label: "Mastery",
      emoji: "⭐",
      message: "Outstanding — you've nailed this topic at the highest level.",
      nextSteps: `You're exam-ready on this topic. Help a classmate who's still building understanding — teaching is the best way to reinforce mastery. Then move to your weakest topic.`,
    },
  };

  return feedback[level] ?? feedback[1];
}
