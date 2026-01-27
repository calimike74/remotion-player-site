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
  Audio,
  Easing,
} from "remotion";
import { Canvas } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

/**
 * DemoShowcase - A complete YouTube-ready demo with narration
 *
 * Timeline (at 30fps):
 * - 0-240 (0-8s): Intro + Logo 3D Flip
 * - 240-480 (8-16s): Logo variations montage
 * - 480-690 (16-23s): Image techniques showcase
 * - 690-960 (23-32s): 3D carousel + parallax
 * - 960-1170 (32-39s): Gallery flythrough
 * - 1170-1410 (39-47s): Outro with call to action
 *
 * Total: ~47 seconds (1410 frames at 30fps)
 */

export const DemoShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
      }}
    >
      {/* Audio narration - timed to not overlap
          intro: ~348 frames (11.6s)
          logo: ~294 frames (9.8s)
          images: ~281 frames (9.4s)
          3d: ~337 frames (11.2s)
          flythrough: ~270 frames (9.0s)
          outro: ~292 frames (9.7s)
      */}
      <Sequence from={0}><Audio src={staticFile("demo_01_intro.mp3")} /></Sequence>
      <Sequence from={380}><Audio src={staticFile("demo_02_logo.mp3")} /></Sequence>
      <Sequence from={700}><Audio src={staticFile("demo_03_images.mp3")} /></Sequence>
      <Sequence from={1010}><Audio src={staticFile("demo_04_3d.mp3")} /></Sequence>
      <Sequence from={1380}><Audio src={staticFile("demo_05_flythrough.mp3")} /></Sequence>
      <Sequence from={1680}><Audio src={staticFile("demo_06_outro.mp3")} /></Sequence>

      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* Scene 1: Intro with text build (0-380, ~12.7s) */}
        <Sequence from={0} durationInFrames={380}>
          <IntroScene />
        </Sequence>

        {/* Scene 2: Logo reveal montage (380-700, ~10.7s) */}
        <Sequence from={380} durationInFrames={320}>
          <LogoMontage />
        </Sequence>

        {/* Scene 3: Image techniques (700-1010, ~10.3s) */}
        <Sequence from={700} durationInFrames={310}>
          <ImageTechniques />
        </Sequence>

        {/* Scene 4: 3D showcase (1010-1380, ~12.3s) */}
        <Sequence from={1010} durationInFrames={370}>
          <ThreeDShowcase />
        </Sequence>

        {/* Scene 5: Gallery flythrough (1380-1680, ~10s) */}
        <Sequence from={1380} durationInFrames={300}>
          <GalleryScene />
        </Sequence>

        {/* Scene 6: Outro (1680-2000, ~10.7s) */}
        <Sequence from={1680} durationInFrames={320}>
          <OutroScene />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================
