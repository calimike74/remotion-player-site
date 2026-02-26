# Adaptive Checkpoint Assessments — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Videos auto-pause at section boundaries, present adaptive-difficulty questions, save responses to Supabase, and show a personalised level + recommendations at the end.

**Architecture:** A new `/learn/[videoId]` page wraps the Remotion `<Player>` with an `AdaptiveQuizOverlay`. Each video defines checkpoint frames aligned to scene transitions. An `AdaptiveEngine` selects questions from a difficulty-tagged bank, adjusting level based on consecutive correct/incorrect answers. All responses persist to Supabase. A `SessionSummary` shows the student's level (1–5) with tailored next steps.

**Tech Stack:** Next.js 16 + React 19 + TypeScript, Remotion Player 4.0.409, Supabase (@supabase/supabase-js), Tailwind v4.

**Prototype video:** Dynamic Processing (90s, 5 content sections, 20 existing questions in `dynamics.json`)

---

## Architecture Overview

```
/learn/[videoId]/page.tsx
├── LearnPageClient.tsx (token validation + state orchestration)
│   ├── <Player ref={playerRef}> (Remotion composition)
│   │   └── onFrameChange → check checkpoint array
│   │       └── if checkpoint reached → pause player, set overlay visible
│   ├── <AdaptiveQuizOverlay>
│   │   ├── Shows question from AdaptiveEngine
│   │   ├── On answer → save to Supabase, update engine state
│   │   └── On dismiss → resume player
│   └── <SessionSummary>  (after final checkpoint answered)
│       ├── Level badge (1–5)
│       ├── Score breakdown
│       └── Personalised recommendations
├── lib/adaptive-engine.ts (difficulty tracking, question selection)
├── lib/checkpoint-questions.ts (video→checkpoint→question mapping)
├── lib/supabase.ts (client initialisation)
└── lib/adaptive-persistence.ts (Supabase read/write)
```

## Checkpoint → Scene Mapping (Dynamic Processing)

| Checkpoint | After Scene | Frame | Topic Covered | Questions About |
|---|---|---|---|---|
| 1 | WhatIsCompression | 570 (19s) | What compression is, why we use it | Definition, purpose |
| 2 | IOGraph | 1290 (43s) | I/O graph, threshold, gain reduction | Threshold, gain reduction maths |
| 3 | RatioExamples | 1770 (59s) | 4:1, 10:1, limiting ratios | Ratio calculations, limiter definition |
| 4 | AttackRelease | 2370 (79s) | Attack/release on transients | Attack/release behaviour |

No checkpoint after ExamTip — that's the final scene, flows straight to SessionSummary.

## Adaptive Algorithm

```
currentDifficulty = 2 (start at mid-level)
streak = 0

on answer:
  if correct:
    streak = max(streak, 0) + 1
    if streak >= 2: currentDifficulty = min(3, currentDifficulty + 1); streak = 0
  if wrong:
    streak = min(streak, 0) - 1
    if streak <= -2: currentDifficulty = max(1, currentDifficulty - 1); streak = 0

Level calculation (end):
  weightedScore = sum(questionDifficulty * correct) / sum(questionDifficulty)
  level = round(weightedScore * 4) + 1  → maps to 1–5
```

## Supabase Schema

```sql
CREATE TABLE adaptive_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_token TEXT NOT NULL,
  video_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  responses JSONB NOT NULL DEFAULT '[]',
  -- Each response: { checkpointIndex, questionId, difficulty, answer, correct, timeTakenMs }
  starting_difficulty INT NOT NULL DEFAULT 2,
  ending_difficulty INT NOT NULL,
  questions_correct INT NOT NULL DEFAULT 0,
  questions_total INT NOT NULL DEFAULT 0,
  weighted_score NUMERIC(5,3),
  level INT NOT NULL,  -- 1–5
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_adaptive_sessions_student ON adaptive_sessions(student_token);
CREATE INDEX idx_adaptive_sessions_video ON adaptive_sessions(video_id);
```

---

## Task 1: Supabase Client

**Files:**
- Create: `lib/supabase.ts`
- Modify: `package.json` (add dependency)

**Step 1: Install Supabase client**

```bash
cd remotion-player-site && npm install @supabase/supabase-js
```

**Step 2: Create Supabase client**

```typescript
// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Step 3: Add env vars to `.env.local`**

Copy `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from the grades-dashboard `.env.local` (same Supabase project).

**Step 4: Verify build**

```bash
npm run build
```

Expected: Build succeeds (Supabase client is tree-shaken if unused).

**Step 5: Commit**

```bash
git add lib/supabase.ts package.json package-lock.json
git commit -m "feat: add Supabase client to remotion-player-site"
```

---

## Task 2: Supabase Table

**Files:**
- Create: `supabase/adaptive-sessions.sql`

**Step 1: Write migration SQL**

```sql
-- supabase/adaptive-sessions.sql
-- Stores adaptive checkpoint assessment sessions

CREATE TABLE IF NOT EXISTS adaptive_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_token TEXT NOT NULL,
  video_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  responses JSONB NOT NULL DEFAULT '[]',
  starting_difficulty INT NOT NULL DEFAULT 2,
  ending_difficulty INT NOT NULL DEFAULT 2,
  questions_correct INT NOT NULL DEFAULT 0,
  questions_total INT NOT NULL DEFAULT 0,
  weighted_score NUMERIC(5,3) DEFAULT 0,
  level INT NOT NULL DEFAULT 1,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_adaptive_sessions_student ON adaptive_sessions(student_token);
CREATE INDEX IF NOT EXISTS idx_adaptive_sessions_video ON adaptive_sessions(video_id);

-- RLS: allow inserts and reads from anon key (token-based auth, not Supabase Auth)
ALTER TABLE adaptive_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON adaptive_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read own sessions" ON adaptive_sessions
  FOR SELECT USING (true);

CREATE POLICY "Allow update own sessions" ON adaptive_sessions
  FOR UPDATE USING (true);
```

