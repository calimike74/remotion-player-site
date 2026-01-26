import { useCurrentFrame, interpolate } from "remotion";
import { eqTheme } from "./eqTheme";

/**
 * Dark professional background for EQ content
 * Features subtle grid and frequency visualization hints
 */
export const EQBackground: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle pulsing for the grid
  const gridOpacity = interpolate(
    Math.sin(frame * 0.02),
    [-1, 1],
    [0.03, 0.06]
  );

  // Subtle gradient animation
  const gradientShift = interpolate(frame, [0, 300], [0, 10], {
    extrapolateRight: "extend",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: eqTheme.background.gradient,
        overflow: "hidden",
      }}
    >
      {/* Frequency grid pattern */}
      <svg
        width="1920"
        height="1080"
        style={{ position: "absolute", inset: 0, opacity: gridOpacity }}
      >
        <defs>
          <pattern
            id="eqGrid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke={eqTheme.grid.line}
              strokeWidth="0.5"
            />
          </pattern>
          {/* Radial gradient for corner glow */}
          <radialGradient id="cornerGlow1" cx="0%" cy="0%" r="50%">
            <stop offset="0%" stopColor={eqTheme.graphicEQ.primary} stopOpacity="0.08" />
            <stop offset="100%" stopColor={eqTheme.graphicEQ.primary} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cornerGlow2" cx="100%" cy="100%" r="50%">
            <stop offset="0%" stopColor={eqTheme.parametricEQ.primary} stopOpacity="0.06" />
            <stop offset="100%" stopColor={eqTheme.parametricEQ.primary} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Base grid */}
        <rect width="1920" height="1080" fill="url(#eqGrid)" />

        {/* Corner glows */}
        <rect width="600" height="600" fill="url(#cornerGlow1)" />
        <rect x="1320" y="480" width="600" height="600" fill="url(#cornerGlow2)" />
      </svg>

      {/* Top accent bar with gradient */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${eqTheme.graphicEQ.primary}, ${eqTheme.parametricEQ.primary})`,
        }}
      />

      {/* Subtle frequency bands hint at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg,
            ${eqTheme.frequency.subBass}40,
            ${eqTheme.frequency.bass}40,
            ${eqTheme.frequency.lowMid}40,
            ${eqTheme.frequency.mid}40,
            ${eqTheme.frequency.highMid}40,
            ${eqTheme.frequency.presence}40,
            ${eqTheme.frequency.brilliance}40
          )`,
          opacity: 0.5,
        }}
      />
    </div>
  );
};
