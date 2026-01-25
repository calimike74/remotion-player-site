import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export type GradientType = "linear" | "radial" | "conic" | "mesh" | "aurora" | "sunset";

export interface GradientStop {
  color: string;
  position: number; // 0-100
}

export interface AnimatedGradientProps {
  /** Gradient type */
  type?: GradientType;
  /** Array of color stops */
  colors?: string[];
  /** Custom gradient stops with positions */
  stops?: GradientStop[];
  /** Animation speed (degrees per second for rotation, or custom for other effects) */
  speed?: number;
  /** Starting angle for linear gradients (degrees) */
  angle?: number;
  /** Whether to animate the gradient */
  animate?: boolean;
  /** Animation style: "rotate" | "shift" | "pulse" */
  animationStyle?: "rotate" | "shift" | "pulse";
  /** Opacity (0-1) */
  opacity?: number;
  /** Additional CSS styles */
  style?: React.CSSProperties;
}

/**
 * Generate CSS gradient string from colors or stops
 */
const generateGradientStops = (colors: string[], stops?: GradientStop[]): string => {
  if (stops && stops.length > 0) {
    return stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ");
  }

  // Auto-generate even distribution
  return colors
    .map((color, i) => `${color} ${(i / (colors.length - 1)) * 100}%`)
    .join(", ");
};

/**
 * Linear gradient renderer
 */
const LinearGradient: React.FC<{
  colors: string[];
  stops?: GradientStop[];
  angle: number;
  animate: boolean;
  animationStyle: "rotate" | "shift" | "pulse";
  speed: number;
  opacity: number;
}> = ({ colors, stops, angle, animate, animationStyle, speed, opacity }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let currentAngle = angle;
  let gradientOpacity = opacity;

  if (animate) {
    switch (animationStyle) {
      case "rotate":
        currentAngle = angle + (frame * speed) / fps;
        break;
      case "pulse":
        gradientOpacity = opacity * (0.8 + Math.sin((frame * speed * Math.PI) / (fps * 2)) * 0.2);
        break;
    }
  }

  const gradientStops = generateGradientStops(colors, stops);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        opacity: gradientOpacity,
        background: `linear-gradient(${currentAngle}deg, ${gradientStops})`,
      }}
    />
  );
};

/**
 * Radial gradient renderer
 */
const RadialGradient: React.FC<{
  colors: string[];
  stops?: GradientStop[];
  animate: boolean;
  animationStyle: "rotate" | "shift" | "pulse";
  speed: number;
  opacity: number;
}> = ({ colors, stops, animate, animationStyle, speed, opacity }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let scale = 1;
  let gradientOpacity = opacity;
  let positionX = 50;
  let positionY = 50;

  if (animate) {
    switch (animationStyle) {
      case "shift":
        positionX = 50 + Math.sin((frame * speed * Math.PI) / (fps * 3)) * 20;
        positionY = 50 + Math.cos((frame * speed * Math.PI) / (fps * 3)) * 20;
        break;
      case "pulse":
        scale = 1 + Math.sin((frame * speed * Math.PI) / (fps * 2)) * 0.2;
        break;
    }
  }

  const gradientStops = generateGradientStops(colors, stops);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        opacity: gradientOpacity,
        background: `radial-gradient(circle at ${positionX}% ${positionY}%, ${gradientStops})`,
        transform: `scale(${scale})`,
      }}
    />
  );
};

/**
 * Conic gradient renderer
 */
const ConicGradient: React.FC<{
  colors: string[];
  stops?: GradientStop[];
  animate: boolean;
  speed: number;
  opacity: number;
}> = ({ colors, stops, animate, speed, opacity }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let rotation = 0;

  if (animate) {
    rotation = (frame * speed) / fps;
  }

  const gradientStops = generateGradientStops(colors, stops);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        opacity,
        background: `conic-gradient(from ${rotation}deg at 50% 50%, ${gradientStops})`,
      }}
    />
  );
};

/**
 * Mesh gradient renderer (multiple overlapping radial gradients)
 */
const MeshGradient: React.FC<{
  colors: string[];
  animate: boolean;
  speed: number;
  opacity: number;
}> = ({ colors, animate, speed, opacity }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const positions = [
    { x: 20, y: 20 },
    { x: 80, y: 20 },
    { x: 50, y: 50 },
    { x: 20, y: 80 },
    { x: 80, y: 80 },
  ];

  const animatedPositions = positions.map((pos, i) => {
    if (!animate) return pos;

    const offset = (i * Math.PI * 2) / positions.length;
    const time = (frame * speed) / fps;

    return {
      x: pos.x + Math.sin(time + offset) * 15,
      y: pos.y + Math.cos(time + offset) * 15,
    };
  });

  const gradients = colors.slice(0, 5).map((color, i) => {
    const pos = animatedPositions[i] || animatedPositions[0];
    return `radial-gradient(ellipse at ${pos.x}% ${pos.y}%, ${color}60 0%, transparent 50%)`;
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        opacity,
        background: gradients.join(", "),
      }}
    />
  );
};