**Step 2: Run in Supabase SQL Editor**

Open Supabase dashboard → SQL Editor → paste and run.

**Step 3: Verify table exists**

Run `SELECT * FROM adaptive_sessions LIMIT 1;` — should return empty result set, no error.

**Step 4: Commit**

```bash
git add supabase/adaptive-sessions.sql
git commit -m "feat: add adaptive_sessions table migration"
```

---

## Task 3: Checkpoint Question Bank

**Files:**
- Create: `lib/checkpoint-questions.ts`

This is the data layer. Each video maps to an array of checkpoints. Each checkpoint has questions at 3 difficulty levels. For the MVP, we author 3 questions per difficulty per checkpoint = 36 questions for Dynamic Processing.

We draw from the existing `dynamics.json` bank (20 questions) and author new ones to fill gaps.

**Step 1: Create the question types and data**

```typescript
// lib/checkpoint-questions.ts

export interface CheckpointQuestion {
  id: string;
  question: string;
  type: "mcq";  // MCQ only for MVP — fast to answer in overlay
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 1 | 2 | 3;
}

export interface VideoCheckpoint {
  checkpointIndex: number;
  afterScene: string;
  frame: number;          // frame to pause at
  topicCovered: string;   // what the student just watched
  questions: CheckpointQuestion[];  // pool to pick from (mixed difficulties)
}

export interface VideoCheckpointConfig {
  videoId: string;
  topic: string;
  compositionId: string;
  totalCheckpoints: number;
  checkpoints: VideoCheckpoint[];
}

// --- Dynamic Processing Checkpoints ---

const dynamicProcessingCheckpoints: VideoCheckpointConfig = {
  videoId: "dynamic-processing-revision",
  topic: "1.9",
  compositionId: "DynamicProcessingRevision",
  totalCheckpoints: 4,
  checkpoints: [
    {
      checkpointIndex: 0,
      afterScene: "WhatIsCompression",
      frame: 570,  // 19s × 30fps
      topicCovered: "What compression is and why we use it",
      questions: [
        // Difficulty 1 — recall
        {
          id: "dp-cp1-d1-1",
          question: "What does a compressor do to loud signals that exceed the threshold?",
          type: "mcq",
          options: [
            "Reduces their level",
            "Increases their level",
            "Removes them entirely",
            "Doubles their frequency"
          ],
          correctIndex: 0,
          explanation: "A compressor reduces (attenuates) signals that exceed the threshold, making loud parts quieter to control dynamic range.",
          difficulty: 1,
        },
        {
          id: "dp-cp1-d1-2",
          question: "Dynamic range is the difference between:",
          type: "mcq",
          options: [
            "The quietest and loudest parts of a signal",
            "The lowest and highest frequencies",
            "The left and right stereo channels",
            "The input and output levels"
          ],
          correctIndex: 0,
          explanation: "Dynamic range is the difference in level between the quietest and loudest parts of an audio signal.",
          difficulty: 1,
        },
        // Difficulty 2 — understanding
        {
          id: "dp-cp1-d2-1",
          question: "Why might an engineer use compression on a vocal recording?",
          type: "mcq",
          options: [
            "To even out volume differences so quieter words aren't lost in the mix",
            "To add reverb to the vocal",
            "To increase the pitch of the vocal",
            "To convert mono to stereo"
          ],
          correctIndex: 0,
          explanation: "Compression evens out the dynamic range, ensuring quieter syllables are audible alongside louder ones without manual volume riding.",
          difficulty: 2,
        },
        {
          id: "dp-cp1-d2-2",
          question: "What happens to signals that stay below the threshold?",
          type: "mcq",
          options: [
            "They pass through unaffected",
            "They are boosted to match the threshold",
            "They are compressed at a lower ratio",
            "They are removed from the signal"
          ],
          correctIndex: 0,
          explanation: "A compressor only acts on signals that exceed the threshold. Everything below passes through unchanged.",
          difficulty: 2,
        },
        // Difficulty 3 — application
        {
          id: "dp-cp1-d3-1",
          question: "A vocalist whispers at -40 dBFS and shouts at -5 dBFS. The dynamic range is 35 dB. After compression with makeup gain, both parts sit between -20 and -10 dBFS. What has the compressor achieved?",
          type: "mcq",
          options: [
            "Reduced the dynamic range from 35 dB to 10 dB",
            "Increased the dynamic range from 10 dB to 35 dB",
            "Removed the quiet parts entirely",
            "Changed the frequency content of the signal"
          ],
          correctIndex: 0,
          explanation: "The compressor has reduced the dynamic range from 35 dB to just 10 dB — the loud and quiet parts are now much closer in level.",
          difficulty: 3,
        },
        {
          id: "dp-cp1-d3-2",
          question: "In a live concert, the drummer plays extremely dynamically. Without compression, what problem would the sound engineer face?",
          type: "mcq",
          options: [
            "Quiet hits would be inaudible and loud hits would overwhelm other instruments in the mix",
            "The drums would sound out of tune",
            "The stereo image would collapse to mono",
            "The reverb tail would be too long"
          ],
          correctIndex: 0,
          explanation: "Without compression, the extreme dynamic range would make soft ghost notes disappear in the mix while rimshots and crashes dominate, making a balanced mix impossible.",
          difficulty: 3,
        },
      ],
    },
    {
      checkpointIndex: 1,
      afterScene: "IOGraph",
      frame: 1290,  // 43s × 30fps
      topicCovered: "Input/output graph, threshold, and gain reduction",
      questions: [
        // Difficulty 1
        {
          id: "dp-cp2-d1-1",
          question: "On a compressor's I/O graph, the threshold is the point where:",
          type: "mcq",
          options: [
            "The line bends away from the 1:1 diagonal",
            "The output reaches 0 dB",
            "The input signal is at its quietest",
            "The ratio becomes 1:1"
          ],
          correctIndex: 0,
          explanation: "Below the threshold, input = output (1:1 line). At the threshold, the line bends — this is where compression begins.",
          difficulty: 1,
        },
        {
          id: "dp-cp2-d1-2",
          question: "On a 1:1 line (no compression), if the input is -20 dBFS, the output is:",
          type: "mcq",
          options: [
            "-20 dBFS",
            "-10 dBFS",
            "0 dBFS",
            "-40 dBFS"
          ],
          correctIndex: 0,
          explanation: "A 1:1 ratio means no gain change — the output exactly matches the input level.",
          difficulty: 1,
        },
        // Difficulty 2
        {
          id: "dp-cp2-d2-1",
          question: "A compressor has a threshold of -20 dBFS and a 2:1 ratio. A signal arrives at -10 dBFS (10 dB above threshold). What is the output level?",
          type: "mcq",
          options: [
            "-15 dBFS",
            "-10 dBFS",
            "-20 dBFS",
            "-5 dBFS"
          ],
          correctIndex: 0,
          explanation: "10 dB above threshold at 2:1 ratio → 10 ÷ 2 = 5 dB above threshold in the output. Threshold is -20, so output = -20 + 5 = -15 dBFS.",
          difficulty: 2,
        },
        {
          id: "dp-cp2-d2-2",
          question: "If a signal is 12 dB above the threshold and the compressor applies 8 dB of gain reduction, what ratio is being used?",
          type: "mcq",
          options: [
            "3:1",
            "2:1",
            "4:1",
            "8:1"
          ],
          correctIndex: 0,
          explanation: "12 dB excess with 8 dB reduction means 4 dB passes through. Input excess (12) ÷ output excess (4) = 3:1 ratio.",
          difficulty: 2,
        },
        // Difficulty 3
        {
          id: "dp-cp2-d3-1",
          question: "A signal peaks at -8 dBFS. The compressor threshold is -20 dBFS, ratio is 4:1. How much gain reduction is applied?",
          type: "mcq",
          options: [
            "9 dB",
            "12 dB",
            "3 dB",
            "8 dB"
          ],
          correctIndex: 0,
          explanation: "Signal is 12 dB above threshold. At 4:1, output is 3 dB above threshold. Gain reduction = 12 - 3 = 9 dB.",
          difficulty: 3,
        },
        {
          id: "dp-cp2-d3-2",
          question: "After applying 9 dB of gain reduction to a peak, the engineer adds 9 dB of makeup gain. What is the effect on the overall signal?",
          type: "mcq",
          options: [
            "Peaks stay the same level, but quieter parts are now 9 dB louder",
            "The entire signal is 9 dB louder",
            "Peaks are 9 dB quieter, quiet parts unchanged",
            "No audible difference"
          ],
          correctIndex: 0,
          explanation: "Compression reduces peaks then makeup gain lifts everything equally. Peaks return to roughly their original level, but quiet parts (which weren't compressed) get the full 9 dB boost — this is how compression increases perceived loudness.",
          difficulty: 3,
        },
      ],
    },
    {
      checkpointIndex: 2,
      afterScene: "RatioExamples",
      frame: 1770,  // 59s × 30fps
      topicCovered: "Ratio comparisons: 4:1, 10:1, limiting",
      questions: [
        // Difficulty 1
        {
          id: "dp-cp3-d1-1",
          question: "A ratio of 4:1 means that for every 4 dB the input exceeds the threshold, the output exceeds it by:",
          type: "mcq",
          options: ["1 dB", "4 dB", "2 dB", "8 dB"],
          correctIndex: 0,
          explanation: "4:1 means 4 dB of input excess produces 1 dB of output excess. The higher the first number, the more compression.",
          difficulty: 1,
        },
        {
          id: "dp-cp3-d1-2",
          question: "Which ratio applies the MOST compression?",
          type: "mcq",
          options: ["10:1", "2:1", "4:1", "1.5:1"],
          correctIndex: 0,
          explanation: "Higher ratios mean more compression. 10:1 allows almost nothing through above the threshold.",
          difficulty: 1,
        },
        // Difficulty 2
        {
          id: "dp-cp3-d2-1",
          question: "What makes a limiter different from a compressor?",
          type: "mcq",
          options: [
            "A limiter uses an extremely high ratio (10:1 or more), setting an absolute ceiling",
            "A limiter only works on bass frequencies",
            "A limiter increases the dynamic range",
            "A limiter has no threshold control"
          ],
          correctIndex: 0,
          explanation: "A limiter is essentially a compressor with a very high ratio (typically 10:1 to infinity:1). It prevents signals from exceeding the threshold, acting as a ceiling.",
          difficulty: 2,
        },
        {
          id: "dp-cp3-d2-2",
          question: "When would you choose a gentle ratio like 2:1 over an aggressive 10:1?",
          type: "mcq",
          options: [
            "When you want transparent, natural-sounding compression (e.g., on vocals or acoustic guitar)",
            "When mastering a final mix for streaming",
            "When trying to prevent clipping on a drum bus",
            "When creating a ducking effect with side-chain"
          ],
          correctIndex: 0,
          explanation: "Gentle ratios (1.5:1 to 3:1) preserve the natural dynamics while just taming the extremes. This is ideal for vocals and acoustic instruments where you want control without an audibly 'compressed' sound.",
          difficulty: 2,
        },
        // Difficulty 3
        {
          id: "dp-cp3-d3-1",
          question: "An input signal is 24 dB above the threshold. Compare the output excess at 4:1, 10:1, and infinity:1 (limiting).",
          type: "mcq",
          options: [
            "6 dB, 2.4 dB, 0 dB",
            "6 dB, 10 dB, 24 dB",
            "24 dB, 10 dB, 0 dB",
            "4 dB, 1 dB, 0 dB"
          ],
          correctIndex: 0,
          explanation: "At 4:1: 24÷4 = 6 dB. At 10:1: 24÷10 = 2.4 dB. At ∞:1: 24÷∞ = 0 dB (nothing passes the threshold).",
          difficulty: 3,
        },
        {
          id: "dp-cp3-d3-2",
          question: "A mastering engineer places a limiter at -1 dBFS on the master bus. Why -1 dBFS and not 0 dBFS?",
          type: "mcq",
          options: [
            "To allow headroom for inter-sample peaks that can exceed 0 dBFS during digital-to-analogue conversion",
            "Because streaming platforms require it",
            "To leave space for the compressor after the limiter",
            "Because -1 dBFS sounds louder than 0 dBFS"
          ],
          correctIndex: 0,
          explanation: "Inter-sample peaks (ISPs) can exceed 0 dBFS when the DAC reconstructs the analogue waveform between samples. Setting the ceiling at -1 dBFS provides a safety margin to prevent distortion on playback systems.",
          difficulty: 3,
        },
      ],
    },
    {
      checkpointIndex: 3,
      afterScene: "AttackRelease",
      frame: 2370,  // 79s × 30fps
      topicCovered: "Attack and release times on drum transients",
      questions: [
        // Difficulty 1
        {
          id: "dp-cp4-d1-1",
          question: "Attack time on a compressor controls:",
          type: "mcq",
          options: [
            "How quickly the compressor starts reducing gain after the signal exceeds the threshold",
            "How quickly the compressor stops reducing gain",
            "The level of the threshold",
            "The frequency range being compressed"
          ],
          correctIndex: 0,
          explanation: "Attack time is how fast the compressor reacts once the signal crosses the threshold. Fast attack = immediate clamping; slow attack = transients pass through first.",
          difficulty: 1,
        },
        {
          id: "dp-cp4-d1-2",
          question: "Release time controls:",
          type: "mcq",
          options: [
            "How quickly the compressor stops compressing after the signal drops below the threshold",
            "How quickly the signal fades out",
            "The speed of the attack",
            "The makeup gain amount"
          ],
          correctIndex: 0,
          explanation: "Release is how fast the compressor lets go — returns to unity gain — once the signal falls below the threshold again.",
          difficulty: 1,
        },
        // Difficulty 2
        {
          id: "dp-cp4-d2-1",
          question: "A fast attack time on a snare drum would:",
          type: "mcq",
          options: [
            "Clamp down on the initial transient, making the snare sound softer and rounder",
            "Let the transient through and only compress the sustain",
            "Increase the volume of the snare hit",
            "Add reverb to the snare"
          ],
          correctIndex: 0,
          explanation: "A fast attack catches the initial transient (the sharp 'crack' of the snare) and compresses it, reducing its punch. This makes the snare sound smoother but less impactful.",
          difficulty: 2,
        },
        {
          id: "dp-cp4-d2-2",
          question: "Why would a mix engineer choose a slow attack on drums?",
          type: "mcq",
          options: [
            "To preserve the initial transient punch while controlling the sustain/body",
            "To make the drums quieter overall",
            "To remove the low frequencies from the drums",
            "To add a delay effect to each hit"
          ],
          correctIndex: 0,
          explanation: "A slow attack lets the initial transient pass through uncompressed, preserving the 'snap' and 'punch'. The compressor then kicks in to control the sustain and body that follows.",
          difficulty: 2,
        },
        // Difficulty 3
        {
          id: "dp-cp4-d3-1",
          question: "A compressor with a very fast attack and very fast release on a bass guitar causes audible distortion. Why?",
          type: "mcq",
          options: [
            "The compressor modulates the gain so rapidly it alters the waveform shape at audio frequencies",
            "The bass frequencies are too loud for the compressor",
            "Fast settings always cause clipping",
            "The release is resetting the threshold"
          ],
          correctIndex: 0,
          explanation: "When both attack and release are extremely fast, the compressor can change gain within individual cycles of low-frequency waveforms. This effectively reshapes the waveform, introducing harmonic distortion — sometimes desirable, often not.",
          difficulty: 3,
        },
        {
          id: "dp-cp4-d3-2",
          question: "An engineer sets a compressor with 30ms attack, 200ms release on a drum bus. The kick hits every 500ms (120 BPM). Will the compressor fully release between kick hits?",
          type: "mcq",
          options: [
            "Yes — 200ms release completes well within the 500ms gap between kicks",
            "No — 200ms is longer than 500ms",
            "It depends on the ratio setting",
            "The compressor ignores timing completely"
          ],
          correctIndex: 0,
          explanation: "At 120 BPM, kicks are 500ms apart. The compressor needs 30ms to engage + 200ms to release = 230ms total. That leaves 270ms of unity gain before the next kick — plenty of time to release fully. This avoids 'pumping'.",
          difficulty: 3,
        },
      ],
    },
  ],
};

// Registry of all video checkpoint configs
export const checkpointConfigs: Record<string, VideoCheckpointConfig> = {
  "dynamic-processing-revision": dynamicProcessingCheckpoints,
};

// Helper: get config for a video
export function getCheckpointConfig(videoId: string): VideoCheckpointConfig | null {
  return checkpointConfigs[videoId] ?? null;
}

// Helper: get questions for a specific checkpoint at a difficulty level
export function getQuestionsAtDifficulty(
  config: VideoCheckpointConfig,
  checkpointIndex: number,
  difficulty: 1 | 2 | 3,
): CheckpointQuestion[] {
  const checkpoint = config.checkpoints[checkpointIndex];
  if (!checkpoint) return [];
  return checkpoint.questions.filter((q) => q.difficulty === difficulty);
}
```

