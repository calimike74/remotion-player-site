"use client";

import { useState } from "react";
import { getAllTokens } from "../../../lib/student-tokens";

export default function TeacherTokensPage() {
  const tokens = getAllTokens();
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://remotion-player-site.vercel.app';

  const copyToClipboard = (token: string, name: string) => {
    const url = `${baseUrl}/review?token=${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const copyAllLinks = () => {
    const links = tokens.map(t => `${t.name}: ${baseUrl}/review?token=${t.token}`).join('\n');
    navigator.clipboard.writeText(links);
    setCopiedToken('all');
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="bg-red-600 text-xs font-bold px-2 py-1 rounded">TEACHER ONLY</span>
            <h1 className="text-2xl font-bold">Student Review Links</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">Personalized feedback videos for students needing support</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Instructions */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-3">How to use</h2>
          <ol className="text-slate-400 space-y-2 text-sm">
            <li>1. Click "Copy Link" next to a student's name</li>
            <li>2. Send the link privately to that student (email, Teams, etc.)</li>
            <li>3. Each link only shows that student's personalized video</li>
            <li>4. Students cannot access each other's reviews</li>
          </ol>
        </div>

        {/* Copy all button */}
        <div className="mb-6">
          <button
            onClick={copyAllLinks}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              copiedToken === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
          >
            {copiedToken === 'all' ? '✓ All Links Copied!' : 'Copy All Links'}
          </button>
        </div>

        {/* Token list */}
        <div className="space-y-4">
          {tokens.map((student) => (
            <div
              key={student.token}
              className="bg-slate-800 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{student.name}</h3>
                  <span className={`text-sm px-2 py-0.5 rounded ${
                    student.percentage === 0
                      ? 'bg-red-900/50 text-red-400'
                      : student.percentage <= 20
                      ? 'bg-orange-900/50 text-orange-400'
                      : 'bg-yellow-900/50 text-yellow-400'
                  }`}>
                    {student.percentage}%
                  </span>
                </div>
                <p className="text-slate-500 text-sm mt-1 font-mono">
                  /review?token={student.token}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(student.token, student.name)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  copiedToken === student.token
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {copiedToken === student.token ? '✓ Copied!' : 'Copy Link'}
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6">
          <h3 className="font-semibold mb-2">Summary</h3>
          <p className="text-slate-400 text-sm">
            <strong>{tokens.length} students</strong> need personalized review videos.
            All scored below 60% on the 2.5 Waveforms quiz.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-12 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-slate-500 text-sm">
          Do not share this page with students
        </div>
      </footer>
    </div>
  );
}
