import React from "react";

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

const defaultProps = {
  size: 48,
  color: "#0284c7", // Educational Hybrid accent
  strokeWidth: 2,
};

// Waveform / Sound Wave Icon
export const WaveformIcon: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path
      d="M4 24h4l4-12 4 24 4-18 4 12 4-6 4 12 4-18 4 12h4"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Speaker / Audio Output Icon
export const SpeakerIcon: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path
      d="M12 18h-4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4l10 8V10l-10 8z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M30 18a6 6 0 0 1 0 12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <path
      d="M34 12a12 12 0 0 1 0 24"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
);

// Ear / Hearing Icon
export const EarIcon: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path
      d="M36 20c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 4 2 7 4 10 2 3 2 6 2 10h4c0-2 0-5 2-8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M24 16a4 4 0 0 1 4 4c0 2-1 3-2 4s-2 2-2 4"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Frequency / Hz Icon
export const FrequencyIcon: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path
      d="M6 24c0 0 4-10 9-10s5 20 9 20 5-20 9-20 5 20 9 20"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text
      x="24"
      y="44"
      textAnchor="middle"
      fill={color}
      fontSize="10"
      fontWeight="600"
      fontFamily="system-ui, sans-serif"
    >
      Hz
    </text>
  </svg>
);

// Compression / Dynamics Icon
export const CompressionIcon: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* Input signal - large amplitude */}
    <path
      d="M4 24l4-14 4 28 4-28 4 14"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.4}
    />
    {/* Arrow */}
    <path
      d="M22 24h4m-2-3l3 3-3 3"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Output signal - compressed amplitude */}
    <path
      d="M28 24l4-8 4 16 4-16 4 8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Clock / Period Icon
export const PeriodIcon: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle
      cx="24"
      cy="24"
      r="18"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <path
      d="M24 12v12l8 4"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text
      x="24"
      y="44"
      textAnchor="middle"
      fill={color}
      fontSize="8"
      fontWeight="600"
      fontFamily="system-ui, sans-serif"
    >
      T
    </text>
  </svg>
);

// Amplitude Icon (vertical arrow showing displacement)
export const AmplitudeIcon: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* Baseline */}
    <path
      d="M8 24h32"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      opacity={0.3}
    />
    {/* Vertical amplitude arrow */}
    <path
      d="M24 8v32M20 12l4-4 4 4M20 36l4 4 4-4"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text
      x="38"
      y="28"
      fill={color}
      fontSize="10"
      fontWeight="600"
      fontFamily="system-ui, sans-serif"
    >
      A
    </text>
  </svg>
);

// Cycle Icon (circular arrow showing one complete cycle)
export const CycleIcon: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path
      d="M24 8a16 16 0 1 1-11.31 4.69"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <path
      d="M8 12l4.69 0.69L13.38 8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text
      x="24"
      y="28"
      textAnchor="middle"
      fill={color}
      fontSize="12"
      fontWeight="700"
      fontFamily="system-ui, sans-serif"
    >
      1
    </text>
  </svg>
);

// Musical Note Icon
export const NoteIcon: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <ellipse
      cx="14"
      cy="36"
      rx="6"
      ry="4"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <path
      d="M20 36V12l18-4v24"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <ellipse
      cx="32"
      cy="32"
      rx="6"
      ry="4"
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </svg>
);

// Microphone Icon
export const MicrophoneIcon: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect
      x="16"
      y="6"
      width="16"
      height="24"
      rx="8"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <path
      d="M10 22a14 14 0 0 0 28 0"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <path
      d="M24 36v6m-6 0h12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
);

// Export all icons
export const Icons = {
  Waveform: WaveformIcon,
  Speaker: SpeakerIcon,
  Ear: EarIcon,
  Frequency: FrequencyIcon,
  Compression: CompressionIcon,
  Period: PeriodIcon,
  Amplitude: AmplitudeIcon,
  Cycle: CycleIcon,
  Note: NoteIcon,
  Microphone: MicrophoneIcon,
};
