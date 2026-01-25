import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Built-in icon definitions as inline SVG paths
 * Optimized for animation and can be used without external files
 */
const BUILT_IN_ICONS = {
  speaker: {
    viewBox: "0 0 24 24",
    path: "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z",
  },
  ear: {
    viewBox: "0 0 24 24",
    path: "M17 20c-.29 0-.56-.06-.76-.15-.71-.37-1.21-.88-1.71-2.38-.51-1.56-1.47-2.29-2.39-3-.79-.61-1.61-1.24-2.32-2.53C9.29 10.98 9 9.93 9 9c0-2.8 2.2-5 5-5s5 2.2 5 5h2c0-3.93-3.07-7-7-7S7 5.07 7 9c0 1.26.38 2.65 1.07 3.9.91 1.65 1.98 2.48 2.85 3.15.81.62 1.39 1.07 1.71 2.05.6 1.82 1.37 2.84 2.73 3.55.51.23 1.07.35 1.64.35 2.21 0 4-1.79 4-4h-2c0 1.1-.9 2-2 2zM7.64 2.64L6.22 1.22C4.23 3.21 3 5.96 3 9s1.23 5.79 3.22 7.78l1.41-1.41C6.01 13.74 5 11.49 5 9s1.01-4.74 2.64-6.36zM11.5 9c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5-2.5 1.12-2.5 2.5z",
  },
  wave: {
    viewBox: "0 0 24 24",
    path: "M4.5 12c0-1.5.5-3 1.5-4.5s2-2.5 3-3l1 1.5c-.8.6-1.6 1.4-2.3 2.5-.7 1.1-1.1 2.3-1.2 3.5s.1 2.4.6 3.5c.5 1.1 1.2 2 2.1 2.7L8.5 20c-1.2-.9-2.2-2-2.9-3.3-.7-1.3-1.1-2.9-1.1-4.7zm5.5 0c0-.8.2-1.5.6-2.2.4-.7.9-1.2 1.5-1.5l.9 1.5c-.4.3-.7.6-1 1.1-.2.4-.4.9-.4 1.4 0 .5.1.9.3 1.3.2.4.5.8.9 1l-.9 1.6c-.7-.5-1.2-1.1-1.5-1.8-.3-.7-.4-1.5-.4-2.4zm4.5 0c0 .3.1.6.2.9.1.3.3.5.6.7l-.9 1.6c-.5-.3-.9-.8-1.2-1.3-.3-.5-.5-1.2-.5-1.9s.2-1.4.5-1.9c.3-.6.7-1 1.2-1.3l.9 1.5c-.3.2-.5.4-.6.7-.1.3-.2.6-.2 1z",
  },
  waveform: {
    viewBox: "0 0 24 24",
    path: "M2 12h2v8H2zm4-4h2v12H6zm4-4h2v20h-2zm4 4h2v12h-2zm4-4h2v20h-2z",
  },
  music: {
    viewBox: "0 0 24 24",
    path: "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z",
  },
  headphones: {
    viewBox: "0 0 24 24",
    path: "M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z",
  },
  frequency: {
    viewBox: "0 0 24 24",
    path: "M7.5 5.6 10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-7.63 5.29a.996.996 0 0 0-1.41 0L1.29 18.96a.996.996 0 0 0 0 1.41l2.34 2.34c.39.39 1.02.39 1.41 0L16.7 11.05a.996.996 0 0 0 0-1.41l-2.33-2.35z",
  },
  check: {
    viewBox: "0 0 24 24",
    path: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
  },
  close: {
    viewBox: "0 0 24 24",
    path: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
  },
  info: {
    viewBox: "0 0 24 24",
    path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z",
  },
  warning: {
    viewBox: "0 0 24 24",
    path: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
  },
  play: {
    viewBox: "0 0 24 24",
    path: "M8 5v14l11-7z",
  },
  pause: {
    viewBox: "0 0 24 24",
    path: "M6 19h4V5H6v14zm8-14v14h4V5h-4z",
  },
} as const;

