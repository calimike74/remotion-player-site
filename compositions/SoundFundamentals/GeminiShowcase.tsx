"use client";

import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Sequence,
  Easing,
} from "remotion";
import { Canvas } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

/**
 * GeminiShowcase - Cinematic presentation of AI-generated educational images
 *
 * Advanced techniques:
 * - 3D rotating carousel with Three.js
 * - Parallax depth layers
 * - Dramatic lighting and glow effects
 * - Ken Burns with animated callouts
 * - Particle backgrounds
 * - Glitch transitions
 *
 * Timeline (at 30fps):
 * - 0-150 (0-5s): Dramatic intro
 * - 150-450 (5-15s): 3D carousel showcase
 * - 450-750 (15-25s): Deep dive with callouts
 * - 750-1050 (25-35s): Parallax gallery
 * - 1050-1260 (35-42s): Cinematic outro
 */

const IMAGES = [
  {
    file: "Gemini_Generated_Image_8u6uyi8u6uyi8u6u.png",
    title: "Classic Audio Waveforms",
    subtitle: "The Four Pillars of Synthesis",
    description: "Sine, Square, Sawtooth, Triangle",
    color: "#06b6d4",
    callouts: [
      { text: "Sine Wave", subtext: "Pure fundamental tone", x: 20, y: 25, color: "#06b6d4" },
      { text: "Square Wave", subtext: "Rich in odd harmonics", x: 75, y: 25, color: "#8b5cf6" },
    ],
  },
  {
    file: "Gemini_Generated_Image_f5jlbjf5jlbjf5jl.png",
    title: "Digital Audio Clipping",
    subtitle: "The Danger Zone",
    description: "When amplitude exceeds ±1.0",
    color: "#ef4444",
    callouts: [
      { text: "Clipped Peak", subtext: "Distortion occurs here", x: 50, y: 20, color: "#ef4444" },
      { text: "Headroom", subtext: "Safe operating level", x: 30, y: 70, color: "#22c55e" },
    ],
  },
  {
    file: "Gemini_Generated_Image_t4s2h1t4s2h1t4s2.png",
    title: "The Decibel Scale",
    subtitle: "The Golden Rule",
    description: "Every 6 dB = Double or Half",
    color: "#8b5cf6",
    callouts: [
      { text: "+6 dB", subtext: "Double amplitude", x: 65, y: 30, color: "#8b5cf6" },
      { text: "-6 dB", subtext: "Half amplitude", x: 35, y: 60, color: "#f97316" },
    ],
  },
  {
    file: "Gemini_Generated_Image_m87btom87btom87b.png",
    title: "Compression & Rarefaction",
    subtitle: "How Sound Travels",
    description: "Air molecules in motion",
    color: "#10b981",
    callouts: [
      { text: "Compression", subtext: "High pressure zone", x: 25, y: 40, color: "#10b981" },
      { text: "Rarefaction", subtext: "Low pressure zone", x: 70, y: 40, color: "#06b6d4" },
    ],
  },
];

export const GeminiShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const finalFade = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
      }}
    >
      <AbsoluteFill style={{ opacity: finalFade }}>
        {/* Scene 1: Dramatic Intro */}
        <Sequence from={0} durationInFrames={150}>
          <IntroScene />
        </Sequence>

        {/* Scene 2: 3D Carousel */}
        <Sequence from={150} durationInFrames={300}>
          <CarouselScene />
        </Sequence>

        {/* Scene 3: Deep Dive with Callouts */}
        <Sequence from={450} durationInFrames={300}>
          <DeepDiveScene />
        </Sequence>

        {/* Scene 4: Parallax Gallery */}
        <Sequence from={750} durationInFrames={300}>
          <ParallaxGallery />
        </Sequence>

        {/* Scene 5: Cinematic Outro */}
        <Sequence from={1050} durationInFrames={210}>
          <OutroScene />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================
