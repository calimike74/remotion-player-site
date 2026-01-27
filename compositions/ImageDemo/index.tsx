import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Sequence,
} from "remotion";
import { EducationalBackground, eduTheme } from "../shared/EducationalBackground";

export const ImageDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fade out at end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
      }}
    >
      <EducationalBackground />

      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* Scene 1: Title with Ken Burns on studio image */}
        <Sequence from={0} durationInFrames={120}>
          <TitleScene />
        </Sequence>

        {/* Scene 2: ADSR Infographic with callouts */}
        <Sequence from={120} durationInFrames={180}>
          <InfographicScene />
        </Sequence>

        {/* Scene 3: Synthesizer Kit with zoom */}
        <Sequence from={300} durationInFrames={150}>
          <SynthKitScene />
        </Sequence>

        {/* Scene 4: Split comparison */}
        <Sequence from={450} durationInFrames={150}>
          <ComparisonScene />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 1: Title with Ken Burns effect on background
const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  const subtitleProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15 },
  });

  // Ken Burns effect - slow zoom and pan
  const scale = interpolate(frame, [0, 120], [1, 1.15], {
    extrapolateRight: "clamp",
  });
  const translateX = interpolate(frame, [0, 120], [0, -30], {
    extrapolateRight: "clamp",
  });

  // Exit animation
  const exitOpacity = interpolate(frame, [90, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: exitOpacity }}>
      {/* Background image with Ken Burns */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile("assets/image_fx_-4.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale}) translateX(${translateX}px)`,
            filter: "brightness(0.4)",
          }}
        />
      </div>

      {/* Overlay gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.4) 100%)",
        }}
      />

      {/* Title content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
        }}
      >
        <h1
          style={{
            fontSize: 90,
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
            transform: `translateY(${interpolate(titleProgress, [0, 1], [50, 0])}px)`,
            opacity: titleProgress,
            textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          }}
        >
          Using Images in Remotion
        </h1>
        <p
          style={{
            fontSize: 36,
            color: "rgba(255, 255, 255, 0.8)",
            margin: 0,
            transform: `translateY(${interpolate(subtitleProgress, [0, 1], [30, 0])}px)`,
            opacity: subtitleProgress,
          }}
        >
          Ken Burns, Zoom, Pan & Animation Techniques
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Educational infographic with animated callouts
const InfographicScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imageProgress = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  const callout1Progress = spring({
    frame: frame - 40,
    fps,
    config: { damping: 12 },
  });

  const callout2Progress = spring({
    frame: frame - 70,
    fps,
    config: { damping: 12 },
  });

  const callout3Progress = spring({
    frame: frame - 100,
    fps,
    config: { damping: 12 },
  });

  // Exit animation
  const exitOpacity = interpolate(frame, [150, 180], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
        opacity: exitOpacity,
      }}
    >
      {/* Main infographic */}
      <div
        style={{
          position: "relative",
          transform: `scale(${imageProgress})`,
        }}
      >
        <Img
          src={staticFile("assets/Gemini_Generated_Image_gw65gigw65gigw65.png")}
          style={{
            width: 1400,
            borderRadius: 16,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          }}
        />

        {/* Animated callout 1 - Attack */}
        <div
          style={{
            position: "absolute",
            top: 200,
            left: -200,
            transform: `translateX(${interpolate(callout1Progress, [0, 1], [-50, 0])}px)`,
            opacity: callout1Progress,
          }}
        >
          <CalloutBox
            title="Attack"
            description="Time to reach maximum"
            color={eduTheme.accent.primary}
          />
        </div>

        {/* Animated callout 2 - Sustain */}
        <div
          style={{
            position: "absolute",
            top: 100,
            right: -180,
            transform: `translateX(${interpolate(callout2Progress, [0, 1], [50, 0])}px)`,
            opacity: callout2Progress,
          }}
        >
          <CalloutBox
            title="Sustain"
            description="Level while held"
            color="#16a34a"
          />
        </div>

        {/* Animated callout 3 - Release */}
        <div
          style={{
            position: "absolute",
            bottom: 150,
            right: -180,
            transform: `translateX(${interpolate(callout3Progress, [0, 1], [50, 0])}px)`,
            opacity: callout3Progress,
          }}
        >
          <CalloutBox
            title="Release"
            description="Fade out time"
            color="#dc2626"
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Callout component
const CalloutBox: React.FC<{
  title: string;
  description: string;
  color: string;
}> = ({ title, description, color }) => (
  <div
    style={{
      backgroundColor: "#ffffff",
      padding: "16px 24px",
      borderRadius: 12,
      borderLeft: `4px solid ${color}`,
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      minWidth: 160,
    }}
  >
    <div style={{ fontSize: 22, fontWeight: 700, color }}>{title}</div>
    <div style={{ fontSize: 16, color: eduTheme.text.secondary }}>{description}</div>
  </div>
);

