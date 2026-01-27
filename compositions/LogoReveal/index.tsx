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

export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Style 1: 3D Flip Reveal */}
      <Sequence from={0} durationInFrames={120}>
        <Logo3DFlip />
      </Sequence>

      {/* Style 2: Particle Assembly */}
      <Sequence from={120} durationInFrames={120}>
        <LogoParticleAssembly />
      </Sequence>

      {/* Style 3: Glitch Reveal */}
      <Sequence from={240} durationInFrames={120}>
        <LogoGlitchReveal />
      </Sequence>

      {/* Style 4: Scale + Glow */}
      <Sequence from={360} durationInFrames={120}>
        <LogoScaleGlow />
      </Sequence>
    </AbsoluteFill>
  );
};

// ============================================
// Style 1: 3D Flip Reveal
// ============================================
const Logo3DFlip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 3D rotation from back to front
  const rotateY = interpolate(frame, [0, 40], [180, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });

  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Glow pulse after reveal
  const glowIntensity = frame > 40
    ? interpolate(frame, [40, 60, 80], [0, 1, 0.5], { extrapolateRight: "clamp" })
    : 0;

  // Exit
  const exitOpacity = interpolate(frame, [90, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Text animation
  const textProgress = spring({
    frame: frame - 45,
    fps,
    config: { damping: 15 },
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 40,
        opacity: exitOpacity,
        perspective: "1000px",
      }}
    >
      {/* Logo with 3D flip */}
      <div
        style={{
          transform: `rotateY(${rotateY}deg) scale(${scale})`,
          transformStyle: "preserve-3d",
          filter: `drop-shadow(0 0 ${30 + glowIntensity * 40}px rgba(79, 70, 229, ${0.3 + glowIntensity * 0.5}))`,
        }}
      >
        <Img
          src={staticFile("assets/Gemini_Generated_Image_q3tnvbq3tnvbq3tn.png")}
          style={{
            width: 400,
            height: 400,
            objectFit: "contain",
          }}
        />
      </div>

      {/* Text */}
      <div
        style={{
          transform: `translateY(${interpolate(textProgress, [0, 1], [30, 0])}px)`,
          opacity: textProgress,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
            letterSpacing: 4,
          }}
        >
          LEARN TO CODE
        </h1>
        <p
          style={{
            fontSize: 24,
            color: "rgba(255, 255, 255, 0.6)",
            margin: 0,
            marginTop: 12,
            letterSpacing: 8,
          }}
        >
          EDUCATION REDEFINED
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// Style 2: Particle Assembly
// ============================================
const LogoParticleAssembly: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Generate particles
  const particleCount = 50;
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * Math.PI * 2;
    const radius = 300 + Math.random() * 200;
    const startX = Math.cos(angle) * radius;
    const startY = Math.sin(angle) * radius;
    const delay = Math.random() * 20;

    return { startX, startY, delay, size: 4 + Math.random() * 8 };
  });

  // Assembly progress
  const assemblyProgress = interpolate(frame, [10, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Logo opacity (fades in as particles assemble)
  const logoOpacity = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Final scale punch
  const scalePunch = spring({
    frame: frame - 50,
    fps,
    config: { damping: 8, stiffness: 200 },
  });

  // Exit
  const exitOpacity = interpolate(frame, [90, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#000000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: exitOpacity,
      }}
    >
      {/* Particles */}
      {particles.map((p, i) => {
        const progress = Math.max(0, Math.min(1, (assemblyProgress * 1.2) - (p.delay / 50)));
        const x = interpolate(progress, [0, 1], [p.startX, 0]);
        const y = interpolate(progress, [0, 1], [p.startY, 0]);
        const opacity = progress < 1 ? 1 : 0;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: `hsl(${170 + i * 3}, 70%, 60%)`,
              transform: `translate(${x}px, ${y}px)`,
              opacity,
              boxShadow: `0 0 10px hsl(${170 + i * 3}, 70%, 60%)`,
            }}
          />
        );
      })}

      {/* Logo */}
      <Img
        src={staticFile("assets/Gemini_Generated_Image_q3tnvbq3tnvbq3tn.png")}
        style={{
          width: 350,
          height: 350,
          objectFit: "contain",
          opacity: logoOpacity,
          transform: `scale(${0.8 + scalePunch * 0.2})`,
          filter: `drop-shadow(0 0 30px rgba(45, 212, 191, 0.5))`,
        }}
      />

      {/* Ring burst effect */}
      {frame > 50 && (
        <div
          style={{
            position: "absolute",
            width: interpolate(frame, [50, 80], [100, 600], { extrapolateRight: "clamp" }),
            height: interpolate(frame, [50, 80], [100, 600], { extrapolateRight: "clamp" }),
            borderRadius: "50%",
            border: "3px solid rgba(45, 212, 191, 0.5)",
            opacity: interpolate(frame, [50, 80], [1, 0], { extrapolateRight: "clamp" }),
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// ============================================
// Style 3: Glitch Reveal
// ============================================
const LogoGlitchReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Glitch timing
  const isGlitching = frame < 40 && Math.random() > 0.6;
  const glitchX = isGlitching ? (Math.random() - 0.5) * 30 : 0;
  const glitchY = isGlitching ? (Math.random() - 0.5) * 20 : 0;

  // RGB split during glitch
  const rgbSplit = isGlitching ? 8 : 0;

  // Main reveal
  const revealProgress = interpolate(frame, [0, 35], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Scanlines
  const scanlineOffset = (frame * 3) % 100;

  // Scale settle
  const scaleSettle = spring({
    frame: frame - 35,
    fps,
    config: { damping: 10 },
  });

  // Exit
  const exitOpacity = interpolate(frame, [90, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#0a0a0a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: exitOpacity,
        overflow: "hidden",
      }}
    >
      {/* Scanlines overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.3) 2px,
            rgba(0, 0, 0, 0.3) 4px
          )`,
          transform: `translateY(${scanlineOffset}px)`,
          pointerEvents: "none",
          zIndex: 10,
          opacity: 0.5,
        }}
      />

      {/* RGB split layers */}
      <div style={{ position: "relative" }}>
        {/* Red channel */}
        <Img
          src={staticFile("assets/Gemini_Generated_Image_q3tnvbq3tnvbq3tn.png")}
          style={{
            width: 380,
            height: 380,
            objectFit: "contain",
            position: "absolute",
            left: -190 - rgbSplit,
            top: -190,
            filter: "grayscale(100%) brightness(1.2)",
            mixBlendMode: "multiply",
            opacity: rgbSplit > 0 ? 0.8 : 0,
            transform: `translate(${glitchX}px, ${glitchY}px)`,
          }}
        />

        {/* Blue channel */}
        <Img
          src={staticFile("assets/Gemini_Generated_Image_q3tnvbq3tnvbq3tn.png")}
          style={{
            width: 380,
            height: 380,
            objectFit: "contain",
            position: "absolute",
            left: -190 + rgbSplit,
            top: -190,
            filter: "grayscale(100%) brightness(1.2)",
            mixBlendMode: "screen",
            opacity: rgbSplit > 0 ? 0.8 : 0,
            transform: `translate(${glitchX}px, ${glitchY}px)`,
          }}
        />

        {/* Main logo */}
        <Img
          src={staticFile("assets/Gemini_Generated_Image_q3tnvbq3tnvbq3tn.png")}
          style={{
            width: 380,
            height: 380,
            objectFit: "contain",
            clipPath: `inset(0 ${(1 - revealProgress) * 100}% 0 0)`,
            transform: `translate(${glitchX}px, ${glitchY}px) scale(${0.9 + scaleSettle * 0.1})`,
            filter: `drop-shadow(0 0 20px rgba(79, 70, 229, 0.6))`,
          }}
        />
      </div>

      {/* Glitch bars */}
      {isGlitching && (
        <>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${Math.random() * 100}%`,
              height: 4 + Math.random() * 10,
              background: "rgba(79, 70, 229, 0.8)",
              transform: `translateX(${(Math.random() - 0.5) * 100}px)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${Math.random() * 100}%`,
              height: 2 + Math.random() * 6,
              background: "rgba(236, 72, 153, 0.8)",
              transform: `translateX(${(Math.random() - 0.5) * 100}px)`,
            }}
          />
        </>
      )}

      {/* Text with glitch */}
      {frame > 40 && (
        <div
          style={{
            position: "absolute",
            bottom: 200,
            textAlign: "center",
            transform: `translateX(${isGlitching ? glitchX * 0.5 : 0}px)`,
          }}
        >
          <h1
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: "#ffffff",
              margin: 0,
              fontFamily: "monospace",
              letterSpacing: 6,
              textShadow: isGlitching
                ? `${rgbSplit}px 0 #ff0000, ${-rgbSplit}px 0 #00ffff`
                : "0 0 20px rgba(79, 70, 229, 0.5)",
            }}
          >
            {"<INITIALIZE/>"}
          </h1>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ============================================
// Style 4: Scale + Glow Breathe
// ============================================
const LogoScaleGlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entry scale
  const entryScale = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 80 },
  });

  // Breathing glow
  const breathe = Math.sin(frame * 0.1) * 0.5 + 0.5;
  const glowRadius = 20 + breathe * 40;
  const glowOpacity = 0.4 + breathe * 0.3;

  // Rotating rings
  const ringRotation = frame * 0.8;

  // Exit
  const exitOpacity = interpolate(frame, [90, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Text
  const textProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 15 },
  });

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at center, #1a1a2e 0%, #0f0f1a 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 50,
        opacity: exitOpacity,
      }}
    >
      {/* Animated rings behind logo */}
      <div style={{ position: "relative" }}>
        {/* Outer ring */}
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            left: -250,
            top: -250,
            borderRadius: "50%",
            border: "2px solid rgba(79, 70, 229, 0.3)",
            transform: `rotate(${ringRotation}deg)`,
          }}
        >
          {/* Dot on ring */}
          <div
            style={{
              position: "absolute",
              width: 12,
              height: 12,
              background: "#4f46e5",
              borderRadius: "50%",
              top: -6,
              left: "50%",
              marginLeft: -6,
              boxShadow: "0 0 20px #4f46e5",
            }}
          />
        </div>

        {/* Inner ring */}
        <div
          style={{
            position: "absolute",
            width: 420,
            height: 420,
            left: -210,
            top: -210,
            borderRadius: "50%",
            border: "1px solid rgba(236, 72, 153, 0.3)",
            transform: `rotate(${-ringRotation * 0.7}deg)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 8,
              height: 8,
              background: "#ec4899",
              borderRadius: "50%",
              top: -4,
              left: "50%",
              marginLeft: -4,
              boxShadow: "0 0 15px #ec4899",
            }}
          />
        </div>

        {/* Logo with glow */}
        <Img
          src={staticFile("assets/Gemini_Generated_Image_q3tnvbq3tnvbq3tn.png")}
          style={{
            width: 350,
            height: 350,
            objectFit: "contain",
            transform: `scale(${entryScale})`,
            filter: `drop-shadow(0 0 ${glowRadius}px rgba(79, 70, 229, ${glowOpacity}))`,
          }}
        />
      </div>

      {/* Tagline */}
      <div
        style={{
          transform: `translateY(${interpolate(textProgress, [0, 1], [40, 0])}px)`,
          opacity: textProgress,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 32,
            color: "rgba(255, 255, 255, 0.8)",
            margin: 0,
            letterSpacing: 12,
            textTransform: "uppercase",
          }}
        >
          Think • Build • Create
        </p>
      </div>
    </AbsoluteFill>
  );
};
