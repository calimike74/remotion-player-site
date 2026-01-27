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
 * SlideDeck - Cinematic NotebookLM slides presentation
 *
 * Advanced techniques:
 * - 3D floating cards with depth
 * - Dynamic lighting and glow effects
 * - Ken Burns on each slide
 * - Particle backgrounds
 * - 3D flip transitions
 * - Parallax depth effects
 *
 * 15 slides from Sound_Synthesis_Fundamentals.pdf
 * Total: ~75 seconds
 */

const SLIDES = [
  { page: 1, title: "Sound Wave Fundamentals", color: "#8b5cf6" },
  { page: 2, title: "The Invisible Medium", color: "#06b6d4" },
  { page: 3, title: "The Cycle", color: "#10b981" },
  { page: 4, title: "Frequency vs Period", color: "#f97316" },
  { page: 5, title: "The Reciprocal Rule", color: "#ef4444" },
  { page: 6, title: "Human Hearing Range", color: "#8b5cf6" },
  { page: 7, title: "Dimension 2: Intensity", color: "#06b6d4" },
  { page: 8, title: "The Digital Box", color: "#10b981" },
  { page: 9, title: "The Danger Zone: Clipping", color: "#ef4444" },
  { page: 10, title: "Thinking in Decibels", color: "#f97316" },
  { page: 11, title: "The Golden Rules of Mixing", color: "#8b5cf6" },
  { page: 12, title: "Dimension 3: Shape (Timbre)", color: "#06b6d4" },
  { page: 13, title: "The Four Pillars of Synthesis", color: "#10b981" },
  { page: 14, title: "Breaking Symmetry: Duty Cycle", color: "#f97316" },
  { page: 15, title: "The Producer's Triad", color: "#8b5cf6" },
];

const FRAMES_PER_SLIDE = 120; // 4 seconds per slide
const INTRO_FRAMES = 180;
const OUTRO_FRAMES = 180;

export const SlideDeck: React.FC = () => {
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
        {/* Dramatic Intro */}
        <Sequence from={0} durationInFrames={INTRO_FRAMES}>
          <IntroScene />
        </Sequence>

        {/* 3D Carousel Preview of All Slides */}
        <Sequence from={INTRO_FRAMES} durationInFrames={300}>
          <CarouselPreview />
        </Sequence>

        {/* Main Slides with cinematic presentation */}
        {SLIDES.map((slide, index) => {
          const startFrame = INTRO_FRAMES + 300 + index * FRAMES_PER_SLIDE;
          return (
            <Sequence key={index} from={startFrame} durationInFrames={FRAMES_PER_SLIDE}>
              <CinematicSlide
                slideNumber={slide.page}
                title={slide.title}
                accentColor={slide.color}
                slideIndex={index}
                totalSlides={SLIDES.length}
              />
            </Sequence>
          );
        })}

        {/* Cinematic Outro */}
        <Sequence
          from={INTRO_FRAMES + 300 + SLIDES.length * FRAMES_PER_SLIDE}
          durationInFrames={OUTRO_FRAMES}
        >
          <OutroScene />
        </Sequence>
      </AbsoluteFill>

      {/* Global progress indicator */}
      <ProgressBar frame={frame} totalFrames={durationInFrames} />
    </AbsoluteFill>
  );
};

