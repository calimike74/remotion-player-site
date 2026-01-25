import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

// Enhanced visual version of the Hearing Range segment
// Demonstrates: animated gradients, particles, glassmorphism, glow effects

// Floating particle component
const Particle: React.FC<{
  delay: number;
  size: number;
  x: number;
  speed: number;
  color: string;
}> = ({ delay, size, x, speed, color }) => {
  const frame = useCurrentFrame();
  const adjustedFrame = Math.max(0, frame - delay);

  // Particle floats upward and fades
  const y = interpolate(adjustedFrame, [0, 300], [1100, -100], {
    extrapolateRight: "extend",
  });
  const opacity = interpolate(adjustedFrame, [0, 50, 250, 300], [0, 0.6, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const drift = Math.sin(adjustedFrame * 0.02 * speed) * 30;

  return (
    <div
      style={{
        position: "absolute",
        left: x + drift,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        opacity,
        filter: `blur(${size / 4}px)`,
        boxShadow: `0 0 ${size * 2}px ${color}`,
      }}
    />
  );
};

// Glassmorphism card component
const GlassCard: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      background: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: 24,
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const EnhancedHearingRange: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animated gradient rotation
  const gradientAngle = interpolate(frame, [0, 630], [0, 360]);

  // Title animation
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Spectrum animation
  const spectrumProgress = interpolate(frame, [60, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Marker animations with stagger
  const lowerMarkerProgress = spring({
    frame: frame - 260,
    fps,
    config: { damping: 12 },
  });
  const upperMarkerProgress = spring({
    frame: frame - 320,
    fps,
    config: { damping: 12 },
  });

  // Key fact reveal
  const factProgress = spring({
    frame: frame - 400,
    fps,
    config: { damping: 15 },
  });

  // Pulse animation for the hearing range highlight
  const pulsePhase = Math.sin(frame * 0.08) * 0.5 + 0.5;

  // Exit animation
  const exitProgress = interpolate(frame, [590, 620], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  // Spectrum dimensions
  const spectrumX = 160;
  const spectrumY = 380;
  const spectrumWidth = 1600;
  const spectrumHeight = 100;

  // Convert frequency to x position (log scale)
  const freqToX = (freq: number) => {
    const minLog = Math.log10(1);
    const maxLog = Math.log10(100000);
    const freqLog = Math.log10(freq);
    return spectrumX + ((freqLog - minLog) / (maxLog - minLog)) * spectrumWidth;
  };

  const lowerLimit = freqToX(20);
  const upperLimit = freqToX(20000);

  // Generate particles
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    delay: i * 15,
    size: 4 + Math.random() * 12,
    x: 100 + (i * 47) % 1720,
    speed: 0.5 + Math.random() * 1.5,
    color: i % 3 === 0 ? "#22c55e" : i % 3 === 1 ? "#3b82f6" : "#8b5cf6",
  }));

  return (
    <AbsoluteFill style={{ opacity: exitOpacity }}>
      {/* Animated gradient background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            linear-gradient(${gradientAngle}deg,
              #0a0a1a 0%,
              #0f172a 25%,
              #1e1b4b 50%,
              #0f172a 75%,
              #0a0a1a 100%
            )
          `,
        }}
      />

      {/* Radial glow effect */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 80% 50% at 50% 100%, rgba(34, 197, 94, 0.15) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
          `,
        }}
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <Particle key={p.id} {...p} />
      ))}

      {/* Grid lines for depth */}
      <svg
        width="1920"
        height="1080"
        style={{ position: "absolute", opacity: 0.1 }}
      >
        {Array.from({ length: 20 }, (_, i) => (
          <line
            key={`h-${i}`}
            x1={0}
            y1={i * 60}
            x2={1920}
            y2={i * 60}
            stroke="#3b82f6"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 32 }, (_, i) => (
          <line
            key={`v-${i}`}
            x1={i * 64}
            y1={0}
            x2={i * 64}
            y2={1080}
            stroke="#3b82f6"
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* Content container */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          padding: 80,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Title with glow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 50,
            transform: `translateY(${interpolate(titleProgress, [0, 1], [50, 0])}px)`,
            opacity: titleProgress,
          }}
        >
          <GlassCard style={{ padding: "14px 32px" }}>
            <span
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#22c55e",
                textShadow: "0 0 20px rgba(34, 197, 94, 0.5)",
              }}
            >
              KEY FACT
            </span>
          </GlassCard>
          <h2
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#ffffff",
              margin: 0,
              textShadow: "0 0 40px rgba(255, 255, 255, 0.2)",
            }}
          >
            Human Hearing Range
          </h2>
        </div>

        {/* Spectrum visualization */}
        <div style={{ position: "relative", height: 400, marginBottom: 40 }}>
          <svg width="1920" height="400" style={{ position: "absolute", top: 0, left: 0 }}>
            <defs>
              {/* Gradient for spectrum */}
              <linearGradient id="spectrumGradientEnhanced" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="20%" stopColor="#3b82f6" />
                <stop offset="40%" stopColor="#22c55e" />
                <stop offset="60%" stopColor="#eab308" />
                <stop offset="80%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>

              {/* Glow filter */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Stronger glow */}
              <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Spectrum bar background */}
            <rect
              x={spectrumX}
              y={spectrumY}
              width={spectrumWidth}
              height={spectrumHeight}
              fill="rgba(255, 255, 255, 0.05)"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="2"
              rx="12"
            />

            {/* Animated spectrum fill */}
            <rect
              x={spectrumX}
              y={spectrumY}
              width={spectrumWidth * spectrumProgress}
              height={spectrumHeight}
              fill="url(#spectrumGradientEnhanced)"
              rx="12"
              style={{ filter: "brightness(1.2)" }}
            />

            {/* Human hearing range highlight with pulse */}
            {lowerMarkerProgress > 0 && upperMarkerProgress > 0 && (
              <rect
                x={lowerLimit}
                y={spectrumY - 15}
                width={(upperLimit - lowerLimit) * Math.min(upperMarkerProgress, 1)}
                height={spectrumHeight + 30}
                fill={`rgba(34, 197, 94, ${0.1 + pulsePhase * 0.1})`}
                stroke="#22c55e"
                strokeWidth="3"
                rx="12"
                filter="url(#glow)"
              />
            )}

            {/* Frequency labels */}
            {spectrumProgress >= 1 && (
              <>
                {[1, 10, 100, 1000, 10000, 100000].map((freq) => (
                  <React.Fragment key={freq}>
                    <line
                      x1={freqToX(freq)}
                      y1={spectrumY + spectrumHeight}
                      x2={freqToX(freq)}
                      y2={spectrumY + spectrumHeight + 15}
                      stroke="rgba(255, 255, 255, 0.3)"
                      strokeWidth="2"
                    />
                    <text
                      x={freqToX(freq)}
                      y={spectrumY + spectrumHeight + 45}
                      fontSize="18"
                      fill="#94a3b8"
                      textAnchor="middle"
                      fontWeight="500"
                    >
                      {freq >= 1000 ? `${freq / 1000}kHz` : `${freq}Hz`}
                    </text>
                  </React.Fragment>
                ))}
              </>
            )}

            {/* Lower limit marker (20 Hz) */}
            {lowerMarkerProgress > 0 && (
              <g opacity={lowerMarkerProgress} filter="url(#strongGlow)">
                <line
                  x1={lowerLimit}
                  y1={spectrumY - 60}
                  x2={lowerLimit}
                  y2={spectrumY + spectrumHeight + 15}
                  stroke="#22c55e"
                  strokeWidth="4"
                />
                <circle cx={lowerLimit} cy={spectrumY - 70} r="12" fill="#22c55e" />
                <text
                  x={lowerLimit}
                  y={spectrumY - 100}
                  fontSize="36"
                  fill="#22c55e"
                  textAnchor="middle"
                  fontWeight="700"
                  style={{ textShadow: "0 0 20px rgba(34, 197, 94, 0.8)" }}
                >
                  20 Hz
                </text>
                <text
                  x={lowerLimit}
                  y={spectrumY - 135}
                  fontSize="18"
                  fill="#86efac"
                  textAnchor="middle"
                  fontWeight="600"
                >
                  LOWER LIMIT
                </text>
              </g>
            )}

            {/* Upper limit marker (20 kHz) */}
            {upperMarkerProgress > 0 && (
              <g opacity={upperMarkerProgress} filter="url(#strongGlow)">
                <line
                  x1={upperLimit}
                  y1={spectrumY - 60}
                  x2={upperLimit}
                  y2={spectrumY + spectrumHeight + 15}
                  stroke="#22c55e"
                  strokeWidth="4"
                />
                <circle cx={upperLimit} cy={spectrumY - 70} r="12" fill="#22c55e" />
                <text
                  x={upperLimit}
                  y={spectrumY - 100}
                  fontSize="36"
                  fill="#22c55e"
                  textAnchor="middle"
                  fontWeight="700"
                  style={{ textShadow: "0 0 20px rgba(34, 197, 94, 0.8)" }}
                >
                  20 kHz
                </text>
                <text
                  x={upperLimit}
                  y={spectrumY - 135}
                  fontSize="18"
                  fill="#86efac"
                  textAnchor="middle"
                  fontWeight="600"
                >
                  UPPER LIMIT
                </text>
              </g>
            )}

            {/* Range labels */}
            {lowerMarkerProgress > 0 && (
              <>
                <text
                  x={(spectrumX + lowerLimit) / 2}
                  y={spectrumY + spectrumHeight / 2 + 8}
                  fontSize="20"
                  fill="#64748b"
                  textAnchor="middle"
                  fontWeight="500"
                  opacity={lowerMarkerProgress}
                >
                  Infrasound
                </text>
                <text
                  x={(upperLimit + spectrumX + spectrumWidth) / 2}
                  y={spectrumY + spectrumHeight / 2 + 8}
                  fontSize="20"
                  fill="#64748b"
                  textAnchor="middle"
                  fontWeight="500"
                  opacity={upperMarkerProgress}
                >
                  Ultrasound
                </text>
              </>
            )}
          </svg>
        </div>

        {/* Key fact card */}
        <div
          style={{
            transform: `translateY(${interpolate(factProgress, [0, 1], [60, 0])}px) scale(${interpolate(factProgress, [0, 1], [0.9, 1])})`,
            opacity: factProgress,
          }}
        >
          <GlassCard
            style={{
              padding: 50,
              maxWidth: 1000,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                fontSize: 22,
                color: "#22c55e",
                fontWeight: 600,
                marginBottom: 20,
                textTransform: "uppercase",
                letterSpacing: 2,
                textShadow: "0 0 15px rgba(34, 197, 94, 0.5)",
              }}
            >
              Memorise This
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 60,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 72,
                    fontWeight: 700,
                    color: "#22c55e",
                    textShadow: "0 0 30px rgba(34, 197, 94, 0.6)",
                  }}
                >
                  20 Hz
                </div>
                <div style={{ fontSize: 20, color: "#94a3b8", marginTop: 8 }}>
                  Lower limit
                </div>
              </div>

              <div
                style={{
                  fontSize: 48,
                  color: "#22c55e",
                  opacity: 0.6,
                  textShadow: "0 0 20px rgba(34, 197, 94, 0.4)",
                }}
              >
                →
              </div>

              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 72,
                    fontWeight: 700,
                    color: "#22c55e",
                    textShadow: "0 0 30px rgba(34, 197, 94, 0.6)",
                  }}
                >
                  20 kHz
                </div>
                <div style={{ fontSize: 20, color: "#94a3b8", marginTop: 8 }}>
                  Upper limit
                </div>
              </div>
            </div>
            <div
              style={{
                fontSize: 22,
                color: "#94a3b8",
                textAlign: "center",
                marginTop: 30,
              }}
            >
              This appears in almost every exam paper!
            </div>
          </GlassCard>
        </div>
      </div>
    </AbsoluteFill>
  );
};
