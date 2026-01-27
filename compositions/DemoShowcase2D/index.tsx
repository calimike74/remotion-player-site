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

/**
 * DemoShowcase2D - Renderable version without Three.js
 * Uses CSS 3D transforms instead of WebGL
 */

export const DemoShowcase2D: React.FC = () => {
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
      {/* Audio narration */}
      <Sequence from={0}><Audio src={staticFile("demo_01_intro.mp3")} /></Sequence>
      <Sequence from={380}><Audio src={staticFile("demo_02_logo.mp3")} /></Sequence>
      <Sequence from={700}><Audio src={staticFile("demo_03_images.mp3")} /></Sequence>
      <Sequence from={1010}><Audio src={staticFile("demo_04_3d.mp3")} /></Sequence>
      <Sequence from={1380}><Audio src={staticFile("demo_05_flythrough.mp3")} /></Sequence>
      <Sequence from={1680}><Audio src={staticFile("demo_06_outro.mp3")} /></Sequence>

      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* Scene 1: Intro */}
        <Sequence from={0} durationInFrames={380}>
          <IntroScene />
        </Sequence>

        {/* Scene 2: Logo reveal */}
        <Sequence from={380} durationInFrames={320}>
          <LogoMontage />
        </Sequence>

        {/* Scene 3: Image techniques */}
        <Sequence from={700} durationInFrames={310}>
          <ImageTechniques />
        </Sequence>

        {/* Scene 4: CSS 3D carousel (replaces Three.js) */}
        <Sequence from={1010} durationInFrames={370}>
          <CSS3DCarousel />
        </Sequence>

        {/* Scene 5: Parallax */}
        <Sequence from={1380} durationInFrames={300}>
          <ParallaxScene />
        </Sequence>

        {/* Scene 6: Outro */}
        <Sequence from={1680} durationInFrames={320}>
          <OutroScene />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 1: Intro
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
      <div style={{ textAlign: "center" }}>
        {lines.map((line, i) => {
          const progress = spring({ frame: frame - line.delay, fps, config: { damping: 15 } });
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

      <div style={{ display: "flex", gap: 40, marginTop: 60 }}>
        {sublines.map((line, i) => {
          const progress = spring({ frame: frame - line.delay, fps, config: { damping: 15 } });
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

// Scene 2: Logo montage
const LogoMontage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rotateY = interpolate(frame, [0, 40], [180, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });

  const showGlitch = frame > 160;
  const glitchOffset = showGlitch ? Math.sin(frame * 0.5) * 3 : 0;

  const exitOpacity = interpolate(frame, [280, 320], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = spring({ frame, fps, config: { damping: 12 } });
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

      <div
        style={{
          transform: showGlitch
            ? `scale(${scale}) translateX(${glitchOffset}px)`
            : `rotateY(${rotateY}deg) scale(${scale})`,
          transformStyle: "preserve-3d",
          filter: `drop-shadow(0 0 ${30 + glowPulse * 30}px rgba(79, 70, 229, ${glowPulse}))`,
        }}
      >
        <Img
          src={staticFile("assets/Gemini_Generated_Image_q3tnvbq3tnvbq3tn.png")}
          style={{ width: 350, height: 350, objectFit: "contain" }}
        />
      </div>

      <div style={{ marginTop: 40, fontSize: 24, color: "rgba(255,255,255,0.6)", letterSpacing: 4 }}>
        {showGlitch ? "GLITCH STYLE" : "3D FLIP STYLE"}
      </div>

      <div style={{ position: "absolute", bottom: 100, fontSize: 32, color: "#ffffff", textAlign: "center" }}>
        One image. Multiple animation styles. Zero manual work.
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Image techniques
const ImageTechniques: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kenBurnsScale = interpolate(frame, [0, 310], [1, 1.2], { extrapolateRight: "clamp" });
  const kenBurnsX = interpolate(frame, [0, 310], [0, -20], { extrapolateRight: "clamp" });

  const callout1 = spring({ frame: frame - 30, fps, config: { damping: 12 } });
  const callout2 = spring({ frame: frame - 50, fps, config: { damping: 12 } });

  const exitOpacity = interpolate(frame, [270, 310], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#f8fafc", display: "flex", padding: 60, gap: 60, opacity: exitOpacity }}>
      <div style={{ flex: 1, borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)", position: "relative" }}>
        <Img
          src={staticFile("assets/Gemini_Generated_Image_gw65gigw65gigw65.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kenBurnsScale}) translateX(${kenBurnsX}px)` }}
        />
        <div
          style={{
            position: "absolute", top: 100, right: -20,
            transform: `translateX(${interpolate(callout1, [0, 1], [50, 0])}px)`,
            opacity: callout1,
            background: "#ffffff", padding: "12px 20px", borderRadius: 8, borderLeft: "4px solid #0284c7",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontWeight: 700, color: "#0284c7" }}>ADSR</div>
          <div style={{ fontSize: 14, color: "#64748b" }}>Attack, Decay, Sustain, Release</div>
        </div>
        <div
          style={{
            position: "absolute", bottom: 150, left: -20,
            transform: `translateX(${interpolate(callout2, [0, 1], [-50, 0])}px)`,
            opacity: callout2,
            background: "#ffffff", padding: "12px 20px", borderRadius: 8, borderLeft: "4px solid #16a34a",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontWeight: 700, color: "#16a34a" }}>Envelope</div>
          <div style={{ fontSize: 14, color: "#64748b" }}>Shapes dynamics over time</div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 30 }}>
        <h2 style={{ fontSize: 52, fontWeight: 700, color: "#0f172a", margin: 0 }}>Smart Image Integration</h2>
        <p style={{ fontSize: 24, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
          Claude Code understands your images. It can identify key areas, generate contextual callouts, and apply cinematic effects.
        </p>
        <div style={{ display: "flex", gap: 20 }}>
          {["Ken Burns", "Callouts", "Parallax"].map((tech, i) => {
            const progress = spring({ frame: frame - 70 - i * 15, fps, config: { damping: 15 } });
            return (
              <div key={tech} style={{ padding: "12px 24px", background: "#0f172a", color: "#fff", borderRadius: 8, fontWeight: 600, transform: `scale(${progress})`, opacity: progress }}>
                {tech}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: CSS 3D Carousel (replaces Three.js version)
const CSS3DCarousel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const images = [
    "assets/Gemini_Generated_Image_gw65gigw65gigw65.png",
    "assets/Gemini_Generated_Image_csramicsramicsra.png",
    "assets/Gemini_Generated_Image_q3tnvbq3tnvbq3tn.png",
    "assets/image_fx_-3.jpg",
    "assets/image_fx_-4.jpg",
  ];

  const rotation = frame * 0.8; // degrees

  const exitOpacity = interpolate(frame, [330, 370], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const entryScale = spring({ frame, fps, config: { damping: 15 } });

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at center, #1a1a2e 0%, #0a0a0a 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity: exitOpacity,
        perspective: "1200px",
      }}
    >
      {/* CSS 3D Carousel */}
      <div
        style={{
          width: 400,
          height: 250,
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `rotateY(${rotation}deg) scale(${entryScale})`,
        }}
      >
        {images.map((img, i) => {
          const angle = (i / images.length) * 360;
          const radius = 400;
          return (
            <div
              key={img}
              style={{
                position: "absolute",
                width: 350,
                height: 220,
                left: "50%",
                top: "50%",
                marginLeft: -175,
                marginTop: -110,
                transformStyle: "preserve-3d",
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                backfaceVisibility: "hidden",
              }}
            >
              <Img
                src={staticFile(img)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 12,
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div style={{ marginTop: 100, textAlign: "center" }}>
        <h2 style={{ fontSize: 48, fontWeight: 700, color: "#ffffff", margin: 0, textShadow: "0 0 40px rgba(79, 70, 229, 0.8)" }}>
          3D Image Carousel
        </h2>
        <p style={{ fontSize: 24, color: "rgba(255,255,255,0.6)", marginTop: 12 }}>
          CSS 3D transforms. No WebGL required.
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Parallax
const ParallaxScene: React.FC = () => {
  const frame = useCurrentFrame();

  const moveX = Math.sin(frame * 0.03) * 40;
  const moveY = Math.cos(frame * 0.02) * 25;

  const exitOpacity = interpolate(frame, [260, 300], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        overflow: "hidden",
        opacity: exitOpacity,
      }}
    >
      <div style={{ position: "absolute", inset: 0, transform: `translate(${moveX * 0.1}px, ${moveY * 0.1}px)`, opacity: 0.3 }}>
        <Img src={staticFile("assets/image_fx_-4.jpg")} style={{ width: 500, borderRadius: 16, position: "absolute", top: "15%", left: "5%" }} />
      </div>

      <div style={{ position: "absolute", inset: 0, transform: `translate(${moveX * 0.3}px, ${moveY * 0.3}px)`, opacity: 0.6 }}>
        <Img src={staticFile("assets/Gemini_Generated_Image_csramicsramicsra.png")} style={{ width: 450, borderRadius: 12, position: "absolute", top: "25%", right: "10%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }} />
      </div>

      <div style={{ position: "absolute", inset: 0, transform: `translate(${moveX * 0.6}px, ${moveY * 0.6}px)` }}>
        <Img src={staticFile("assets/Gemini_Generated_Image_gw65gigw65gigw65.png")} style={{ width: 600, borderRadius: 8, position: "absolute", bottom: "5%", left: "20%", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }} />
      </div>

      <div style={{ position: "absolute", top: "50%", left: "50%", transform: `translate(-50%, -50%) translate(${moveX * 0.8}px, ${moveY * 0.8}px)` }}>
        <h2 style={{ fontSize: 64, fontWeight: 800, color: "#fff", textShadow: "0 0 60px rgba(79, 70, 229, 0.8)", textAlign: "center" }}>
          Depth & Motion
        </h2>
      </div>
    </AbsoluteFill>
  );
};

// Scene 6: Outro
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
      <Img
        src={staticFile("assets/Gemini_Generated_Image_q3tnvbq3tnvbq3tn.png")}
        style={{
          width: 200, height: 200, objectFit: "contain",
          transform: `scale(${logoProgress})`,
          filter: "drop-shadow(0 0 40px rgba(79, 70, 229, 0.5))",
        }}
      />

      <div style={{ display: "flex", gap: 30 }}>
        {tools.map((tool) => {
          const progress = spring({ frame: frame - tool.delay, fps, config: { damping: 12 } });
          return (
            <div
              key={tool.name}
              style={{
                padding: "16px 32px", background: tool.color, color: "#fff", borderRadius: 12,
                fontWeight: 700, fontSize: 24, transform: `scale(${progress})`, opacity: progress,
                boxShadow: `0 10px 40px ${tool.color}40`,
              }}
            >
              {tool.name}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", transform: `translateY(${interpolate(taglineProgress, [0, 1], [30, 0])}px)`, opacity: taglineProgress }}>
        <h2 style={{ fontSize: 56, fontWeight: 700, color: "#fff", margin: 0 }}>From Idea to Video</h2>
        <p style={{ fontSize: 28, color: "rgba(255,255,255,0.6)", marginTop: 16 }}>Minutes, not days.</p>
      </div>

      {/* Deterministic particles */}
      {[...Array(20)].map((_, i) => {
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
              position: "absolute", width: 4, height: 4, borderRadius: "50%",
              background: `hsl(${hue}, 70%, 60%)`,
              left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`,
              opacity: progress * 0.6,
              boxShadow: `0 0 10px hsl(${hue}, 70%, 60%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
