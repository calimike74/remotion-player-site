"use client";

import { Player } from "@remotion/player";
import { Epic3DHearingRange } from "../../compositions/ModularReview/Epic3DHearingRange";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-slate-800 bg-black/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Epic 3D Visual Demo</h1>
          <p className="text-slate-400 text-sm">React Three Fiber + Remotion</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-black rounded-lg overflow-hidden shadow-2xl border border-slate-800">
          <Player
            component={Epic3DHearingRange}
            durationInFrames={630}
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

        <div className="mt-8 bg-slate-900 rounded-lg p-6 border border-slate-800">
          <h3 className="text-lg font-semibold mb-4">What's in this demo</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-green-400 font-semibold mb-2">🎛️ 3D Frequency Spectrum</div>
              <p className="text-slate-400">50 animated bars in a circle, each representing a frequency band</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-blue-400 font-semibold mb-2">🎥 Cinematic Camera</div>
              <p className="text-slate-400">Dynamic camera movement - zooms in, then slowly orbits</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-purple-400 font-semibold mb-2">✨ 800 Particles</div>
              <p className="text-slate-400">Slowly rotating star field surrounding the scene</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-cyan-400 font-semibold mb-2">💫 Pulse Rings</div>
              <p className="text-slate-400">Expanding rings from the center</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-yellow-400 font-semibold mb-2">💡 Dynamic Lighting</div>
              <p className="text-slate-400">Multiple colored point lights + spotlight</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-pink-400 font-semibold mb-2">🔤 Neon Text</div>
              <p className="text-slate-400">Glowing text with dramatic shadows</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
