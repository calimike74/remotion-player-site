"use client";

import { Player } from "@remotion/player";
import { useState, useMemo } from "react";
import { DynamicProcessingRevision } from "../compositions/DynamicProcessingRevision";
import { SynthesisRevision } from "../compositions/SynthesisRevision";
import { WaveformExplainer } from "../compositions/WaveformExplainer";
import { WaveformExamTips } from "../compositions/WaveformExamTips";
import { EQExplainer } from "../compositions/EQExplainer";
import { ReverbVisualizer } from "../compositions/ReverbVisualizer";
// Dev tools (StyleShowcase, IconPreview, WaveformExplainerV2, ImageDemo, ImageDemo3D, LogoReveal, DemoShowcase, SoundFundamentals) hidden from production - not committed to git
// PersonalizedReview is now accessed via /review?token=xxx - not shown on main page

// Topic metadata with official Pearson Edexcel titles
const topicGroups: Record<string, { title: string; order: number }> = {
  "1.3": { title: "1.3 Synthesis", order: 1 },
  "1.7": { title: "1.7 Reverb & Room Acoustics", order: 2 },
  "1.9": { title: "1.9 Dynamic Processing", order: 3 },
  "1.11": { title: "1.11 Equalisation", order: 4 },
  "2.5": { title: "2.5 Numeracy", order: 5 },
};

const videos = [
  {
    id: "synthesis-revision",
    title: "Synthesis Fundamentals",
    subtitle: "Waveforms, ADSR & Filters",
    topic: "1.3",
    component: SynthesisRevision,
    durationInFrames: 3300,
    description: "Visual guide to synthesis: basic waveforms and their harmonic content, ADSR envelopes, and low-pass filter sweeps with resonance.",
  },
  {
    id: "reverb",
    title: "Reverb & Acoustics",
    subtitle: "Neon Cyber Edition",
    topic: "1.7",
    component: ReverbVisualizer,
    durationInFrames: 1800,
    description: "Explore reverb and room acoustics with stunning neon visuals. Covers RT60, impulse responses, frequency absorption, and reverb parameters.",
  },
  {
    id: "dynamic-processing-revision",
    title: "Dynamic Processing",
    subtitle: "Compression Fundamentals",
    topic: "1.9",
    component: DynamicProcessingRevision,
    durationInFrames: 2700,
    description: "Animated compression guide: I/O graphs, threshold, ratio comparisons (4:1, 10:1, limiting), attack/release on drum transients, and exam tips.",
  },
  {
    id: "eqexplainer",
    title: "Equalisation",
    subtitle: "Graphic vs Parametric EQ",
    topic: "1.11",
    component: EQExplainer,
    durationInFrames: 4805,
    description: "Compare graphic and parametric EQ: fixed bands vs flexible controls, Q factor, routing, and when to use each type.",
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
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(
    new Set(Object.keys(topicGroups))
  );

  // Group videos by topic and sort by topic order
  const groupedVideos = useMemo(() => {
    const groups: Record<string, typeof videos> = {};
    videos.forEach((video) => {
      if (!groups[video.topic]) {
        groups[video.topic] = [];
      }
      groups[video.topic].push(video);
    });

    // Sort by topic order
    return Object.entries(groups).sort(([a], [b]) => {
      const orderA = topicGroups[a]?.order ?? 999;
      const orderB = topicGroups[b]?.order ?? 999;
      return orderA - orderB;
    });
  }, []);

  const toggleTopic = (topic: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) {
        next.delete(topic);
      } else {
        next.add(topic);
      }
      return next;
    });
  };

  const allExpanded = expandedTopics.size === Object.keys(topicGroups).length;

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedTopics(new Set());
    } else {
      setExpandedTopics(new Set(Object.keys(topicGroups)));
    }
  };

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
            numberOfSharedAudioTags={10}
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

        {/* Video Library Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-300">Video Library</h3>
          <button
            onClick={toggleAll}
            className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1 rounded hover:bg-slate-800"
          >
            {allExpanded ? "Collapse All" : "Expand All"}
          </button>
        </div>

        {/* Grouped Video Selection */}
        <div className="space-y-4">
          {groupedVideos.map(([topic, topicVideos]) => {
            const isExpanded = expandedTopics.has(topic);
            const topicInfo = topicGroups[topic] || { title: `Topic ${topic}` };

            return (
              <div
                key={topic}
                className="border border-slate-700 rounded-lg overflow-hidden"
              >
                {/* Folder Header */}
                <button
                  onClick={() => toggleTopic(topic)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Folder Icon */}
                    <svg
                      className={`w-5 h-5 transition-colors ${
                        isExpanded ? "text-amber-400" : "text-slate-400"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                    <span className="font-semibold">{topicInfo.title}</span>
                    <span className="bg-slate-600 text-xs px-2 py-0.5 rounded-full">
                      {topicVideos.length} video{topicVideos.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {/* Chevron */}
                  <svg
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Collapsible Video Grid */}
                <div
                  className={`transition-all duration-200 ease-in-out overflow-hidden ${
                    isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-4 bg-slate-800/50 grid md:grid-cols-3 gap-4">
                    {topicVideos.map((video) => (
                      <button
                        key={video.id}
                        onClick={() => setSelectedVideo(video)}
                        className={`text-left p-4 rounded-lg border transition-all ${
                          selectedVideo.id === video.id
                            ? "bg-blue-600/20 border-blue-500"
                            : "bg-slate-800 border-slate-700 hover:border-slate-500"
                        }`}
                      >
                        <h4 className="font-semibold">{video.title}</h4>
                        <p className="text-sm text-slate-400">{video.subtitle}</p>
                        <p className="text-xs text-slate-500 mt-2">
                          {Math.round(video.durationInFrames / 30 / 60)}:
                          {String(
                            Math.round((video.durationInFrames / 30) % 60)
                          ).padStart(2, "0")}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
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