// ============================================
// Dramatic Intro
// ============================================
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines = [
    { text: "Sound Synthesis", delay: 0 },
    { text: "Fundamentals", delay: 20, highlight: true },
  ];

  const badges = [
    { text: "NotebookLM", color: "#8b5cf6", delay: 70 },
    { text: "A-Level Music Technology", color: "#06b6d4", delay: 90 },
  ];

  const exitOpacity = interpolate(frame, [150, 180], [1, 0], {
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
      {/* Particle field */}
      <ParticleField frame={frame} count={35} fps={fps} />

      {/* Glowing orbs */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)",
          filter: "blur(80px)",
          transform: `scale(${1 + Math.sin(frame * 0.04) * 0.2})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "20%",
          top: "30%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)",
          filter: "blur(60px)",
          transform: `scale(${1 + Math.cos(frame * 0.05) * 0.15})`,
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
                fontSize: line.highlight ? 120 : 56,
                fontWeight: line.highlight ? 800 : 400,
                color: line.highlight ? "#a78bfa" : "#ffffff",
                transform: `translateY(${interpolate(progress, [0, 1], [60, 0])}px)`,
                opacity: progress,
                textShadow: line.highlight
                  ? "0 0 100px rgba(167, 139, 250, 0.8), 0 0 150px rgba(167, 139, 250, 0.4)"
                  : "none",
                letterSpacing: line.highlight ? 6 : 2,
              }}
            >
              {line.text}
            </div>
          );
        })}
      </div>

      {/* Subtitle */}
      <p
        style={{
          fontSize: 28,
          color: "rgba(255,255,255,0.6)",
          marginTop: 20,
          zIndex: 10,
          opacity: spring({ frame: frame - 40, fps, config: { damping: 15 } }),
        }}
      >
        15 Essential Concepts for Audio Production
      </p>

      {/* Badges */}
      <div style={{ display: "flex", gap: 24, zIndex: 10, marginTop: 30 }}>
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
                boxShadow: `0 0 40px ${badge.color}40`,
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
// 3D Carousel Preview
// ============================================
const CarouselPreview: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 15 } });

  const exitOpacity = interpolate(frame, [260, 300], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#0a0a0a", opacity: exitOpacity }}>
      <Canvas camera={{ position: [0, 0, 14], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <spotLight position={[0, 15, 15]} angle={0.3} intensity={1.5} />
        <pointLight position={[-10, 0, 5]} intensity={0.6} color="#8b5cf6" />
        <pointLight position={[10, 0, 5]} intensity={0.6} color="#06b6d4" />
        <Suspense fallback={null}>
          <SlideCarousel3D frame={frame} />
        </Suspense>
      </Canvas>

      {/* Overlay title */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `translateY(${interpolate(titleProgress, [0, 1], [-30, 0])}px)`,
          opacity: titleProgress,
        }}
      >
        <h2
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
            textShadow: "0 0 60px rgba(139, 92, 246, 0.8)",
          }}
        >
          15 Essential Topics
        </h2>
        <p style={{ fontSize: 22, color: "rgba(255,255,255,0.6)", marginTop: 10 }}>
          A complete journey through sound synthesis
        </p>
      </div>

      {/* Bottom glow */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: "linear-gradient(to top, rgba(139,92,246,0.15) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// 3D Slide Carousel
const SlideCarousel3D: React.FC<{ frame: number }> = ({ frame }) => {
  const groupRef = useRef<THREE.Group>(null);
  const rotation = frame * 0.006;

  // Show first 8 slides in carousel for visual impact
  const slideSubset = SLIDES.slice(0, 8);

  return (
    <group ref={groupRef} rotation={[0.1, rotation, 0]} position={[0, -1, 0]}>
      {slideSubset.map((slide, i) => {
        const angle = (i / slideSubset.length) * Math.PI * 2;
        const radius = 7;
        const hover = Math.sin(frame * 0.04 + i * 0.5) * 0.3;
        return (
          <SlideCard3D
            key={slide.page}
            position={[Math.sin(angle) * radius, hover, Math.cos(angle) * radius]}
            rotation={[0, -angle + Math.PI, 0]}
            slideNumber={slide.page}
            color={slide.color}
          />
        );
      })}
    </group>
  );
};

const SlideCard3D: React.FC<{
  position: [number, number, number];
  rotation: [number, number, number];
  slideNumber: number;
  color: string;
}> = ({ position, rotation, slideNumber, color }) => {
  const texture = useTexture(`/assets/Chrome+NBLM/slide_${String(slideNumber).padStart(2, "0")}.png`);
  return (
    <group position={position} rotation={rotation}>
      {/* Glow plane */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[4.4, 2.7]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>
      {/* Main slide */}
      <mesh>
        <planeGeometry args={[4.2, 2.5]} />
        <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// ============================================
// Cinematic Slide Presentation
// ============================================
const CinematicSlide: React.FC<{
  slideNumber: number;
  title: string;
  accentColor: string;
  slideIndex: number;
  totalSlides: number;
}> = ({ slideNumber, title, accentColor, slideIndex, totalSlides }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 3D flip entry
  const flipProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });
  const rotateY = interpolate(flipProgress, [0, 1], [90, 0]);

  // Ken Burns effect
  const kenBurnsScale = interpolate(frame, [0, FRAMES_PER_SLIDE], [1, 1.08], {
    extrapolateRight: "clamp",
  });
  const kenBurnsX = interpolate(frame, [0, FRAMES_PER_SLIDE], [0, -12], {
    extrapolateRight: "clamp",
  });

  // Title animation
  const titleProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12 },
  });

  // Exit animation
  const exitOpacity = interpolate(frame, [FRAMES_PER_SLIDE - 20, FRAMES_PER_SLIDE], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glow pulse
  const glowIntensity = Math.sin(frame * 0.08) * 0.3 + 0.7;

  return (
    <AbsoluteFill
      style={{
        background: "#0f0f1a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: exitOpacity,
        perspective: "1500px",
      }}
    >
      {/* Background gradient based on accent color */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 30% 30%, ${accentColor}15 0%, transparent 50%)`,
        }}
      />

      {/* Floating particles */}
      <FloatingParticles frame={frame} color={accentColor} />

      {/* Main slide with 3D flip */}
      <div
        style={{
          transform: `rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
        }}
      >
        <div
          style={{
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: `
              0 40px 100px rgba(0,0,0,0.5),
              0 0 ${60 + glowIntensity * 40}px ${accentColor}${Math.round(glowIntensity * 40).toString(16).padStart(2, "0")}
            `,
            border: `3px solid ${accentColor}50`,
          }}
        >
          <Img
            src={staticFile(`assets/Chrome+NBLM/slide_${String(slideNumber).padStart(2, "0")}.png`)}
            style={{
              width: 1400,
              height: "auto",
              display: "block",
              transform: `scale(${kenBurnsScale}) translateX(${kenBurnsX}px)`,
            }}
          />
        </div>
      </div>

      {/* Slide title overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 60,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [30, 0])}px)`,
          opacity: titleProgress,
        }}
      >
        <div
          style={{
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(10px)",
            padding: "16px 30px",
            borderRadius: 12,
            borderLeft: `4px solid ${accentColor}`,
          }}
        >
          <span
            style={{
              color: accentColor,
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Slide {slideIndex + 1} of {totalSlides}
          </span>
          <h3
            style={{
              color: "#ffffff",
              fontSize: 28,
              fontWeight: 700,
              margin: "6px 0 0 0",
            }}
          >
            {title}
          </h3>
        </div>
      </div>

      {/* Decorative corner elements */}
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 40,
          width: 100,
          height: 100,
          borderTop: `3px solid ${accentColor}40`,
          borderRight: `3px solid ${accentColor}40`,
          borderRadius: "0 12px 0 0",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 40,
          width: 100,
          height: 100,
          borderBottom: `3px solid ${accentColor}40`,
          borderLeft: `3px solid ${accentColor}40`,
          borderRadius: "0 0 0 12px",
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================
// Cinematic Outro
// ============================================
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 12 } });

  const stats = [
    { label: "Topics Covered", value: "15", delay: 30 },
    { label: "Core Concepts", value: "45+", delay: 50 },
    { label: "Ready for Exam", value: "✓", delay: 70 },
  ];

  const tools = [
    { name: "NotebookLM", color: "#8b5cf6", delay: 100 },
    { name: "Remotion", color: "#06b6d4", delay: 120 },
    { name: "Claude Code", color: "#f97316", delay: 140 },
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
      <ParticleField frame={frame} count={30} fps={fps} />

      {/* Main title */}
      <h2
        style={{
          fontSize: 72,
          fontWeight: 800,
          color: "#ffffff",
          margin: 0,
          transform: `scale(${titleProgress})`,
          opacity: titleProgress,
          textShadow: "0 0 80px rgba(139, 92, 246, 0.6)",
          zIndex: 10,
        }}
      >
        Knowledge Unlocked
      </h2>

      {/* Stats */}
      <div style={{ display: "flex", gap: 60, marginTop: 20, zIndex: 10 }}>
        {stats.map((stat) => {
          const progress = spring({
            frame: frame - stat.delay,
            fps,
            config: { damping: 12 },
          });
          return (
            <div
              key={stat.label}
              style={{
                textAlign: "center",
                transform: `translateY(${interpolate(progress, [0, 1], [20, 0])}px)`,
                opacity: progress,
              }}
            >
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  color: "#a78bfa",
                  textShadow: "0 0 30px rgba(167, 139, 250, 0.5)",
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", marginTop: 8 }}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tool badges */}
      <div style={{ display: "flex", gap: 24, marginTop: 40, zIndex: 10 }}>
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
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)",
          filter: "blur(100px)",
          transform: `scale(${1 + Math.sin(frame * 0.04) * 0.15})`,
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================
// Progress Bar
// ============================================
const ProgressBar: React.FC<{ frame: number; totalFrames: number }> = ({ frame, totalFrames }) => {
  const progress = (frame / totalFrames) * 100;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        background: "rgba(255,255,255,0.1)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(90deg, #8b5cf6, #06b6d4)",
          boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)",
        }}
      />
    </div>
  );
};

