import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export type GlassVariant = "default" | "dark" | "light" | "colored" | "frosted";

export interface GlassCardProps {
  /** Card content */
  children?: React.ReactNode;
  /** Glass effect variant */
  variant?: GlassVariant;
  /** Width of the card (CSS value) */
  width?: string | number;
  /** Height of the card (CSS value) */
  height?: string | number;
  /** Border radius in pixels */
  borderRadius?: number;
  /** Background blur amount in pixels */
  blur?: number;
  /** Background opacity (0-1) */
  backgroundOpacity?: number;
  /** Border opacity (0-1) */
  borderOpacity?: number;
  /** Accent color for colored variant */
  accentColor?: string;
  /** Padding in pixels */
  padding?: number;
  /** Whether to animate entrance */
  animate?: boolean;
  /** Animation delay in frames */
  animationDelay?: number;
  /** Additional CSS styles */
  style?: React.CSSProperties;
  /** Shadow intensity (0-1) */
  shadowIntensity?: number;
  /** Whether to show glow effect */
  glow?: boolean;
  /** Glow color */
  glowColor?: string;
}

/**
 * Get variant-specific styles
 */
const getVariantStyles = (
  variant: GlassVariant,
  backgroundOpacity: number,
  borderOpacity: number,
  accentColor: string
): {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
} => {
  switch (variant) {
    case "dark":
      return {
        backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity})`,
        borderColor: `rgba(255, 255, 255, ${borderOpacity * 0.2})`,
        textColor: "#ffffff",
      };
    case "light":
      return {
        backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})`,
        borderColor: `rgba(255, 255, 255, ${borderOpacity})`,
        textColor: "#1a1a2e",
      };
    case "colored":
      // Parse accent color and add opacity
      const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      };
      return {
        backgroundColor: hexToRgba(accentColor, backgroundOpacity * 0.5),
        borderColor: hexToRgba(accentColor, borderOpacity),
        textColor: "#ffffff",
      };
    case "frosted":
      return {
        backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity * 0.15})`,
        borderColor: `rgba(255, 255, 255, ${borderOpacity * 0.3})`,
        textColor: "#ffffff",
      };
    default:
      return {
        backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity * 0.1})`,
        borderColor: `rgba(255, 255, 255, ${borderOpacity * 0.2})`,
        textColor: "#ffffff",
      };
  }
};

/**
 * GlassCard component - A glassmorphism card for content containers
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = "default",
  width = "auto",
  height = "auto",
  borderRadius = 20,
  blur = 20,
  backgroundOpacity = 0.1,
  borderOpacity = 0.2,
  accentColor = "#3b82f6",
  padding = 24,
  animate = false,
  animationDelay = 0,
  style = {},
  shadowIntensity = 0.3,
  glow = false,
  glowColor = "#3b82f6",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - animationDelay);

  // Animation values
  let opacity = 1;
  let scale = 1;
  let translateY = 0;

  if (animate) {
    scale = spring({
      frame: adjustedFrame,
      fps,
      config: { damping: 15, stiffness: 150 },
    });

    opacity = interpolate(adjustedFrame, [0, 20], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    translateY = interpolate(adjustedFrame, [0, 20], [20, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  const variantStyles = getVariantStyles(variant, backgroundOpacity, borderOpacity, accentColor);

  const glowStyle = glow
    ? {
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, ${shadowIntensity}),
          0 0 40px ${glowColor}30,
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
      }
    : {
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, ${shadowIntensity}),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
      };

  return (
    <div
      style={{
        width,
        height,
        padding,
        borderRadius,
        backgroundColor: variantStyles.backgroundColor,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        border: `1px solid ${variantStyles.borderColor}`,
        color: variantStyles.textColor,
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
        ...glowStyle,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Get all available glass variants
 */
export const getGlassVariants = (): GlassVariant[] => {
  return ["default", "dark", "light", "colored", "frosted"];
};