export type BuiltInIconName = keyof typeof BUILT_IN_ICONS;

export type AnimationType = "none" | "fadeIn" | "scaleIn" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "pulse" | "bounce" | "spin";

export interface IconProps {
  /** Built-in icon name */
  name?: BuiltInIconName;
  /** Custom SVG path (used if name is not provided) */
  customPath?: string;
  /** Custom viewBox for custom paths */
  customViewBox?: string;
  /** Icon size in pixels */
  size?: number;
  /** Icon color (CSS color value) */
  color?: string;
  /** Animation type */
  animation?: AnimationType;
  /** Animation delay in frames */
  animationDelay?: number;
  /** Animation duration in frames */
  animationDuration?: number;
  /** Additional CSS styles */
  style?: React.CSSProperties;
  /** Stroke width for outlined icons */
  strokeWidth?: number;
  /** Whether to use stroke instead of fill */
  stroke?: boolean;
  /** Opacity (0-1) */
  opacity?: number;
}

/**
 * A reusable icon component for Remotion compositions
 * Supports built-in icons and custom SVG paths with various animations
 */
export const Icon: React.FC<IconProps> = ({
  name,
  customPath,
  customViewBox = "0 0 24 24",
  size = 48,
  color = "#ffffff",
  animation = "none",
  animationDelay = 0,
  animationDuration = 30,
  style = {},
  strokeWidth = 2,
  stroke = false,
  opacity: baseOpacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - animationDelay);

  // Get icon definition
  const iconDef = name ? BUILT_IN_ICONS[name] : null;
  const viewBox = iconDef?.viewBox || customViewBox;
  const path = iconDef?.path || customPath || "";

  // Calculate animation values
  let opacity = baseOpacity;
  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let rotation = 0;

  switch (animation) {
    case "fadeIn":
      opacity = interpolate(adjustedFrame, [0, animationDuration], [0, baseOpacity], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;

    case "scaleIn":
      scale = spring({
        frame: adjustedFrame,
        fps,
        config: { damping: 12, stiffness: 200 },
      });
      break;

    case "slideUp":
      translateY = interpolate(adjustedFrame, [0, animationDuration], [30, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      opacity = interpolate(adjustedFrame, [0, animationDuration * 0.5], [0, baseOpacity], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;

    case "slideDown":
      translateY = interpolate(adjustedFrame, [0, animationDuration], [-30, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      opacity = interpolate(adjustedFrame, [0, animationDuration * 0.5], [0, baseOpacity], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;

    case "slideLeft":
      translateX = interpolate(adjustedFrame, [0, animationDuration], [30, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      opacity = interpolate(adjustedFrame, [0, animationDuration * 0.5], [0, baseOpacity], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;

    case "slideRight":
      translateX = interpolate(adjustedFrame, [0, animationDuration], [-30, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      opacity = interpolate(adjustedFrame, [0, animationDuration * 0.5], [0, baseOpacity], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;

    case "pulse":
      const pulseProgress = (adjustedFrame % 60) / 60;
      scale = 1 + Math.sin(pulseProgress * Math.PI * 2) * 0.1;
      break;

    case "bounce":
      scale = spring({
        frame: adjustedFrame,
        fps,
        config: { damping: 8, stiffness: 300 },
      });
      break;

    case "spin":
      rotation = (adjustedFrame / fps) * 360;
      break;
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        transform: `scale(${scale}) translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`,
        ...style,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill={stroke ? "none" : color}
        stroke={stroke ? color : "none"}
        strokeWidth={stroke ? strokeWidth : 0}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={path} />
      </svg>
    </div>
  );
};

/**
 * Get all available built-in icon names
 */
export const getBuiltInIconNames = (): BuiltInIconName[] => {
  return Object.keys(BUILT_IN_ICONS) as BuiltInIconName[];
};
