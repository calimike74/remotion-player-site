/**
 * Shared Asset Component Library for Remotion Compositions
 *
 * This library provides reusable, animated components for building
 * professional video compositions with consistent styling.
 *
 * @example
 * import { Icon, BackgroundPattern, GlassCard, AnimatedGradient } from '../shared/assets';
 *
 * const MyComposition = () => (
 *   <AbsoluteFill>
 *     <AnimatedGradient type="mesh" colors={["#3b82f6", "#8b5cf6"]} />
 *     <BackgroundPattern pattern="grid" opacity={0.2} />
 *     <GlassCard animate>
 *       <Icon name="speaker" animation="scaleIn" />
 *     </GlassCard>
 *   </AbsoluteFill>
 * );
 */

// Icon component and types
export { Icon, getBuiltInIconNames } from "./Icon";
export type { IconProps, BuiltInIconName, AnimationType } from "./Icon";

// Background pattern component and types
export { BackgroundPattern, getPatternTypes } from "./BackgroundPattern";
export type { BackgroundPatternProps, PatternType } from "./BackgroundPattern";

// Glass card component and types
export { GlassCard, getGlassVariants } from "./GlassCard";
export type { GlassCardProps, GlassVariant } from "./GlassCard";

// Animated gradient component and types
export {
  AnimatedGradient,
  getGradientTypes,
  gradientPresets,
} from "./AnimatedGradient";
export type {
  AnimatedGradientProps,
  GradientType,
  GradientStop,
  GradientPreset,
} from "./AnimatedGradient";