/**
 * Aurora gradient renderer (northern lights effect)
 */
const AuroraGradient: React.FC<{
  colors: string[];
  animate: boolean;
  speed: number;
  opacity: number;
}> = ({ colors, animate, speed, opacity }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const time = (frame * speed) / fps;

  const layers = colors.map((color, i) => {
    const offset = (i * Math.PI) / colors.length;
    const yPos = animate ? 30 + Math.sin(time + offset) * 20 : 30 + i * 10;
    const xPos = animate ? 50 + Math.cos(time * 0.5 + offset) * 30 : 50;
    const skew = animate ? Math.sin(time * 0.3 + offset) * 10 : 0;

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 50% at ${xPos}% ${yPos}%, ${color}40 0%, transparent 50%)`,
          transform: `skewY(${skew}deg)`,
          mixBlendMode: "screen",
        }}
      />
    );
  });

  return (
    <div style={{ width: "100%", height: "100%", opacity, position: "relative" }}>
      {layers}
    </div>
  );
};

/**
 * Sunset gradient renderer
 */
const SunsetGradient: React.FC<{
  animate: boolean;
  speed: number;
  opacity: number;
}> = ({ animate, speed, opacity }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const time = (frame * speed) / fps;
  const sunPosition = animate ? 70 + Math.sin(time * 0.1) * 10 : 70;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        opacity,
        background: `
          radial-gradient(circle at 50% ${sunPosition}%, #ff6b35 0%, transparent 30%),
          linear-gradient(to bottom,
            #0f0c29 0%,
            #302b63 30%,
            #24243e 50%,
            #ff6b35 70%,
            #ff8e53 85%,
            #ffd89b 100%
          )
        `,
      }}
    />
  );
};

/**
 * AnimatedGradient component - Animated gradient backgrounds for Remotion compositions
 */
export const AnimatedGradient: React.FC<AnimatedGradientProps> = ({
  type = "linear",
  colors = ["#3b82f6", "#8b5cf6", "#ec4899"],
  stops,
  speed = 30,
  angle = 45,
  animate = true,
  animationStyle = "rotate",
  opacity = 1,
  style = {},
}) => {
  const renderGradient = () => {
    switch (type) {
      case "linear":
        return (
          <LinearGradient
            colors={colors}
            stops={stops}
            angle={angle}
            animate={animate}
            animationStyle={animationStyle}
            speed={speed}
            opacity={opacity}
          />
        );
      case "radial":
        return (
          <RadialGradient
            colors={colors}
            stops={stops}
            animate={animate}
            animationStyle={animationStyle}
            speed={speed}
            opacity={opacity}
          />
        );
      case "conic":
        return (
          <ConicGradient
            colors={colors}
            stops={stops}
            animate={animate}
            speed={speed}
            opacity={opacity}
          />
        );
      case "mesh":
        return (
          <MeshGradient
            colors={colors}
            animate={animate}
            speed={speed}
            opacity={opacity}
          />
        );
      case "aurora":
        return (
          <AuroraGradient
            colors={colors}
            animate={animate}
            speed={speed}
            opacity={opacity}
          />
        );
      case "sunset":
        return (
          <SunsetGradient
            animate={animate}
            speed={speed}
            opacity={opacity}
          />
        );
      default:
        return null;
    }
  };

  return <AbsoluteFill style={style}>{renderGradient()}</AbsoluteFill>;
};

/**
 * Get all available gradient types
 */
export const getGradientTypes = (): GradientType[] => {
  return ["linear", "radial", "conic", "mesh", "aurora", "sunset"];
};

/**
 * Preset gradient color schemes
 */
export const gradientPresets = {
  ocean: ["#0077b6", "#00b4d8", "#90e0ef"],
  sunset: ["#ff6b35", "#ff8e53", "#ffd89b"],
  forest: ["#2d6a4f", "#40916c", "#74c69d"],
  midnight: ["#0f0c29", "#302b63", "#24243e"],
  candy: ["#ff0080", "#ff8c00", "#40e0d0"],
  neon: ["#00ff87", "#60efff", "#ff1493"],
  fire: ["#ff0000", "#ff7300", "#fffb00"],
  ice: ["#a8edea", "#fed6e3", "#d299c2"],
  purple: ["#7f00ff", "#e100ff", "#ff00ff"],
  earth: ["#8b4513", "#cd853f", "#f4a460"],
} as const;

export type GradientPreset = keyof typeof gradientPresets;