**Step 2: Verify TypeScript**

```bash
npx tsc --noEmit lib/checkpoint-questions.ts
```

Expected: no errors.

**Step 3: Commit**

```bash
git add lib/checkpoint-questions.ts
git commit -m "feat: add checkpoint question bank for Dynamic Processing"
```

---

## Task 4: Adaptive Engine

**Files:**
- Create: `lib/adaptive-engine.ts`

The engine is pure logic — no React, no Supabase. It tracks difficulty, picks questions, calculates the final level.

**Step 1: Create the engine**

```typescript
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
```

**Step 2: Verify TypeScript**

```bash
npx tsc --noEmit lib/adaptive-engine.ts
```

**Step 3: Commit**

```bash
git add lib/adaptive-engine.ts
git commit -m "feat: add adaptive difficulty engine with level calculation"
```

---

## Task 5: Supabase Persistence Layer

**Files:**
- Create: `lib/adaptive-persistence.ts`

**Step 1: Create persistence functions**

```typescript
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
```

**Step 2: Verify TypeScript**

```bash
npx tsc --noEmit lib/adaptive-persistence.ts
```

**Step 3: Commit**

```bash
git add lib/adaptive-persistence.ts
git commit -m "feat: add Supabase persistence for adaptive sessions"
```

---

## Task 6: AdaptiveQuizOverlay Component

