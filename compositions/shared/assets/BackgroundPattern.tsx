import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export type PatternType = "grid" | "dots" | "gradientMesh" | "waves" | "circles" | "hexagons" | "noise";

export interface BackgroundPatternProps {
  /** Pattern type to display */
  pattern?: PatternType;
  /** Primary color */
  primaryColor?: string;
  /** Secondary color (for gradients and multi-color patterns) */
  secondaryColor?: string;
  /** Background color */
  backgroundColor?: string;
  /** Pattern opacity (0-1) */
  opacity?: number;
  /** Pattern scale multiplier */
  scale?: number;
  /** Whether the pattern should animate */
  animate?: boolean;
  /** Animation speed multiplier */
  animationSpeed?: number;
  /** Additional CSS styles */
  style?: React.CSSProperties;
}

/**
 * Grid pattern SVG
 */
const GridPattern: React.FC<{ color: string; opacity: number; scale: number; animate: boolean; speed: number }> = ({
  color,
  opacity,
  scale,
  animate,
  speed,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const gridSize = 40 * scale;
  const offset = animate ? ((frame * speed) / fps) * 10 : 0;

  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      <defs>
        <pattern
          id="grid-pattern"
          width={gridSize}
          height={gridSize}
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(${offset}, ${offset})`}
        >
          <path
            d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  );
};

/**
 * Dots pattern
 */
const DotsPattern: React.FC<{ color: string; opacity: number; scale: number; animate: boolean; speed: number }> = ({
  color,
  opacity,
  scale,
  animate,
  speed,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spacing = 30 * scale;
  const radius = 3 * scale;
  const pulseScale = animate ? 1 + Math.sin((frame * speed * 2 * Math.PI) / (fps * 2)) * 0.2 : 1;

  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      <defs>
        <pattern
          id="dots-pattern"
          width={spacing}
          height={spacing}
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx={spacing / 2}
            cy={spacing / 2}
            r={radius * pulseScale}
            fill={color}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots-pattern)" />
    </svg>
  );
};

/**
 * Gradient mesh background
 */
const GradientMeshPattern: React.FC<{
  primaryColor: string;
  secondaryColor: string;
  opacity: number;
  animate: boolean;
  speed: number;
}> = ({ primaryColor, secondaryColor, opacity, animate, speed }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const angle = animate ? (frame * speed * 360) / (fps * 10) : 45;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        opacity,
        background: `
          radial-gradient(ellipse at 20% 20%, ${primaryColor}40 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, ${secondaryColor}40 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, ${primaryColor}30 0%, transparent 40%),
          radial-gradient(ellipse at 20% 80%, ${secondaryColor}30 0%, transparent 40%),
          linear-gradient(${angle}deg, ${primaryColor}20, ${secondaryColor}20)
        `,
      }}
    />
  );
};

/**
 * Animated waves pattern
 */
const WavesPattern: React.FC<{
  primaryColor: string;
  secondaryColor: string;
  opacity: number;
  scale: number;
  animate: boolean;
  speed: number;
}> = ({ primaryColor, secondaryColor, opacity, scale, animate, speed }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const waveOffset = animate ? (frame * speed * 100) / fps : 0;
  const amplitude = 20 * scale;
  const wavelength = 100 * scale;

  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      {[0, 1, 2, 3].map((i) => {
        const yOffset = 25 + i * 25;
        const phaseOffset = i * 50 + waveOffset;
        const path = `M 0 ${yOffset}% Q ${wavelength / 4} ${yOffset - amplitude / 10}%, ${wavelength / 2} ${yOffset}% T ${wavelength} ${yOffset}% T ${wavelength * 1.5} ${yOffset}% T ${wavelength * 2} ${yOffset}%`;

        return (
          <path
            key={i}
            d={path}
            fill="none"
            stroke={i % 2 === 0 ? primaryColor : secondaryColor}
            strokeWidth={2 * scale}
            style={{
              transform: `translateX(-${phaseOffset % wavelength}px)`,
            }}
          />
        );
      })}
    </svg>
  );
};

/**
 * Concentric circles pattern
 */
const CirclesPattern: React.FC<{
  color: string;
  opacity: number;
  scale: number;
  animate: boolean;
  speed: number;
}> = ({ color, opacity, scale, animate, speed }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const baseRadius = 50 * scale;
  const expandOffset = animate ? (frame * speed * 20) / fps : 0;

  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      {[...Array(10)].map((_, i) => (
        <circle
          key={i}
          cx="50%"
          cy="50%"
          r={baseRadius + i * 80 * scale + (expandOffset % (80 * scale))}
          fill="none"
          stroke={color}
          strokeWidth={1}
          opacity={1 - i * 0.1}
        />
      ))}
    </svg>
  );
};

/**
 * Hexagon pattern
 */
const HexagonsPattern: React.FC<{
  color: string;
  opacity: number;
  scale: number;
}> = ({ color, opacity, scale }) => {
  const hexSize = 30 * scale;
  const hexWidth = hexSize * 2;
  const hexHeight = hexSize * Math.sqrt(3);

  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      <defs>
        <pattern
          id="hex-pattern"
          width={hexWidth * 1.5}
          height={hexHeight}
          patternUnits="userSpaceOnUse"
        >
          <polygon
            points={`${hexSize},0 ${hexSize * 2},${hexHeight / 4} ${hexSize * 2},${hexHeight * 3 / 4} ${hexSize},${hexHeight} 0,${hexHeight * 3 / 4} 0,${hexHeight / 4}`}
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex-pattern)" />
    </svg>
  );
};

/**
 * Noise/grain texture pattern
 */
const NoisePattern: React.FC<{
  opacity: number;
  animate: boolean;
  speed: number;
}> = ({ opacity, animate, speed }) => {
  const frame = useCurrentFrame();
  const seed = animate ? Math.floor(frame * speed) : 0;

  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      <defs>
        <filter id={`noise-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width="100%" height="100%" filter={`url(#noise-${seed})`} />
    </svg>
  );
};