// ============================================
// Particle Field
// ============================================
const ParticleField: React.FC<{ frame: number; count: number; fps: number }> = ({
  frame,
  count,
  fps,
}) => {
  return (
    <>
      {[...Array(count)].map((_, i) => {
        const seed = (i * 137.5) % 1;
        const seed2 = ((i + 7) * 251.3) % 1;
        const seed3 = ((i + 13) * 89.7) % 1;
        const x = (seed - 0.5) * 1800;
        const y = (seed2 - 0.5) * 1000;
        const delay = seed3 * 40;
        const hue = 260 + i * 2;
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

// ============================================
// Floating Particles (for slide scenes)
// ============================================
const FloatingParticles: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  return (
    <>
      {[...Array(12)].map((_, i) => {
        const seed = (i * 137.5) % 1;
        const seed2 = ((i + 7) * 251.3) % 1;
        const baseX = (seed - 0.5) * 1600;
        const baseY = (seed2 - 0.5) * 900;
        const floatX = Math.sin(frame * 0.02 + i) * 30;
        const floatY = Math.cos(frame * 0.015 + i * 0.5) * 20;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 4 + (i % 4),
              height: 4 + (i % 4),
              borderRadius: "50%",
              background: color,
              left: `calc(50% + ${baseX + floatX}px)`,
              top: `calc(50% + ${baseY + floatY}px)`,
              opacity: 0.3,
              boxShadow: `0 0 15px ${color}`,
            }}
          />
        );
      })}
    </>
  );
};