**Files:**
- Create: `components/AdaptiveQuizOverlay.tsx`

This is the modal that appears over the video player when a checkpoint is reached.

**Step 1: Create the component**

```typescript
// components/AdaptiveQuizOverlay.tsx
"use client";

import { useState, useCallback, useRef } from "react";
import type { CheckpointQuestion } from "../lib/checkpoint-questions";

interface Props {
  question: CheckpointQuestion;
  checkpointIndex: number;
  totalCheckpoints: number;
  currentDifficulty: number;
  onAnswer: (selectedIndex: number, correct: boolean, timeTakenMs: number) => void;
}

export function AdaptiveQuizOverlay({
  question,
  checkpointIndex,
  totalCheckpoints,
  currentDifficulty,
  onAnswer,
}: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const startTimeRef = useRef(Date.now());

  const handleSelect = useCallback(
    (index: number) => {
      if (revealed) return;
      setSelected(index);
    },
    [revealed],
  );

  const handleConfirm = useCallback(() => {
    if (selected === null) return;
    const timeTaken = Date.now() - startTimeRef.current;
    const correct = selected === question.correctIndex;
    setRevealed(true);

    // Short delay so the student sees the feedback before moving on
    setTimeout(() => {
      onAnswer(selected, correct, timeTaken);
    }, 2200);
  }, [selected, question.correctIndex, onAnswer]);

  const difficultyLabel = ["", "Foundation", "Intermediate", "Advanced"][currentDifficulty] ?? "";
  const difficultyColor = ["", "#22c55e", "#f59e0b", "#ef4444"][currentDifficulty] ?? "#f59e0b";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      <div
        style={{
          backgroundColor: "#1e293b",
          borderRadius: "16px",
          padding: "32px",
          maxWidth: "640px",
          width: "90%",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <span style={{ fontSize: "14px", color: "#94a3b8" }}>
            Checkpoint {checkpointIndex + 1} of {totalCheckpoints}
          </span>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "9999px",
              backgroundColor: `${difficultyColor}20`,
              color: difficultyColor,
              border: `1px solid ${difficultyColor}40`,
            }}
          >
            {difficultyLabel}
          </span>
        </div>

        {/* Question */}
        <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#f1f5f9", lineHeight: 1.5, marginBottom: "24px" }}>
          {question.question}
        </h3>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
          {question.options.map((option, i) => {
            let bgColor = "rgba(255,255,255,0.05)";
            let borderColor = "rgba(255,255,255,0.1)";
            let textColor = "#e2e8f0";

            if (revealed) {
              if (i === question.correctIndex) {
                bgColor = "rgba(34,197,94,0.15)";
                borderColor = "#22c55e";
                textColor = "#22c55e";
              } else if (i === selected && i !== question.correctIndex) {
                bgColor = "rgba(239,68,68,0.15)";
                borderColor = "#ef4444";
                textColor = "#ef4444";
              }
            } else if (i === selected) {
              bgColor = "rgba(59,130,246,0.15)";
              borderColor = "#3b82f6";
              textColor = "#93c5fd";
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={revealed}
                style={{
                  textAlign: "left",
                  padding: "14px 18px",
                  borderRadius: "10px",
                  backgroundColor: bgColor,
                  border: `1px solid ${borderColor}`,
                  color: textColor,
                  fontSize: "15px",
                  cursor: revealed ? "default" : "pointer",
                  transition: "all 0.15s ease",
                  lineHeight: 1.4,
                }}
              >
                <span style={{ fontWeight: 600, marginRight: "10px", opacity: 0.5 }}>
                  {String.fromCharCode(65 + i)}.
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {/* Explanation (shown after reveal) */}
        {revealed && (
          <div
            style={{
              padding: "16px",
              borderRadius: "10px",
              backgroundColor: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.2)",
              marginBottom: "20px",
              animation: "fadeIn 0.3s ease-out",
            }}
          >
            <p style={{ fontSize: "14px", color: "#93c5fd", lineHeight: 1.5 }}>
              {question.explanation}
            </p>
          </div>
        )}

        {/* Confirm button (before reveal) */}
        {!revealed && (
          <button
            onClick={handleConfirm}
            disabled={selected === null}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              backgroundColor: selected !== null ? "#3b82f6" : "#334155",
              color: selected !== null ? "#ffffff" : "#64748b",
              fontWeight: 600,
              fontSize: "15px",
              border: "none",
              cursor: selected !== null ? "pointer" : "not-allowed",
              transition: "all 0.15s ease",
            }}
          >
            {selected !== null ? "Check Answer" : "Select an answer"}
          </button>
        )}

        {/* Feedback (after reveal) */}
        {revealed && (
          <div style={{ textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>
            {selected === question.correctIndex ? "✓ Correct!" : "✗ Not quite."} Continuing...
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Verify it compiles**

```bash
npx tsc --noEmit components/AdaptiveQuizOverlay.tsx
```

**Step 3: Commit**

```bash
git add components/AdaptiveQuizOverlay.tsx
git commit -m "feat: add AdaptiveQuizOverlay component"
```

---

## Task 7: SessionSummary Component

**Files:**
- Create: `components/SessionSummary.tsx`

Shown after the final checkpoint. Displays level, breakdown, and next steps.

**Step 1: Create the component**

```typescript
// components/SessionSummary.tsx
"use client";

