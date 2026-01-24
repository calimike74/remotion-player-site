"use client";

import { Player } from "@remotion/player";
import { useState } from "react";
import { CompressionExplainer } from "../compositions/CompressionExplainer";
import { WaveformExplainer } from "../compositions/WaveformExplainer";
import { WaveformExamTips } from "../compositions/WaveformExamTips";

const videos = [
  {
    id: "compression",
    title: "Dynamic Processing",
    subtitle: "Understanding Compression",
    topic: "1.9",
    component: CompressionExplainer,
    durationInFrames: 1500,
    description: "Learn how compressors work with animated waveforms and clear explanations of threshold, ratio, attack, and release.",
  },
  {
    id: "waveforms",
    title: "Waveforms",
    subtitle: "Frequency, Period & Octaves",
    topic: "2.5",
    component: WaveformExplainer,
    durationInFrames: 1450,
    description: "Visual guide to understanding waveform properties, frequency relationships, and octave calculations.",
  },
  {
    id: "examtips",
    title: "Exam Tips",
    subtitle: "Common Waveform Mistakes",
    topic: "2.5",
    component: WaveformExamTips,
    durationInFrames: 3150,
    description: "Avoid common exam mistakes with worked examples for calculations, pitch vs amplitude, and axis labels.",
  },
];

export default function Home() {
  const [selectedVideo, setSelectedVideo] = useState(videos[0]);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Music Technology Resources</h1>
          <p className="text-slate-400 text-sm">A-Level Video Explainers</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Video Player */}
        <div className="bg-black rounded-lg overflow-hidden shadow-2xl mb-8">
          <Player
            component={selectedVideo.component}
            durationInFrames={selectedVideo.durationInFrames}
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

        {/* Current Video Info */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-blue-600 text-xs font-bold px-2 py-1 rounded">
              Topic {selectedVideo.topic}
            </span>
            <h2 className="text-2xl font-bold">{selectedVideo.title}</h2>
          </div>
          <p className="text-slate-400">{selectedVideo.description}</p>
        </div>

        {/* Video Selection */}
        <h3 className="text-lg font-semibold mb-4 text-slate-300">All Videos</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {videos.map((video) => (
            <button
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className={`text-left p-4 rounded-lg border transition-all ${
                selectedVideo.id === video.id
                  ? "bg-blue-600/20 border-blue-500"
                  : "bg-slate-800 border-slate-700 hover:border-slate-500"
              }`}
            >
              <span className="text-xs text-slate-400">Topic {video.topic}</span>
              <h4 className="font-semibold mt-1">{video.title}</h4>
              <p className="text-sm text-slate-400">{video.subtitle}</p>
              <p className="text-xs text-slate-500 mt-2">
                {Math.round(video.durationInFrames / 30 / 60)}:
                {String(Math.round((video.durationInFrames / 30) % 60)).padStart(2, "0")}
              </p>
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
          Built with Remotion and AI-generated narration
        </div>
      </footer>
    </div>
  );
}