/**
 * BackgroundPattern component - Reusable background patterns for Remotion compositions
 */
export const BackgroundPattern: React.FC<BackgroundPatternProps> = ({
  pattern = "grid",
  primaryColor = "#3b82f6",
  secondaryColor = "#8b5cf6",
  backgroundColor = "#0a0a1a",
  opacity = 0.3,
  scale = 1,
  animate = false,
  animationSpeed = 1,
  style = {},
}) => {
  const renderPattern = () => {
    switch (pattern) {
      case "grid":
        return (
          <GridPattern
            color={primaryColor}
            opacity={opacity}
            scale={scale}
            animate={animate}
            speed={animationSpeed}
          />
        );
      case "dots":
        return (
          <DotsPattern
            color={primaryColor}
            opacity={opacity}
            scale={scale}
            animate={animate}
            speed={animationSpeed}
          />
        );
      case "gradientMesh":
        return (
          <GradientMeshPattern
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            opacity={opacity}
            animate={animate}
            speed={animationSpeed}
          />
        );
      case "waves":
        return (
          <WavesPattern
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            opacity={opacity}
            scale={scale}
            animate={animate}
            speed={animationSpeed}
          />
        );
      case "circles":
        return (
          <CirclesPattern
            color={primaryColor}
            opacity={opacity}
            scale={scale}
            animate={animate}
            speed={animationSpeed}
          />
        );
      case "hexagons":
        return (
          <HexagonsPattern
            color={primaryColor}
            opacity={opacity}
            scale={scale}
          />
        );
      case "noise":
        return (
          <NoisePattern
            opacity={opacity}
            animate={animate}
            speed={animationSpeed}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AbsoluteFill style={{ backgroundColor, ...style }}>
      <AbsoluteFill>{renderPattern()}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Get all available pattern types
 */
export const getPatternTypes = (): PatternType[] => {
  return ["grid", "dots", "gradientMesh", "waves", "circles", "hexagons", "noise"];
};