import type { SessionState } from "../lib/adaptive-engine";
import { calculateLevel, getLevelFeedback } from "../lib/adaptive-engine";

interface Props {
  session: SessionState;
  topic: string;
  onRestart: () => void;
  onBackToLibrary: () => void;
}

export function SessionSummary({ session, topic, onRestart, onBackToLibrary }: Props) {
  const { level, weightedScore, totalCorrect, totalQuestions } = calculateLevel(session);
  const feedback = getLevelFeedback(level, topic);

  // Build per-checkpoint breakdown
  const checkpointBreakdown = session.answers.reduce<
    Record<number, { correct: number; total: number; difficulty: number }>
  >((acc, a) => {
    if (!acc[a.checkpointIndex]) acc[a.checkpointIndex] = { correct: 0, total: 0, difficulty: 0 };
    acc[a.checkpointIndex].total++;
    acc[a.checkpointIndex].difficulty = a.difficulty;
    if (a.correct) acc[a.checkpointIndex].correct++;
    return acc;
  }, {});

  // Level bar segments
  const levelColors = ["", "#ef4444", "#f59e0b", "#eab308", "#22c55e", "#3b82f6"];

  return (
    <div style={{ padding: "40px 20px", maxWidth: "600px", margin: "0 auto" }}>
      {/* Level badge */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ fontSize: "64px", marginBottom: "12px" }}>{feedback.emoji}</div>
        <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#f1f5f9", marginBottom: "4px" }}>
          Level {level}: {feedback.label}
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "15px" }}>{feedback.message}</p>
      </div>

      {/* Level progress bar */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "32px" }}>
        {[1, 2, 3, 4, 5].map((l) => (
          <div
            key={l}
            style={{
              flex: 1,
              height: "8px",
              borderRadius: "4px",
              backgroundColor: l <= level ? levelColors[l] : "rgba(255,255,255,0.1)",
              transition: "background-color 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Score */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "20px",
          backgroundColor: "rgba(255,255,255,0.05)",
          borderRadius: "12px",
          marginBottom: "24px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#f1f5f9" }}>
            {totalCorrect}/{totalQuestions}
          </div>
          <div style={{ fontSize: "13px", color: "#94a3b8" }}>Correct</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#f1f5f9" }}>
            {Math.round(weightedScore * 100)}%
          </div>
          <div style={{ fontSize: "13px", color: "#94a3b8" }}>Weighted Score</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#f1f5f9" }}>
            {session.currentDifficulty}
          </div>
          <div style={{ fontSize: "13px", color: "#94a3b8" }}>Final Difficulty</div>
        </div>
      </div>

      {/* Checkpoint breakdown */}
      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#94a3b8", marginBottom: "12px" }}>
          Checkpoint Breakdown
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {Object.entries(checkpointBreakdown).map(([cp, data]) => (
            <div
              key={cp}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                backgroundColor: "rgba(255,255,255,0.05)",
                borderRadius: "8px",
              }}
            >
              <span style={{ color: "#e2e8f0", fontSize: "14px" }}>Checkpoint {Number(cp) + 1}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{
                    fontSize: "12px",
                    color: ["", "#22c55e", "#f59e0b", "#ef4444"][data.difficulty],
                    opacity: 0.7,
                  }}
                >
                  Lvl {data.difficulty}
                </span>
                <span
                  style={{
                    fontWeight: 600,
                    color: data.correct === data.total ? "#22c55e" : data.correct === 0 ? "#ef4444" : "#f59e0b",
                  }}
                >
                  {data.correct}/{data.total}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next steps */}
      <div
        style={{
          padding: "20px",
          borderRadius: "12px",
          backgroundColor: "rgba(59,130,246,0.1)",
          border: "1px solid rgba(59,130,246,0.2)",
          marginBottom: "32px",
        }}
      >
        <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#93c5fd", marginBottom: "8px" }}>
          What to do next
        </h3>
        <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.6 }}>{feedback.nextSteps}</p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={onRestart}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "10px",
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#e2e8f0",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
        <button
          onClick={onBackToLibrary}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "10px",
            backgroundColor: "#3b82f6",
            border: "none",
            color: "#ffffff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Back to Library
        </button>
      </div>
    </div>
  );
}
```

**Step 2: Verify it compiles**

```bash
npx tsc --noEmit components/SessionSummary.tsx
```

**Step 3: Commit**

```bash
git add components/SessionSummary.tsx
git commit -m "feat: add SessionSummary component with level badges and recommendations"
```

---

## Task 8: Learn Page (Orchestrator)

**Files:**
- Create: `app/learn/[videoId]/page.tsx`

This is the main page that ties Player + Overlay + Summary together.

**Step 1: Create the page**

```typescript
// app/learn/[videoId]/page.tsx
"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { getCheckpointConfig } from "../../../lib/checkpoint-questions";
import {
  createSession,
  pickQuestion,
  recordAnswer,
  advanceCheckpoint,
  type SessionState,
  type AnswerRecord,
} from "../../../lib/adaptive-engine";
import { AdaptiveQuizOverlay } from "../../../components/AdaptiveQuizOverlay";
import { SessionSummary } from "../../../components/SessionSummary";
import {
  createAdaptiveSession,
  completeAdaptiveSession,
} from "../../../lib/adaptive-persistence";
import type { CheckpointQuestion } from "../../../lib/checkpoint-questions";