// Scene 1: Intro with dramatic text
// ============================================
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines = [
    { text: "What you're about to see", delay: 0 },
    { text: "was created entirely with", delay: 20 },
    { text: "Claude Code", delay: 40, highlight: true },
  ];

  const sublines = [
    { text: "No manual animation", delay: 90 },
    { text: "No design software", delay: 110 },
    { text: "Just prompts", delay: 130, highlight: true },
  ];

  // Exit (scene is 380 frames)
  const exitOpacity = interpolate(frame, [340, 380], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1e3f 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        opacity: exitOpacity,
      }}
    >
      {/* Main lines */}
      <div style={{ textAlign: "center" }}>
        {lines.map((line, i) => {
          const progress = spring({
            frame: frame - line.delay,
            fps,
            config: { damping: 15 },
          });
          return (
            <div
              key={i}
              style={{
                fontSize: line.highlight ? 120 : 56,
                fontWeight: line.highlight ? 800 : 400,
                color: line.highlight ? "#60a5fa" : "#ffffff",
                transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px)`,
                opacity: progress,
                textShadow: line.highlight ? "0 0 60px rgba(96, 165, 250, 0.5)" : "none",
              }}
            >
              {line.text}
            </div>
          );
        })}
      </div>

      {/* Sublines */}
      <div style={{ display: "flex", gap: 40, marginTop: 60 }}>
        {sublines.map((line, i) => {
          const progress = spring({
            frame: frame - line.delay,
            fps,
            config: { damping: 15 },
          });
          return (
            <div
              key={i}
              style={{
                fontSize: line.highlight ? 36 : 28,
                fontWeight: line.highlight ? 700 : 400,
                color: line.highlight ? "#34d399" : "rgba(255,255,255,0.7)",
                transform: `scale(${progress})`,
                opacity: progress,
              }}
            >
              {line.text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// Scene 2: Logo montage showing different styles
// ============================================
const LogoMontage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 3D flip for first half
  const rotateY = interpolate(frame, [0, 40], [180, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });

  // Transition to glitch style
  const showGlitch = frame > 120;
  const glitchFrame = frame - 120;
  const isGlitching = showGlitch && glitchFrame < 40 && Math.random() > 0.6;

  // Exit (scene is 320 frames)
  const exitOpacity = interpolate(frame, [280, 320], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = spring({ frame, fps, config: { damping: 12 } });

  // Glow animation
  const glowPulse = Math.sin(frame * 0.1) * 0.3 + 0.7;

  return (
    <AbsoluteFill
      style={{
        background: showGlitch ? "#0a0a0a" : "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity: exitOpacity,
        perspective: "1000px",
      }}
    >
      {/* Scanlines for glitch mode */}
      {showGlitch && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)`,
            pointerEvents: "none",
            zIndex: 10,
            opacity: 0.5,
          }}
        />
      )}

      {/* Logo */}
      <div
        style={{
          transform: showGlitch
            ? `scale(${scale}) translateX(${isGlitching ? (Math.random() - 0.5) * 20 : 0}px)`
            : `rotateY(${rotateY}deg) scale(${scale})`,
          transformStyle: "preserve-3d",
          filter: `drop-shadow(0 0 ${30 + glowPulse * 30}px rgba(79, 70, 229, ${glowPulse}))`,
        }}
      >
        <Img
          src={staticFile("assets/Gemini_Generated_Image_q3tnvbq3tnvbq3tn.png")}
          style={{
            width: 350,
            height: 350,
            objectFit: "contain",
          }}
        />
      </div>

      {/* Style label */}
      <div
        style={{
          marginTop: 40,
          fontSize: 24,
          color: "rgba(255,255,255,0.6)",
          letterSpacing: 4,
        }}
      >
        {showGlitch ? "GLITCH STYLE" : "3D FLIP STYLE"}
      </div>

      {/* Caption */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          fontSize: 32,
          color: "#ffffff",
          textAlign: "center",
        }}
      >
        One image. Multiple animation styles. Zero manual work.
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// Scene 3: Image techniques showcase
// ============================================
const ImageTechniques: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns on left
  const kenBurnsScale = interpolate(frame, [0, 210], [1, 1.2], { extrapolateRight: "clamp" });
  const kenBurnsX = interpolate(frame, [0, 210], [0, -20], { extrapolateRight: "clamp" });

  // Callouts
  const callout1 = spring({ frame: frame - 30, fps, config: { damping: 12 } });
  const callout2 = spring({ frame: frame - 50, fps, config: { damping: 12 } });

  // Exit
  const exitOpacity = interpolate(frame, [270, 310], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#f8fafc",
        display: "flex",
        padding: 60,
        gap: 60,
        opacity: exitOpacity,
      }}
    >
      {/* Left: Ken Burns image */}
      <div
        style={{
          flex: 1,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          position: "relative",
        }}
      >
        <Img
          src={staticFile("assets/Gemini_Generated_Image_gw65gigw65gigw65.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${kenBurnsScale}) translateX(${kenBurnsX}px)`,
          }}
        />

        {/* Callout 1 */}
        <div
          style={{
            position: "absolute",
            top: 100,
            right: -20,
            transform: `translateX(${interpolate(callout1, [0, 1], [50, 0])}px)`,
            opacity: callout1,
            background: "#ffffff",
            padding: "12px 20px",
            borderRadius: 8,
            borderLeft: "4px solid #0284c7",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontWeight: 700, color: "#0284c7" }}>ADSR</div>
          <div style={{ fontSize: 14, color: "#64748b" }}>Attack, Decay, Sustain, Release</div>
        </div>

        {/* Callout 2 */}
        <div
          style={{
            position: "absolute",
            bottom: 150,
            left: -20,
            transform: `translateX(${interpolate(callout2, [0, 1], [-50, 0])}px)`,
            opacity: callout2,
            background: "#ffffff",
            padding: "12px 20px",
            borderRadius: 8,
            borderLeft: "4px solid #16a34a",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontWeight: 700, color: "#16a34a" }}>Envelope</div>
          <div style={{ fontSize: 14, color: "#64748b" }}>Shapes dynamics over time</div>
        </div>
      </div>

      {/* Right: Text explanation */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 30,
        }}
      >
        <h2 style={{ fontSize: 52, fontWeight: 700, color: "#0f172a", margin: 0 }}>
          Smart Image Integration
        </h2>
        <p style={{ fontSize: 24, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
          Claude Code understands your images. It can identify key areas, generate
          contextual callouts, and apply cinematic effects like Ken Burns - all from
          natural language descriptions.
        </p>
        <div style={{ display: "flex", gap: 20 }}>
          {["Ken Burns", "Callouts", "Parallax"].map((tech, i) => {
            const progress = spring({ frame: frame - 70 - i * 15, fps, config: { damping: 15 } });
            return (
              <div
                key={tech}
                style={{
                  padding: "12px 24px",
                  background: "#0f172a",
                  color: "#fff",
                  borderRadius: 8,
                  fontWeight: 600,
                  transform: `scale(${progress})`,
                  opacity: progress,
                }}
              >
                {tech}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// Scene 4: 3D Showcase
// ============================================
const ThreeDShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  // Exit
  const exitOpacity = interpolate(frame, [330, 370], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#0a0a0a", opacity: exitOpacity }}>
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <spotLight position={[0, 10, 10]} angle={0.3} intensity={1} />
        <pointLight position={[-5, 0, 5]} intensity={0.5} color="#4f46e5" />
        <pointLight position={[5, 0, 5]} intensity={0.5} color="#06b6d4" />
        <Suspense fallback={null}>
          <Carousel3D frame={frame} />
        </Suspense>
      </Canvas>

      {/* Overlay text */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
            textShadow: "0 0 40px rgba(79, 70, 229, 0.8)",
          }}
        >
          Full Three.js Integration
        </h2>
        <p style={{ fontSize: 24, color: "rgba(255,255,255,0.6)", marginTop: 12 }}>
          Real 3D rendering. Dynamic lighting. Programmatic camera control.
        </p>
      </div>
    </AbsoluteFill>
  );
};

// 3D Carousel component
const Carousel3D: React.FC<{ frame: number }> = ({ frame }) => {
  const groupRef = useRef<THREE.Group>(null);
  const rotation = frame * 0.012;

  const images = [
    "/assets/Gemini_Generated_Image_gw65gigw65gigw65.png",
    "/assets/Gemini_Generated_Image_csramicsramicsra.png",
    "/assets/Gemini_Generated_Image_q3tnvbq3tnvbq3tn.png",
    "/assets/image_fx_-3.jpg",
    "/assets/image_fx_-4.jpg",
  ];

  return (
    <group ref={groupRef} rotation={[0.2, rotation, 0]}>
      {images.map((img, i) => {
        const angle = (i / images.length) * Math.PI * 2;
        const radius = 5;
        return (
          <CarouselCard
            key={img}
            position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}
            rotation={[0, -angle + Math.PI, 0]}
            imagePath={img}
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
}> = ({ position, rotation, imagePath }) => {
  const texture = useTexture(imagePath);
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[3.5, 2.2]} />
      <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  );
};

// ============================================
// Scene 5: Gallery flythrough
// ============================================
const GalleryScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Parallax movement
  const moveX = Math.sin(frame * 0.03) * 40;
  const moveY = Math.cos(frame * 0.02) * 25;

  // Exit (scene is 300 frames)
  const exitOpacity = interpolate(frame, [260, 300], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        perspective: "1000px",
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
          opacity: 0.3,
        }}
      >
        <Img
          src={staticFile("assets/image_fx_-4.jpg")}
          style={{
            width: 500,
            borderRadius: 16,
            position: "absolute",
            top: "15%",
            left: "5%",
          }}
        />
      </div>

      {/* Mid layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${moveX * 0.3}px, ${moveY * 0.3}px)`,
          opacity: 0.6,
        }}
      >
        <Img
          src={staticFile("assets/Gemini_Generated_Image_csramicsramicsra.png")}
          style={{
            width: 450,
            borderRadius: 12,
            position: "absolute",
            top: "25%",
            right: "10%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        />
      </div>

      {/* Near layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${moveX * 0.6}px, ${moveY * 0.6}px)`,
        }}
      >
        <Img
          src={staticFile("assets/Gemini_Generated_Image_gw65gigw65gigw65.png")}
          style={{
            width: 600,
            borderRadius: 8,
            position: "absolute",
            bottom: "5%",
            left: "20%",
            boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
          }}
        />
      </div>

      {/* Title overlay */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) translate(${moveX * 0.8}px, ${moveY * 0.8}px)`,
        }}
      >
        <h2
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#fff",
            textShadow: "0 0 60px rgba(79, 70, 229, 0.8)",
            textAlign: "center",
          }}
        >
          Depth & Motion
        </h2>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// Scene 6: Outro with CTA
// ============================================
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoProgress = spring({ frame, fps, config: { damping: 12 } });

  const tools = [
    { name: "Claude Code", color: "#f97316", delay: 30 },
    { name: "Remotion", color: "#06b6d4", delay: 50 },
    { name: "ElevenLabs", color: "#8b5cf6", delay: 70 },
  ];

  const taglineProgress = spring({ frame: frame - 100, fps, config: { damping: 15 } });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1e3f 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 50,
      }}
    >
      {/* Logo */}
      <Img
        src={staticFile("assets/Gemini_Generated_Image_q3tnvbq3tnvbq3tn.png")}
        style={{
          width: 200,
          height: 200,
          objectFit: "contain",
          transform: `scale(${logoProgress})`,
          filter: "drop-shadow(0 0 40px rgba(79, 70, 229, 0.5))",
        }}
      />

      {/* Tool badges */}
      <div style={{ display: "flex", gap: 30 }}>
        {tools.map((tool) => {
          const progress = spring({ frame: frame - tool.delay, fps, config: { damping: 12 } });
          return (
            <div
              key={tool.name}
              style={{
                padding: "16px 32px",
                background: tool.color,
                color: "#fff",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 24,
                transform: `scale(${progress})`,
                opacity: progress,
                boxShadow: `0 10px 40px ${tool.color}40`,
              }}
            >
              {tool.name}
            </div>
          );
        })}
      </div>

      {/* Tagline */}
      <div
        style={{
          textAlign: "center",
          transform: `translateY(${interpolate(taglineProgress, [0, 1], [30, 0])}px)`,
          opacity: taglineProgress,
        }}
      >
        <h2 style={{ fontSize: 56, fontWeight: 700, color: "#fff", margin: 0 }}>
          From Idea to Video
        </h2>
        <p style={{ fontSize: 28, color: "rgba(255,255,255,0.6)", marginTop: 16 }}>
          Minutes, not days.
        </p>
      </div>

      {/* Particles - using deterministic positions based on index */}
      {[...Array(20)].map((_, i) => {
        // Deterministic pseudo-random based on index
        const seed = (i * 137.5) % 1;
        const seed2 = ((i + 7) * 251.3) % 1;
        const seed3 = ((i + 13) * 89.7) % 1;
        const x = (seed - 0.5) * 1800;
        const y = (seed2 - 0.5) * 1000;
        const delay = seed3 * 60;
        const hue = 220 + (i * 2);
        const progress = spring({ frame: frame - delay, fps, config: { damping: 20 } });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: `hsl(${hue}, 70%, 60%)`,
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              opacity: progress * 0.6,
              boxShadow: `0 0 10px hsl(${hue}, 70%, 60%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
