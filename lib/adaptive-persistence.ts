// lib/adaptive-persistence.ts
import { supabase } from "./supabase";
import type { SessionState, AnswerRecord } from "./adaptive-engine";
import { calculateLevel } from "./adaptive-engine";

interface CreateSessionParams {
  studentToken: string;
  videoId: string;
  topic: string;
}

/**
 * Create a new adaptive session in Supabase.
 * Returns the session UUID.
 */
export async function createAdaptiveSession({
  studentToken,
  videoId,
  topic,
}: CreateSessionParams): Promise<string | null> {
  const { data, error } = await supabase
    .from("adaptive_sessions")
    .insert({
      student_token: studentToken,
      video_id: videoId,
      topic,
      starting_difficulty: 2,
      ending_difficulty: 2,
      level: 1,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create adaptive session:", error);
    return null;
  }
  return data.id;
}

/**
 * Save the completed session to Supabase.
 */
export async function completeAdaptiveSession(
  sessionId: string,
  session: SessionState,
): Promise<boolean> {
  const { level, weightedScore, totalCorrect, totalQuestions } = calculateLevel(session);

  const responses = session.answers.map((a) => ({
    checkpointIndex: a.checkpointIndex,
    questionId: a.questionId,
    difficulty: a.difficulty,
    answer: a.answer,
    correct: a.correct,
    timeTakenMs: a.timeTakenMs,
  }));

  const { error } = await supabase
    .from("adaptive_sessions")
    .update({
      responses,
      ending_difficulty: session.currentDifficulty,
      questions_correct: totalCorrect,
      questions_total: totalQuestions,
      weighted_score: weightedScore,
      level,
      completed: true,
      completed_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (error) {
    console.error("Failed to complete adaptive session:", error);
    return false;
  }
  return true;
}

/**
 * Get a student's best level for a video (for showing progress on the library page later).
 */
export async function getBestLevel(
  studentToken: string,
  videoId: string,
): Promise<number | null> {
  const { data, error } = await supabase
    .from("adaptive_sessions")
    .select("level")
    .eq("student_token", studentToken)
    .eq("video_id", videoId)
    .eq("completed", true)
    .order("level", { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) return null;
  return data[0].level;
}