// Import video compositions (same as main page)
import { DynamicProcessingRevision } from "../../../compositions/DynamicProcessingRevision";
import { SynthesisRevision } from "../../../compositions/SynthesisRevision";
import { WaveformExplainer } from "../../../compositions/WaveformExplainer";
import { WaveformExamTips } from "../../../compositions/WaveformExamTips";
import { EQExplainer } from "../../../compositions/EQExplainer";

// Video component + duration registry
const videoRegistry: Record<
  string,
  { component: React.FC; durationInFrames: number; title: string }
> = {
  "dynamic-processing-revision": {
    component: DynamicProcessingRevision,
    durationInFrames: 2700,
    title: "Dynamic Processing",
  },
  "synthesis-revision": {
    component: SynthesisRevision,
    durationInFrames: 3240,
    title: "Synthesis Fundamentals",
  },
  waveforms: {
    component: WaveformExplainer,
    durationInFrames: 1450,
    title: "Waveforms",
  },
  examtips: {
    component: WaveformExamTips,
    durationInFrames: 3150,
    title: "Exam Tips",
  },
  eqexplainer: {
    component: EQExplainer,
    durationInFrames: 4805,
    title: "Equalisation",
  },
};

function LearnContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const videoId = params.videoId as string;
  const token = searchParams.get("token");

  const playerRef = useRef<PlayerRef>(null);
  const dbSessionIdRef = useRef<string | null>(null);
  const checkpointTriggeredRef = useRef<Set<number>>(new Set());

  const [session, setSession] = useState<SessionState>(createSession());
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<CheckpointQuestion | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const config = getCheckpointConfig(videoId);
  const video = videoRegistry[videoId];

  // Create DB session on mount
  useEffect(() => {
    if (!token || !config) return;
    createAdaptiveSession({
      studentToken: token,
      videoId,
      topic: config.topic,
    }).then((id) => {
      dbSessionIdRef.current = id;
    });
  }, [token, videoId, config]);

  // Frame change handler — check for checkpoints
  const handleFrameChange = useCallback(
    (e: { detail: { frame: number } }) => {
      if (!config || showOverlay || showSummary) return;

      const frame = e.detail.frame;
      const currentCp = session.currentCheckpoint;
      const checkpoint = config.checkpoints[currentCp];

      if (!checkpoint) return;

      // Trigger when we reach or pass the checkpoint frame (within 5 frame tolerance)
      if (
        frame >= checkpoint.frame &&
        frame < checkpoint.frame + 15 &&
        !checkpointTriggeredRef.current.has(currentCp)
      ) {
        checkpointTriggeredRef.current.add(currentCp);

        // Pause the player
        playerRef.current?.pause();

        // Pick a question
        const q = pickQuestion(config, session);
        if (q) {
          setCurrentQuestion(q);
          setShowOverlay(true);
        }
      }
    },
    [config, session, showOverlay, showSummary],
  );

  // Attach frame listener
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    // Remotion Player fires 'timeupdate' with frame info
    const handler = (e: Event) => {
      handleFrameChange(e as unknown as { detail: { frame: number } });
    };

    player.addEventListener("frameupdate", handler);
    return () => player.removeEventListener("frameupdate", handler);
  }, [handleFrameChange]);

  // Handle answer from overlay
  const handleAnswer = useCallback(
    (selectedIndex: number, correct: boolean, timeTakenMs: number) => {
      if (!config || !currentQuestion) return;

      const record: AnswerRecord = {
        checkpointIndex: session.currentCheckpoint,
        questionId: currentQuestion.id,
        difficulty: currentQuestion.difficulty,
        answer: selectedIndex,
        correct,
        timeTakenMs,
      };

      // Update session state
      let newSession = recordAnswer(session, record);
      newSession = advanceCheckpoint(newSession, config.totalCheckpoints);

      setSession(newSession);
      setShowOverlay(false);
      setCurrentQuestion(null);

      if (newSession.completed) {
        // Save to Supabase and show summary
        if (dbSessionIdRef.current) {
          completeAdaptiveSession(dbSessionIdRef.current, newSession);
        }
        setShowSummary(true);
      } else {
        // Resume video
        playerRef.current?.play();
      }
    },
    [config, currentQuestion, session],
  );

  const handleRestart = useCallback(() => {
    setSession(createSession());
    setShowOverlay(false);
    setShowSummary(false);
    setCurrentQuestion(null);
    checkpointTriggeredRef.current.clear();
    playerRef.current?.seekTo(0);
    playerRef.current?.play();

    // Create new DB session
    if (token && config) {
      createAdaptiveSession({
        studentToken: token,
        videoId,
        topic: config.topic,
      }).then((id) => {
        dbSessionIdRef.current = id;
      });
    }
  }, [token, videoId, config]);

  // --- Validation ---

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-2xl font-bold mb-4">Access Required</h1>
          <p className="text-slate-400">
            This page requires a personal access link. Please use the link provided by your teacher.
          </p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <h1 className="text-2xl font-bold mb-4">Video Not Found</h1>
          <p className="text-slate-400">This video ID doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <h1 className="text-2xl font-bold mb-4">No Checkpoints</h1>
          <p className="text-slate-400">
            Adaptive learning isn't available for this video yet. Try the library page instead.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  // --- Main render ---

  if (showSummary) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <header className="border-b border-slate-700 bg-slate-800/50">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">{video.title} — Results</h1>
            <p className="text-slate-400 text-sm">Adaptive Checkpoint Assessment</p>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">
          <SessionSummary
            session={session}
            topic={config.topic}
            onRestart={handleRestart}
            onBackToLibrary={() => router.push("/")}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{video.title}</h1>
              <p className="text-slate-400 text-sm">
                Adaptive Learning • {config.totalCheckpoints} checkpoints
              </p>
            </div>
            {/* Difficulty indicator */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">Difficulty:</span>
              <div className="flex gap-1">
                {[1, 2, 3].map((d) => (
                  <div
                    key={d}
                    style={{
                      width: "24px",
                      height: "8px",
                      borderRadius: "4px",
                      backgroundColor:
                        d <= session.currentDifficulty
                          ? ["", "#22c55e", "#f59e0b", "#ef4444"][d]
                          : "rgba(255,255,255,0.1)",
                      transition: "background-color 0.3s ease",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Player wrapper (relative, for absolute overlay) */}
        <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
          <Player
            ref={playerRef}
            component={video.component}
            durationInFrames={video.durationInFrames}
            fps={30}
            compositionWidth={1920}
            compositionHeight={1080}
            style={{
              width: "100%",
              aspectRatio: "16/9",
            }}
            controls
            autoPlay
            numberOfSharedAudioTags={10}
          />

          {/* Quiz overlay */}
          {showOverlay && currentQuestion && (
            <AdaptiveQuizOverlay
              question={currentQuestion}
              checkpointIndex={session.currentCheckpoint}
              totalCheckpoints={config.totalCheckpoints}
              currentDifficulty={session.currentDifficulty}
              onAnswer={handleAnswer}
            />
          )}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-3 mt-6">
          {config.checkpoints.map((cp, i) => {
            const answered = session.answers.some((a) => a.checkpointIndex === i);
            const correct = session.answers.find((a) => a.checkpointIndex === i)?.correct;
            const isCurrent = i === session.currentCheckpoint && !session.completed;

            return (
              <div
                key={i}
                title={cp.topicCovered}
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: answered
                    ? correct
                      ? "#22c55e"
                      : "#ef4444"
                    : isCurrent
                      ? "#3b82f6"
                      : "rgba(255,255,255,0.15)",
                  border: isCurrent ? "2px solid #93c5fd" : "2px solid transparent",
                  transition: "all 0.3s ease",
                }}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <LearnContent />
    </Suspense>
  );
}
```

**Step 2: Verify build**

```bash
npm run build
```

Expected: Build succeeds. Page available at `/learn/dynamic-processing-revision?token=xxx`.

**Step 3: Commit**

```bash
git add app/learn/\[videoId\]/page.tsx
git commit -m "feat: add /learn/[videoId] page with adaptive checkpoint assessment"
```

---

## Task 9: Add CSS Animation Keyframe

**Files:**
- Modify: `app/globals.css` (or `app/layout.tsx`)

The overlay uses `animation: fadeIn 0.3s ease-out`. Need the keyframe defined.

**Step 1: Add to global CSS**

Add to the end of `app/globals.css`:

```css
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

**Step 2: Commit**

```bash
git add app/globals.css
git commit -m "feat: add fadeIn keyframe for quiz overlay animation"
```

---

## Task 10: Manual Testing & Polish

**Step 1: Start dev server**

```bash
cd remotion-player-site && npm run dev
```

**Step 2: Open learn page**

Visit `http://localhost:3000/learn/dynamic-processing-revision?token=e7x9k2mw4p1q`

**Step 3: Test checklist**

- [ ] Video plays automatically
- [ ] At ~19s (frame 570), video pauses and overlay appears
- [ ] Question shown matches "WhatIsCompression" topic
- [ ] Selecting an option highlights it blue
- [ ] "Check Answer" reveals correct/incorrect + explanation
- [ ] After ~2s, overlay dismisses and video resumes
- [ ] At ~43s, next checkpoint triggers
- [ ] Getting 2 correct in a row → difficulty badge changes to "Advanced"
- [ ] Getting 2 wrong in a row → difficulty drops to "Foundation"
- [ ] After checkpoint 4, SessionSummary shows with level badge
- [ ] Level + score + breakdown renders correctly
- [ ] "Try Again" resets everything and replays from start
- [ ] "Back to Library" navigates to /
- [ ] Check Supabase: `SELECT * FROM adaptive_sessions` shows completed session

**Step 4: Fix any issues found during testing**

**Step 5: Final commit**

```bash
git add -A
git commit -m "polish: fix issues from manual testing"
```

---

## Summary of Files Created/Modified

| File | Action | Purpose |
|---|---|---|
| `lib/supabase.ts` | Create | Supabase client |
| `supabase/adaptive-sessions.sql` | Create | Table migration |
| `lib/checkpoint-questions.ts` | Create | Question bank with difficulty levels |
| `lib/adaptive-engine.ts` | Create | Pure-logic adaptive algorithm |
| `lib/adaptive-persistence.ts` | Create | Supabase read/write |
| `components/AdaptiveQuizOverlay.tsx` | Create | Quiz modal overlay |
| `components/SessionSummary.tsx` | Create | End-of-session results |
| `app/learn/[videoId]/page.tsx` | Create | Orchestrator page |
| `app/globals.css` | Modify | fadeIn keyframe |
| `package.json` | Modify | Add @supabase/supabase-js |

## Future Extension Points (Not in this plan)

- Add checkpoint configs for other videos (Synthesis, EQ, Waveforms)
- Add "short answer" question type to overlay (type-in, AI-graded)
- Show level badges on the library page (best level per video)
- Teacher dashboard: view all students' adaptive session results
- Spaced repetition across sessions (re-ask questions they got wrong last time)