// Scene 3: Synthesizer kit with zoom effect
const SynthKitScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  // Zoom into the image
  const scale = interpolate(frame, [0, 150], [1, 1.3], {
    extrapolateRight: "clamp",
  });

  // Pan to focus on components
  const translateY = interpolate(frame, [30, 120], [0, 50], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit animation
  const exitOpacity = interpolate(frame, [120, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        gap: 60,
        padding: 80,
        opacity: exitOpacity,
      }}
    >
      {/* Image with zoom/pan */}
      <div
        style={{
          flex: 1,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          transform: `scale(${entryProgress})`,
        }}
      >
        <Img
          src={staticFile("assets/Gemini_Generated_Image_csramicsramicsra.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale}) translateY(${translateY}px)`,
          }}
        />
      </div>

      {/* Text content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 32,
        }}
      >
        <h2
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: eduTheme.text.primary,
            margin: 0,
            opacity: entryProgress,
            transform: `translateY(${interpolate(entryProgress, [0, 1], [30, 0])}px)`,
          }}
        >
          Signal Flow
        </h2>

        {/* Flow diagram */}
        {["OSC", "FILTER", "AMP", "OUTPUT"].map((step, i) => {
          const stepProgress = spring({
            frame: frame - 30 - i * 15,
            fps,
            config: { damping: 15 },
          });
          return (
            <div
              key={step}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                opacity: stepProgress,
                transform: `translateX(${interpolate(stepProgress, [0, 1], [50, 0])}px)`,
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  backgroundColor: eduTheme.accent.primary,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 20,
                }}
              >
                {i + 1}
              </div>
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 600,
                  color: eduTheme.text.primary,
                }}
              >
                {step}
              </span>
              {i < 3 && (
                <span style={{ color: eduTheme.text.secondary, fontSize: 28 }}>
                  →
                </span>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Split comparison of two images
const ComparisonScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftProgress = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  const rightProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15 },
  });

  const labelProgress = spring({
    frame: frame - 40,
    fps,
    config: { damping: 15 },
  });

  // Exit animation
  const exitOpacity = interpolate(frame, [120, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 60,
        gap: 40,
        opacity: exitOpacity,
      }}
    >
      {/* Title */}
      <h2
        style={{
          fontSize: 52,
          fontWeight: 700,
          color: eduTheme.text.primary,
          textAlign: "center",
          margin: 0,
          opacity: labelProgress,
        }}
      >
        Home Studio vs Professional Studio
      </h2>

      {/* Image comparison */}
      <div
        style={{
          flex: 1,
          display: "flex",
          gap: 40,
        }}
      >
        {/* Left image */}
        <div
          style={{
            flex: 1,
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.12)",
            transform: `translateX(${interpolate(leftProgress, [0, 1], [-100, 0])}px)`,
            opacity: leftProgress,
          }}
        >
          <Img
            src={staticFile("assets/image_fx_-3.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: 8,
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            Home Studio
          </div>
        </div>

        {/* Right image */}
        <div
          style={{
            flex: 1,
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.12)",
            transform: `translateX(${interpolate(rightProgress, [0, 1], [100, 0])}px)`,
            opacity: rightProgress,
          }}
        >
          <Img
            src={staticFile("assets/image_fx_-4.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: 8,
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            Professional Studio
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
