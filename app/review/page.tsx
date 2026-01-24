"use client";

import { Player } from "@remotion/player";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { validateToken } from "../../lib/student-tokens";
import { ModularReview, calculateVideoDuration } from "../../compositions/ModularReview";
import { getStudentErrors, errorSegments, ErrorType } from "../../lib/error-segments";

function ReviewContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // No token provided
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

  // Validate the token
  const studentData = validateToken(token);

  // Invalid token
  if (!studentData) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-2xl font-bold mb-4">Invalid Link</h1>
          <p className="text-slate-400">
            This access link is not valid or has expired. Please contact your teacher for a new link.
          </p>
        </div>
      </div>
    );
  }

  // Get student's specific errors
  const errors = getStudentErrors({
    q1Score: studentData.q1Score,
    q1MaxScore: studentData.q1MaxScore,
    q1Answer: studentData.q1Answer,
    q2Score: studentData.q2Score,
    q2MaxScore: studentData.q2MaxScore,
    q2Answer: studentData.q2Answer,
  });

  // Calculate video duration based on errors
  const videoDuration = calculateVideoDuration(errors);
  const videoMinutes = Math.floor(videoDuration / 30 / 60);
  const videoSeconds = Math.round((videoDuration / 30) % 60);

  // Get error titles for display
  const getErrorTitle = (errorType: ErrorType): string => {
    return errorSegments[errorType].title;
  };

  // Valid token - show modular review video
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Your Personalized Review</h1>
          <p className="text-slate-400 text-sm">Topic 2.5 Waveforms • {studentData.name}</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome message */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2">Hi {studentData.name} 👋</h2>
          <p className="text-slate-400">
            This video has been created specifically for you based on your recent quiz results.
            It focuses on {errors.length} key concept{errors.length !== 1 ? 's' : ''} that need attention.
          </p>
          <div className="mt-4 flex items-center gap-4">
            <div className="bg-slate-700 rounded-lg px-4 py-2">
              <span className="text-slate-400 text-sm">Your Score</span>
              <div className="text-2xl font-bold text-orange-400">
                {studentData.totalScore}/{studentData.maxScore} ({studentData.percentage}%)
              </div>
            </div>
            <div className="bg-slate-700 rounded-lg px-4 py-2">
              <span className="text-slate-400 text-sm">Video Length</span>
              <div className="text-lg font-semibold text-blue-400">
                {videoMinutes}:{String(videoSeconds).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>

        {/* Video Player */}
        <div className="bg-black rounded-lg overflow-hidden shadow-2xl mb-8">
          <Player
            component={ModularReview}
            inputProps={{
              studentData: {
                name: studentData.name,
                q1Score: studentData.q1Score,
                q1MaxScore: studentData.q1MaxScore,
                q1Answer: studentData.q1Answer,
                q2Score: studentData.q2Score,
                q2MaxScore: studentData.q2MaxScore,
                q2Answer: studentData.q2Answer,
                totalScore: studentData.totalScore,
                maxScore: studentData.maxScore,
                percentage: studentData.percentage,
              }
            }}
            durationInFrames={videoDuration}
            fps={30}
            compositionWidth={1920}
            compositionHeight={1080}
            style={{
              width: "100%",
              aspectRatio: "16/9",
            }}
            controls
            autoPlay={false}
          />
        </div>

        {/* Topics covered */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Topics Covered in Your Video</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {errors.map((error) => (
              <div
                key={error}
                className="flex items-center gap-3 bg-slate-700 rounded-lg p-3"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {errors.indexOf(error) + 1}
                </div>
                <span className="text-slate-200">{getErrorTitle(error)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key takeaways */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Key Points to Remember</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {(errors.includes('cycle-half') || errors.includes('cycle-vague') || errors.includes('cycle-frequency')) && (
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="text-orange-400 font-semibold mb-2">📚 Cycle Definition</div>
                <p className="text-slate-300 text-sm">
                  A cycle is one complete oscillation — from zero, up to peak, down through trough, and back to zero.
                </p>
              </div>
            )}
            {errors.includes('cycle-frequency') && (
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="text-purple-400 font-semibold mb-2">🔢 Frequency</div>
                <p className="text-slate-300 text-sm">
                  Frequency = number of cycles per second, measured in <span className="text-purple-400 font-bold">Hertz (Hz)</span>
                </p>
              </div>
            )}
            {errors.includes('pitch-loudness') && (
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="text-pink-400 font-semibold mb-2">🎵 Pitch vs Loudness</div>
                <p className="text-slate-300 text-sm">
                  <span className="text-pink-400">Frequency → Pitch</span> (high/low) •{' '}
                  <span className="text-pink-400">Amplitude → Loudness</span> (quiet/loud)
                </p>
              </div>
            )}
            {errors.includes('hearing-range') && (
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="text-green-400 font-semibold mb-2">👂 Human Hearing Range</div>
                <p className="text-slate-300 text-sm">
                  <span className="text-green-400 font-bold">20Hz to 20kHz</span> — memorise this, it appears in almost every exam!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-12 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-500 text-sm">
          Personalized feedback • A-Level Music Technology
        </div>
      </footer>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    }>
      <ReviewContent />
    </Suspense>
  );
}
