import { useCurrentFrame, interpolate } from "remotion";

interface EducationalBackgroundProps {
  showTopBar?: boolean;
  showGrid?: boolean;
}

// Educational Hybrid theme colors
export const eduTheme = {
  background: {
    primary: "#ffffff",
    secondary: "#f8fafc",
    gradient: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
  },
  text: {
    primary: "#0f172a",
    secondary: "#64748b",
    accent: "#0369a1",
  },
  accent: {
    primary: "#0284c7",
    secondary: "#0ea5e9",
  },
  card: {
    background: "#ffffff",
    border: "#e2e8f0",
    shadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
  },
};

export const EducationalBackground: React.FC<EducationalBackgroundProps> = ({
  showTopBar = true,
  showGrid = true,
}) => {
  const frame = useCurrentFrame();

  // Very subtle grid animation
  const gridOpacity = interpolate(
    Math.sin(frame * 0.01),
    [-1, 1],
    [0.02, 0.04]
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: eduTheme.background.gradient,
        overflow: "hidden",
      }}
    >
      {/* Subtle grid pattern */}
      {showGrid && (
        <svg
          width="1920"
          height="1080"
          style={{ position: "absolute", inset: 0, opacity: gridOpacity }}
        >
          <defs>
            <pattern
              id="eduGrid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke={eduTheme.accent.primary}
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="1920" height="1080" fill="url(#eduGrid)" />
        </svg>
      )}

      {/* Top accent bar */}
      {showTopBar && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${eduTheme.accent.primary}, ${eduTheme.accent.secondary})`,
          }}
        />
      )}

      {/* Subtle corner accents */}
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 40,
          width: 200,
          height: 200,
          background: `radial-gradient(circle at top right, ${eduTheme.accent.primary}08 0%, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 40,
          width: 200,
          height: 200,
          background: `radial-gradient(circle at bottom left, ${eduTheme.accent.secondary}06 0%, transparent 70%)`,
        }}
      />
    </div>
  );
};