// Scene 1: Dramatic Intro with particle background
// ============================================
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines = [
    { text: "AI-Generated", delay: 0 },
    { text: "Educational Visuals", delay: 20, highlight: true },
  ];

  const badges = [
    { text: "Google Gemini", color: "#4285f4", delay: 60 },
    { text: "A-Level Music Tech", color: "#8b5cf6", delay: 80 },
  ];

  const exitOpacity = interpolate(frame, [120, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1e3f 50%, #0f172a 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 30,
        opacity: exitOpacity,
      }}
    >
      {/* Animated particles */}
      <ParticleField frame={frame} count={30} fps={fps} />

      {/* Glowing orbs */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,70,229,0.3) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: `pulse ${frame * 0.05}s`,
          transform: `scale(${1 + Math.sin(frame * 0.05) * 0.2})`,
        }}
      />

      {/* Main title */}
      <div style={{ textAlign: "center", zIndex: 10 }}>
        {lines.map((line, i) => {
          const progress = spring({
            frame: frame - line.delay,
            fps,
            config: { damping: 12 },
          });
          return (
            <div
              key={i}
              style={{
                fontSize: line.highlight ? 100 : 48,
                fontWeight: line.highlight ? 800 : 400,
                color: line.highlight ? "#60a5fa" : "#ffffff",
                transform: `translateY(${interpolate(progress, [0, 1], [50, 0])}px)`,
                opacity: progress,
                textShadow: line.highlight
                  ? "0 0 80px rgba(96, 165, 250, 0.8), 0 0 120px rgba(96, 165, 250, 0.4)"
                  : "none",
                letterSpacing: line.highlight ? 4 : 2,
              }}
            >
              {line.text}
            </div>
          );
        })}
      </div>

      {/* Badges */}
      <div style={{ display: "flex", gap: 24, zIndex: 10 }}>
        {badges.map((badge) => {
          const progress = spring({
            frame: frame - badge.delay,
            fps,
            config: { damping: 15 },
          });
          return (
            <div
              key={badge.text}
              style={{
                padding: "14px 28px",
                background: `${badge.color}20`,
                border: `2px solid ${badge.color}`,
                borderRadius: 30,
                color: badge.color,
                fontWeight: 600,
                fontSize: 18,
                transform: `scale(${progress})`,
                opacity: progress,
                boxShadow: `0 0 30px ${badge.color}40`,
              }}
            >
              {badge.text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// Scene 2: 3D Carousel
// ============================================
const CarouselScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 15 } });

  const exitOpacity = interpolate(frame, [260, 300], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#0a0a0a", opacity: exitOpacity }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <spotLight position={[0, 10, 10]} angle={0.3} intensity={1.5} color="#ffffff" />
        <pointLight position={[-8, 0, 5]} intensity={0.8} color="#4f46e5" />
        <pointLight position={[8, 0, 5]} intensity={0.8} color="#06b6d4" />
        <pointLight position={[0, -5, 5]} intensity={0.5} color="#10b981" />
        <Suspense fallback={null}>
          <ImageCarousel3D frame={frame} />
        </Suspense>
      </Canvas>

      {/* Overlay text */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `translateY(${interpolate(titleProgress, [0, 1], [-30, 0])}px)`,
          opacity: titleProgress,
        }}
      >
        <h2
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
            textShadow: "0 0 60px rgba(79, 70, 229, 0.8)",
          }}
        >
          Four Core Concepts
        </h2>
        <p style={{ fontSize: 24, color: "rgba(255,255,255,0.6)", marginTop: 12 }}>
          Visualized by AI for instant understanding
        </p>
      </div>

      {/* Glow effect at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: "linear-gradient(to top, rgba(79,70,229,0.2) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// 3D Carousel component
const ImageCarousel3D: React.FC<{ frame: number }> = ({ frame }) => {
  const groupRef = useRef<THREE.Group>(null);
  const rotation = frame * 0.008;

  const imagePaths = IMAGES.map((img) => `/assets/Chrome+NBLM/${img.file}`);

  return (
    <group ref={groupRef} rotation={[0.15, rotation, 0]} position={[0, -0.5, 0]}>
      {imagePaths.map((img, i) => {
        const angle = (i / imagePaths.length) * Math.PI * 2;
        const radius = 5;
        const hover = Math.sin(frame * 0.05 + i) * 0.2;
        return (
          <CarouselCard
            key={img}
            position={[Math.sin(angle) * radius, hover, Math.cos(angle) * radius]}
            rotation={[0, -angle + Math.PI, 0]}
            imagePath={img}
            color={IMAGES[i].color}
          />
        );
      })}
    </group>
  );
};

const CarouselCard: React.FC<{
  position: [number, number, number];
  rotation: [number, number, number];
  imagePath: string;
  color: string;
}> = ({ position, rotation, imagePath, color }) => {
  const texture = useTexture(imagePath);
  return (
    <group position={position} rotation={rotation}>
      {/* Glow plane behind */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[4.2, 2.8]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      {/* Main image */}
      <mesh>
        <planeGeometry args={[4, 2.5]} />
        <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// ============================================
// Scene 3: Deep Dive with Ken Burns + Callouts
// ============================================
const DeepDiveScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cycle through images
  const imageIndex = Math.min(Math.floor(frame / 75), IMAGES.length - 1);
  const frameInImage = frame % 75;
  const currentImage = IMAGES[imageIndex];

  // Ken Burns
  const kenBurnsScale = interpolate(frameInImage, [0, 75], [1, 1.15], { extrapolateRight: "clamp" });
  const kenBurnsX = interpolate(frameInImage, [0, 75], [0, -15], { extrapolateRight: "clamp" });

  // Entry animation
  const entryProgress = spring({ frame: frameInImage, fps, config: { damping: 15 } });

  // Exit
  const exitOpacity = interpolate(frame, [260, 300], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Image transition
  const imageOpacity = interpolate(
    frameInImage,
    [0, 10, 65, 75],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: "#0f0f1a",
        display: "flex",
        opacity: exitOpacity,
      }}
    >
      {/* Left: Image with Ken Burns and Callouts */}
      <div
        style={{
          flex: 1.3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
          position: "relative",
        }}
      >
        <div
          style={{
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: `0 30px 100px rgba(0,0,0,0.5), 0 0 60px ${currentImage.color}30`,
            border: `3px solid ${currentImage.color}40`,
            opacity: imageOpacity,
            position: "relative",
          }}
        >
          <Img
            src={staticFile(`assets/Chrome+NBLM/${currentImage.file}`)}
            style={{
              width: 800,
              height: "auto",
              display: "block",
              transform: `scale(${kenBurnsScale}) translateX(${kenBurnsX}px)`,
            }}
          />

          {/* Callouts */}
          {currentImage.callouts.map((callout, i) => {
            const calloutProgress = spring({
              frame: frameInImage - 20 - i * 10,
              fps,
              config: { damping: 12 },
            });
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${callout.x}%`,
                  top: `${callout.y}%`,
                  transform: `translate(-50%, -50%) scale(${calloutProgress})`,
                  opacity: calloutProgress,
                  background: "rgba(0,0,0,0.85)",
                  padding: "10px 16px",
                  borderRadius: 8,
                  borderLeft: `4px solid ${callout.color}`,
                  boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 20px ${callout.color}40`,
                }}
              >
                <div style={{ fontWeight: 700, color: callout.color, fontSize: 16 }}>
                  {callout.text}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                  {callout.subtext}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Text info */}
      <div
        style={{
          flex: 0.7,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px 60px 0",
          gap: 20,
        }}
      >
        <div
          style={{
            transform: `translateX(${interpolate(entryProgress, [0, 1], [30, 0])}px)`,
            opacity: imageOpacity,
          }}
        >
          <span
            style={{
              color: currentImage.color,
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            {currentImage.subtitle}
          </span>
        </div>

        <h2
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "#ffffff",
            margin: 0,
            lineHeight: 1.1,
            opacity: imageOpacity,
            textShadow: `0 0 40px ${currentImage.color}50`,
          }}
        >
          {currentImage.title}
        </h2>

        <p
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.7)",
            margin: 0,
            opacity: imageOpacity,
          }}
        >
          {currentImage.description}
        </p>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: 8, marginTop: 30 }}>
          {IMAGES.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === imageIndex ? 30 : 10,
                height: 10,
                borderRadius: 5,
                background: i === imageIndex ? IMAGES[i].color : "rgba(255,255,255,0.3)",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Decorative glow */}
      <div
        style={{
          position: "absolute",
          top: 100,
          right: 100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${currentImage.color}30, transparent)`,
          filter: "blur(80px)",
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================
// Scene 4: Parallax Gallery
// ============================================
const ParallaxGallery: React.FC = () => {
  const frame = useCurrentFrame();

  // Parallax movement
  const moveX = Math.sin(frame * 0.025) * 50;
  const moveY = Math.cos(frame * 0.02) * 30;

  const exitOpacity = interpolate(frame, [260, 300], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0f172a 0%, #1e1e3f 50%, #0f172a 100%)",
        perspective: "1200px",
        overflow: "hidden",
        opacity: exitOpacity,
      }}
    >
      {/* Far layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${moveX * 0.1}px, ${moveY * 0.1}px)`,
          opacity: 0.4,
        }}
      >
        <Img
          src={staticFile(`assets/Chrome+NBLM/${IMAGES[3].file}`)}
          style={{
            width: 400,
            borderRadius: 16,
            position: "absolute",
            top: "10%",
            left: "5%",
            boxShadow: `0 20px 60px rgba(0,0,0,0.3), 0 0 40px ${IMAGES[3].color}20`,
          }}
        />
      </div>

      {/* Mid-far layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${moveX * 0.25}px, ${moveY * 0.25}px)`,
          opacity: 0.6,
        }}
      >
        <Img
          src={staticFile(`assets/Chrome+NBLM/${IMAGES[2].file}`)}
          style={{
            width: 350,
            borderRadius: 12,
            position: "absolute",
            top: "50%",
            right: "8%",
            boxShadow: `0 20px 60px rgba(0,0,0,0.3), 0 0 40px ${IMAGES[2].color}20`,
          }}
        />
      </div>

      {/* Mid-near layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${moveX * 0.45}px, ${moveY * 0.45}px)`,
          opacity: 0.8,
        }}
      >
        <Img
          src={staticFile(`assets/Chrome+NBLM/${IMAGES[1].file}`)}
          style={{
            width: 450,
            borderRadius: 12,
            position: "absolute",
            bottom: "15%",
            left: "15%",
            boxShadow: `0 30px 80px rgba(0,0,0,0.4), 0 0 50px ${IMAGES[1].color}30`,
          }}
        />
      </div>

      {/* Near layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${moveX * 0.7}px, ${moveY * 0.7}px)`,
        }}
      >
        <Img
          src={staticFile(`assets/Chrome+NBLM/${IMAGES[0].file}`)}
          style={{
            width: 550,
            borderRadius: 8,
            position: "absolute",
            top: "20%",
            right: "20%",
            boxShadow: `0 40px 100px rgba(0,0,0,0.5), 0 0 60px ${IMAGES[0].color}40`,
          }}
        />
      </div>

      {/* Center text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) translate(${moveX * 0.9}px, ${moveY * 0.9}px)`,
          zIndex: 100,
        }}
      >
        <h2
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#fff",
            textShadow: "0 0 80px rgba(79, 70, 229, 1), 0 4px 30px rgba(0,0,0,0.8)",
            textAlign: "center",
            letterSpacing: 2,
          }}
        >
          Depth & Motion
        </h2>
        <p
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.8)",
            textAlign: "center",
            marginTop: 16,
            textShadow: "0 2px 20px rgba(0,0,0,0.8)",
          }}
        >
          Every concept finds its visual form
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// Scene 5: Cinematic Outro
// ============================================
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 12 } });

  const tools = [
    { name: "Google Gemini", color: "#4285f4", delay: 30 },
    { name: "Remotion", color: "#06b6d4", delay: 50 },
    { name: "Claude Code", color: "#f97316", delay: 70 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1e3f 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 40,
      }}
    >
      {/* Particle field */}
      <ParticleField frame={frame} count={25} fps={fps} />

      {/* Main title */}
      <h2
        style={{
          fontSize: 64,
          fontWeight: 800,
          color: "#ffffff",
          margin: 0,
          transform: `scale(${titleProgress})`,
          opacity: titleProgress,
          textShadow: "0 0 60px rgba(139, 92, 246, 0.6)",
          zIndex: 10,
        }}
      >
        AI-Powered Education
      </h2>

      <p
        style={{
          fontSize: 28,
          color: "rgba(255,255,255,0.7)",
          margin: 0,
          opacity: titleProgress,
          zIndex: 10,
        }}
      >
        Visual learning materials created in minutes
      </p>

      {/* Tool badges */}
      <div style={{ display: "flex", gap: 24, marginTop: 20, zIndex: 10 }}>
        {tools.map((tool) => {
          const progress = spring({
            frame: frame - tool.delay,
            fps,
            config: { damping: 12 },
          });
          return (
            <div
              key={tool.name}
              style={{
                padding: "14px 28px",
                background: tool.color,
                borderRadius: 12,
                color: "#fff",
                fontWeight: 700,
                fontSize: 20,
                transform: `scale(${progress})`,
                opacity: progress,
                boxShadow: `0 10px 40px ${tool.color}50`,
              }}
            >
              {tool.name}
            </div>
          );
        })}
      </div>

      {/* Glowing orb */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)",
          filter: "blur(80px)",
          transform: `scale(${1 + Math.sin(frame * 0.05) * 0.15})`,
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================
// Reusable Particle Field
// ============================================
const ParticleField: React.FC<{ frame: number; count: number; fps: number }> = ({
  frame,
  count,
  fps,
}) => {
  return (
    <>
      {[...Array(count)].map((_, i) => {
        // Deterministic positioning
        const seed = (i * 137.5) % 1;
        const seed2 = ((i + 7) * 251.3) % 1;
        const seed3 = ((i + 13) * 89.7) % 1;
        const x = (seed - 0.5) * 1800;
        const y = (seed2 - 0.5) * 1000;
        const delay = seed3 * 40;
        const hue = 220 + i * 3;
        const progress = spring({
          frame: frame - delay,
          fps,
          config: { damping: 25 },
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 3 + (i % 3),
              height: 3 + (i % 3),
              borderRadius: "50%",
              background: `hsl(${hue}, 70%, 60%)`,
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              opacity: progress * 0.5,
              boxShadow: `0 0 ${8 + (i % 5)}px hsl(${hue}, 70%, 60%)`,
            }}
          />
        );
      })}
    </>
  );
};
