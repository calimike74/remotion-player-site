import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  WaveformIcon,
  SpeakerIcon,
  EarIcon,
  FrequencyIcon,
  CompressionIcon,
  PeriodIcon,
  AmplitudeIcon,
  CycleIcon,
  NoteIcon,
  MicrophoneIcon,
} from "../shared/icons";

const icons = [
  { Icon: WaveformIcon, name: "Waveform" },
  { Icon: SpeakerIcon, name: "Speaker" },
  { Icon: EarIcon, name: "Ear" },
  { Icon: FrequencyIcon, name: "Frequency" },
  { Icon: CompressionIcon, name: "Compression" },
  { Icon: PeriodIcon, name: "Period" },
  { Icon: AmplitudeIcon, name: "Amplitude" },
  { Icon: CycleIcon, name: "Cycle" },
  { Icon: NoteIcon, name: "Note" },
  { Icon: MicrophoneIcon, name: "Microphone" },
];

export const IconPreview: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
        padding: 60,
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #0284c7, #0ea5e9)",
        }}
      />

      {/* Title */}
      <h1
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: "#0f172a",
          margin: "0 0 20px 0",
          letterSpacing: -1,
        }}
      >
        Icon Library
      </h1>
      <p
        style={{
          fontSize: 22,
          color: "#64748b",
          margin: "0 0 50px 0",
        }}
      >
        Educational icons for Music Technology videos
      </p>

      {/* Icon grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 40,
          maxWidth: 1400,
        }}
      >
        {icons.map(({ Icon, name }, i) => {
          const delay = i * 3;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 15 },
          });

          return (
            <div
              key={name}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                opacity: progress,
                transform: `translateY(${(1 - progress) * 20}px)`,
              }}
            >
              <div
                style={{
                  width: 120,
                  height: 120,
                  backgroundColor: "#ffffff",
                  borderRadius: 16,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                  border: "1px solid #e2e8f0",
                }}
              >
                <Icon size={64} color="#0284c7" />
              </div>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: "#0f172a",
                }}
              >
                {name}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
