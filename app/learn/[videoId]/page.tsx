"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { getCheckpointConfig } from "../../../lib/checkpoint-questions";
import type { CheckpointQuestion } from "../../../lib/checkpoint-questions";
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

// Import video compositions
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

  // Use refs for values needed in the frame listener to avoid stale closures
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const showOverlayRef = useRef(showOverlay);
  showOverlayRef.current = showOverlay;
  const showSummaryRef = useRef(showSummary);
  showSummaryRef.current = showSummary;

  // Attach frame listener — stable callback via refs
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !config) return;

    const handler = (e: { detail: { frame: number } }) => {
      if (showOverlayRef.current || showSummaryRef.current) return;

      const frame = e.detail.frame;
      const currentCp = sessionRef.current.currentCheckpoint;
      const checkpoint = config.checkpoints[currentCp];

      if (!checkpoint) return;

      // Trigger when we reach the checkpoint frame (within a small window)
      if (
        frame >= checkpoint.frame &&
        frame < checkpoint.frame + 15 &&
        !checkpointTriggeredRef.current.has(currentCp)
      ) {
        checkpointTriggeredRef.current.add(currentCp);

        // Pause the player
        player.pause();

        // Pick a question
        const q = pickQuestion(config, sessionRef.current);
        if (q) {
          setCurrentQuestion(q);
          setShowOverlay(true);
        }
      }
    };

    player.addEventListener("frameupdate", handler);
    return () => player.removeEventListener("frameupdate", handler);
  }, [config]);

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
          <p className="text-slate-400">This video ID doesn&apos;t exist.</p>
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
            Adaptive learning isn&apos;t available for this video yet. Try the library page instead.
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
                Adaptive Learning &bull; {config.totalCheckpoints} checkpoints
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
