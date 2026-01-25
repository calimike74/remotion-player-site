import { useCurrentFrame, interpolate } from "remotion";

interface BackgroundProps {
  variant?: "default" | "subtle" | "vibrant";
}

export const Background: React.FC<BackgroundProps> = ({ variant = "default" }) => {
  const frame = useCurrentFrame();

  const gradientOffset1 = Math.sin(frame * 0.01) * 10;
  const gradientOffset2 = Math.cos(frame * 0.008) * 15;
  const gradientOffset3 = Math.sin(frame * 0.012 + 1) * 12;

  const particles = Array.from({ length: 30 }, (_, i) => ({
    x: (i * 67 + frame * (0.2 + i * 0.02)) % 1920,
    y: (i * 43 + frame * (0.1 + i * 0.01)) % 1080,
    size: 2 + (i % 3),
    opacity: 0.1 + (i % 5) * 0.05,
  }));

  const gridOpacity = interpolate(Math.sin(frame * 0.02), [-1, 1], [0.03, 0.08]);

  const colorSets = {
    default: { bg1: "#0a0a1a", bg2: "#0d1025", accent1: "#3b82f6", accent2: "#8b5cf6", accent3: "#06b6d4" },
    subtle: { bg1: "#080812", bg2: "#0a0d1c", accent1: "#2563eb", accent2: "#7c3aed", accent3: "#0891b2" },
    vibrant: { bg1: "#0c0c20", bg2: "#12102a", accent1: "#60a5fa", accent2: "#a78bfa", accent3: "#22d3ee" },
  };

  const colors = colorSets[variant];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 80% 50% at ${50 + gradientOffset1}% ${30 + gradientOffset2}%, ${colors.accent1}15 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at ${70 + gradientOffset3}% ${60 - gradientOffset1}%, ${colors.accent2}10 0%, transparent 50%),
            radial-gradient(ellipse 50% 30% at ${30 - gradientOffset2}% ${80 + gradientOffset3}%, ${colors.accent3}08 0%, transparent 50%),
            linear-gradient(180deg, ${colors.bg1} 0%, ${colors.bg2} 100%)
          `,
        }}
      />
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, opacity: gridOpacity }}>
        <defs>
          <pattern id="gridV2" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={colors.accent1} strokeWidth="0.5" />
          </pattern>
          <linearGradient id="gridFadeV2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.5" />
            <stop offset="50%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0.3" />
          </linearGradient>
          <mask id="gridMaskV2">
            <rect width="1920" height="1080" fill="url(#gridFadeV2)" />
          </mask>
        </defs>
        <rect width="1920" height="1080" fill="url(#gridV2)" mask="url(#gridMaskV2)" />
      </svg>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        {particles.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.size}
            fill={i % 2 === 0 ? colors.accent1 : colors.accent2}
            opacity={p.opacity}
          />
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, ${colors.bg1}80 100%)`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
