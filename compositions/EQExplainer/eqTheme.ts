/**
 * EQ Explainer Theme
 * Dark professional theme optimized for frequency visualization
 */

export const eqTheme = {
  background: {
    primary: "#0F172A",      // Dark slate
    secondary: "#1E293B",    // Slightly lighter
    gradient: "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)",
  },

  card: {
    background: "#1E293B",
    border: "#334155",
    shadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
  },

  // Graphic EQ uses blue tones
  graphicEQ: {
    primary: "#3B82F6",      // Blue-500
    secondary: "#60A5FA",    // Blue-400
    accent: "#93C5FD",       // Blue-300
    glow: "rgba(59, 130, 246, 0.3)",
  },

  // Parametric EQ uses emerald tones
  parametricEQ: {
    primary: "#10B981",      // Emerald-500
    secondary: "#34D399",    // Emerald-400
    accent: "#6EE7B7",       // Emerald-300
    glow: "rgba(16, 185, 129, 0.3)",
  },

  // Frequency range colors
  frequency: {
    subBass: "#EF4444",      // Red - 20-60Hz
    bass: "#F97316",         // Orange - 60-250Hz
    lowMid: "#EAB308",       // Yellow - 250-500Hz
    mid: "#22C55E",          // Green - 500Hz-2kHz
    highMid: "#06B6D4",      // Cyan - 2-4kHz
    presence: "#8B5CF6",     // Purple - 4-6kHz
    brilliance: "#EC4899",   // Pink - 6-20kHz
  },

  text: {
    primary: "#F8FAFC",      // Slate-50
    secondary: "#94A3B8",    // Slate-400
    muted: "#64748B",        // Slate-500
    accent: "#38BDF8",       // Sky-400
  },

  grid: {
    line: "#334155",
    label: "#64748B",
  },

  signal: {
    input: "#FBBF24",        // Amber for input signal
    output: "#A78BFA",       // Violet for output signal
  },
};

// Standard graphic EQ frequency bands
export const graphicEQBands = {
  octave: [31, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000],
  halfOctave: [31, 44, 63, 87, 125, 175, 250, 350, 500, 700, 1000, 1400, 2000, 2800, 4000, 5600, 8000, 11000, 16000, 20000],
  thirdOctave: [25, 31, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1200, 1600, 2000, 2500, 3200, 4000, 5000, 6300, 8000, 10000, 12000, 16000, 20000],
};

// Utility: Convert frequency to X position on log scale
export const freqToX = (freq: number, width: number, minFreq = 20, maxFreq = 20000): number => {
  const minLog = Math.log10(minFreq);
  const maxLog = Math.log10(maxFreq);
  return ((Math.log10(freq) - minLog) / (maxLog - minLog)) * width;
};

// Utility: Convert dB gain to Y position
export const gainToY = (gain: number, height: number, minGain = -24, maxGain = 24): number => {
  const normalized = (gain - minGain) / (maxGain - minGain);
  return height * (1 - normalized); // Invert for SVG coordinates
};

// Utility: Format frequency for display
export const formatFreq = (freq: number): string => {
  if (freq >= 1000) {
    return `${freq / 1000}k`;
  }
  return freq.toString();
};

// Utility: Get frequency band color
export const getFreqColor = (freq: number): string => {
  if (freq < 60) return eqTheme.frequency.subBass;
  if (freq < 250) return eqTheme.frequency.bass;
  if (freq < 500) return eqTheme.frequency.lowMid;
  if (freq < 2000) return eqTheme.frequency.mid;
  if (freq < 4000) return eqTheme.frequency.highMid;
  if (freq < 6000) return eqTheme.frequency.presence;
  return eqTheme.frequency.brilliance;
};
