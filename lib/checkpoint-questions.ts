// lib/checkpoint-questions.ts

export interface CheckpointQuestion {
  id: string;
  question: string;
  type: "mcq";  // MCQ only for MVP — fast to answer in overlay
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 1 | 2 | 3;
}

export interface VideoCheckpoint {
  checkpointIndex: number;
  afterScene: string;
  frame: number;          // frame to pause at
  topicCovered: string;   // what the student just watched
  questions: CheckpointQuestion[];  // pool to pick from (mixed difficulties)
}

export interface VideoCheckpointConfig {
  videoId: string;
  topic: string;
  compositionId: string;
  totalCheckpoints: number;
  checkpoints: VideoCheckpoint[];
}

// --- Dynamic Processing Checkpoints ---

const dynamicProcessingCheckpoints: VideoCheckpointConfig = {
  videoId: "dynamic-processing-revision",
  topic: "1.9",
  compositionId: "DynamicProcessingRevision",
  totalCheckpoints: 4,
  checkpoints: [
    {
      checkpointIndex: 0,
      afterScene: "WhatIsCompression",
      frame: 570,  // 19s × 30fps
      topicCovered: "What compression is and why we use it",
      questions: [
        // Difficulty 1 — recall
        {
          id: "dp-cp1-d1-1",
          question: "What does a compressor do to loud signals that exceed the threshold?",
          type: "mcq",
          options: [
            "Reduces their level",
            "Increases their level",
            "Removes them entirely",
            "Doubles their frequency"
          ],
          correctIndex: 0,
          explanation: "A compressor reduces (attenuates) signals that exceed the threshold, making loud parts quieter to control dynamic range.",
          difficulty: 1,
        },
        {
          id: "dp-cp1-d1-2",
          question: "Dynamic range is the difference between:",
          type: "mcq",
          options: [
            "The quietest and loudest parts of a signal",
            "The lowest and highest frequencies",
            "The left and right stereo channels",
            "The input and output levels"
          ],
          correctIndex: 0,
          explanation: "Dynamic range is the difference in level between the quietest and loudest parts of an audio signal.",
          difficulty: 1,
        },
        // Difficulty 2 — understanding
        {
          id: "dp-cp1-d2-1",
          question: "Why might an engineer use compression on a vocal recording?",
          type: "mcq",
          options: [
            "To even out volume differences so quieter words aren't lost in the mix",
            "To add reverb to the vocal",
            "To increase the pitch of the vocal",
            "To convert mono to stereo"
          ],
          correctIndex: 0,
          explanation: "Compression evens out the dynamic range, ensuring quieter syllables are audible alongside louder ones without manual volume riding.",
          difficulty: 2,
        },
        {
          id: "dp-cp1-d2-2",
          question: "What happens to signals that stay below the threshold?",
          type: "mcq",
          options: [
            "They pass through unaffected",
            "They are boosted to match the threshold",
            "They are compressed at a lower ratio",
            "They are removed from the signal"
          ],
          correctIndex: 0,
          explanation: "A compressor only acts on signals that exceed the threshold. Everything below passes through unchanged.",
          difficulty: 2,
        },
        // Difficulty 3 — application
        {
          id: "dp-cp1-d3-1",
          question: "A vocalist whispers at -40 dBFS and shouts at -5 dBFS. The dynamic range is 35 dB. After compression with makeup gain, both parts sit between -20 and -10 dBFS. What has the compressor achieved?",
          type: "mcq",
          options: [
            "Reduced the dynamic range from 35 dB to 10 dB",
            "Increased the dynamic range from 10 dB to 35 dB",
            "Removed the quiet parts entirely",
            "Changed the frequency content of the signal"
          ],
          correctIndex: 0,
          explanation: "The compressor has reduced the dynamic range from 35 dB to just 10 dB — the loud and quiet parts are now much closer in level.",
          difficulty: 3,
        },
        {
          id: "dp-cp1-d3-2",
          question: "In a live concert, the drummer plays extremely dynamically. Without compression, what problem would the sound engineer face?",
          type: "mcq",
          options: [
            "Quiet hits would be inaudible and loud hits would overwhelm other instruments in the mix",
            "The drums would sound out of tune",
            "The stereo image would collapse to mono",
            "The reverb tail would be too long"
          ],
          correctIndex: 0,
          explanation: "Without compression, the extreme dynamic range would make soft ghost notes disappear in the mix while rimshots and crashes dominate, making a balanced mix impossible.",
          difficulty: 3,
        },
      ],
    },
    {
      checkpointIndex: 1,
      afterScene: "IOGraph",
      frame: 1290,  // 43s × 30fps
      topicCovered: "Input/output graph, threshold, and gain reduction",
      questions: [
        // Difficulty 1
        {
          id: "dp-cp2-d1-1",
          question: "On a compressor's I/O graph, the threshold is the point where:",
          type: "mcq",
          options: [
            "The line bends away from the 1:1 diagonal",
            "The output reaches 0 dB",
            "The input signal is at its quietest",
            "The ratio becomes 1:1"
          ],
          correctIndex: 0,
          explanation: "Below the threshold, input = output (1:1 line). At the threshold, the line bends — this is where compression begins.",
          difficulty: 1,
        },
        {
          id: "dp-cp2-d1-2",
          question: "On a 1:1 line (no compression), if the input is -20 dBFS, the output is:",
          type: "mcq",
          options: [
            "-20 dBFS",
            "-10 dBFS",
            "0 dBFS",
            "-40 dBFS"
          ],
          correctIndex: 0,
          explanation: "A 1:1 ratio means no gain change — the output exactly matches the input level.",
          difficulty: 1,
        },
        // Difficulty 2
        {
          id: "dp-cp2-d2-1",
          question: "A compressor has a threshold of -20 dBFS and a 2:1 ratio. A signal arrives at -10 dBFS (10 dB above threshold). What is the output level?",
          type: "mcq",
          options: [
            "-15 dBFS",
            "-10 dBFS",
            "-20 dBFS",
            "-5 dBFS"
          ],
          correctIndex: 0,
          explanation: "10 dB above threshold at 2:1 ratio → 10 ÷ 2 = 5 dB above threshold in the output. Threshold is -20, so output = -20 + 5 = -15 dBFS.",
          difficulty: 2,
        },
        {
          id: "dp-cp2-d2-2",
          question: "If a signal is 12 dB above the threshold and the compressor applies 8 dB of gain reduction, what ratio is being used?",
          type: "mcq",
          options: [
            "3:1",
            "2:1",
            "4:1",
            "8:1"
          ],
          correctIndex: 0,
          explanation: "12 dB excess with 8 dB reduction means 4 dB passes through. Input excess (12) ÷ output excess (4) = 3:1 ratio.",
          difficulty: 2,
        },
        // Difficulty 3
        {
          id: "dp-cp2-d3-1",
          question: "A signal peaks at -8 dBFS. The compressor threshold is -20 dBFS, ratio is 4:1. How much gain reduction is applied?",
          type: "mcq",
          options: [
            "9 dB",
            "12 dB",
            "3 dB",
            "8 dB"
          ],
          correctIndex: 0,
          explanation: "Signal is 12 dB above threshold. At 4:1, output is 3 dB above threshold. Gain reduction = 12 - 3 = 9 dB.",
          difficulty: 3,
        },
        {
          id: "dp-cp2-d3-2",
          question: "After applying 9 dB of gain reduction to a peak, the engineer adds 9 dB of makeup gain. What is the effect on the overall signal?",
          type: "mcq",
          options: [
            "Peaks stay the same level, but quieter parts are now 9 dB louder",
            "The entire signal is 9 dB louder",
            "Peaks are 9 dB quieter, quiet parts unchanged",
            "No audible difference"
          ],
          correctIndex: 0,
          explanation: "Compression reduces peaks then makeup gain lifts everything equally. Peaks return to roughly their original level, but quiet parts (which weren't compressed) get the full 9 dB boost — this is how compression increases perceived loudness.",
          difficulty: 3,
        },
      ],
    },
    {
      checkpointIndex: 2,
      afterScene: "RatioExamples",
      frame: 1770,  // 59s × 30fps
      topicCovered: "Ratio comparisons: 4:1, 10:1, limiting",
      questions: [
        // Difficulty 1
        {
          id: "dp-cp3-d1-1",
          question: "A ratio of 4:1 means that for every 4 dB the input exceeds the threshold, the output exceeds it by:",
          type: "mcq",
          options: ["1 dB", "4 dB", "2 dB", "8 dB"],
          correctIndex: 0,
          explanation: "4:1 means 4 dB of input excess produces 1 dB of output excess. The higher the first number, the more compression.",
          difficulty: 1,
        },
        {
          id: "dp-cp3-d1-2",
          question: "Which ratio applies the MOST compression?",
          type: "mcq",
          options: ["10:1", "2:1", "4:1", "1.5:1"],
          correctIndex: 0,
          explanation: "Higher ratios mean more compression. 10:1 allows almost nothing through above the threshold.",
          difficulty: 1,
        },
        // Difficulty 2
        {
          id: "dp-cp3-d2-1",
          question: "What makes a limiter different from a compressor?",
          type: "mcq",
          options: [
            "A limiter uses an extremely high ratio (10:1 or more), setting an absolute ceiling",
            "A limiter only works on bass frequencies",
            "A limiter increases the dynamic range",
            "A limiter has no threshold control"
          ],
          correctIndex: 0,
          explanation: "A limiter is essentially a compressor with a very high ratio (typically 10:1 to infinity:1). It prevents signals from exceeding the threshold, acting as a ceiling.",
          difficulty: 2,
        },
        {
          id: "dp-cp3-d2-2",
          question: "When would you choose a gentle ratio like 2:1 over an aggressive 10:1?",
          type: "mcq",
          options: [
            "When you want transparent, natural-sounding compression (e.g., on vocals or acoustic guitar)",
            "When mastering a final mix for streaming",
            "When trying to prevent clipping on a drum bus",
            "When creating a ducking effect with side-chain"
          ],
          correctIndex: 0,
          explanation: "Gentle ratios (1.5:1 to 3:1) preserve the natural dynamics while just taming the extremes. This is ideal for vocals and acoustic instruments where you want control without an audibly 'compressed' sound.",
          difficulty: 2,
        },
        // Difficulty 3
        {
          id: "dp-cp3-d3-1",
          question: "An input signal is 24 dB above the threshold. Compare the output excess at 4:1, 10:1, and infinity:1 (limiting).",
          type: "mcq",
          options: [
            "6 dB, 2.4 dB, 0 dB",
            "6 dB, 10 dB, 24 dB",
            "24 dB, 10 dB, 0 dB",
            "4 dB, 1 dB, 0 dB"
          ],
          correctIndex: 0,
          explanation: "At 4:1: 24÷4 = 6 dB. At 10:1: 24÷10 = 2.4 dB. At ∞:1: 24÷∞ = 0 dB (nothing passes the threshold).",
          difficulty: 3,
        },
        {
          id: "dp-cp3-d3-2",
          question: "A mastering engineer places a limiter at -1 dBFS on the master bus. Why -1 dBFS and not 0 dBFS?",
          type: "mcq",
          options: [
            "To allow headroom for inter-sample peaks that can exceed 0 dBFS during digital-to-analogue conversion",
            "Because streaming platforms require it",
            "To leave space for the compressor after the limiter",
            "Because -1 dBFS sounds louder than 0 dBFS"
          ],
          correctIndex: 0,
          explanation: "Inter-sample peaks (ISPs) can exceed 0 dBFS when the DAC reconstructs the analogue waveform between samples. Setting the ceiling at -1 dBFS provides a safety margin to prevent distortion on playback systems.",
          difficulty: 3,
        },
      ],
    },
    {
      checkpointIndex: 3,
      afterScene: "AttackRelease",
      frame: 2370,  // 79s × 30fps
      topicCovered: "Attack and release times on drum transients",
      questions: [
        // Difficulty 1
        {
          id: "dp-cp4-d1-1",
          question: "Attack time on a compressor controls:",
          type: "mcq",
          options: [
            "How quickly the compressor starts reducing gain after the signal exceeds the threshold",
            "How quickly the compressor stops reducing gain",
            "The level of the threshold",
            "The frequency range being compressed"
          ],
          correctIndex: 0,
          explanation: "Attack time is how fast the compressor reacts once the signal crosses the threshold. Fast attack = immediate clamping; slow attack = transients pass through first.",
          difficulty: 1,
        },
        {
          id: "dp-cp4-d1-2",
          question: "Release time controls:",
          type: "mcq",
          options: [
            "How quickly the compressor stops compressing after the signal drops below the threshold",
            "How quickly the signal fades out",
            "The speed of the attack",
            "The makeup gain amount"
          ],
          correctIndex: 0,
          explanation: "Release is how fast the compressor lets go — returns to unity gain — once the signal falls below the threshold again.",
          difficulty: 1,
        },
        // Difficulty 2
        {
          id: "dp-cp4-d2-1",
          question: "A fast attack time on a snare drum would:",
          type: "mcq",
          options: [
            "Clamp down on the initial transient, making the snare sound softer and rounder",
            "Let the transient through and only compress the sustain",
            "Increase the volume of the snare hit",
            "Add reverb to the snare"
          ],
          correctIndex: 0,
          explanation: "A fast attack catches the initial transient (the sharp 'crack' of the snare) and compresses it, reducing its punch. This makes the snare sound smoother but less impactful.",
          difficulty: 2,
        },
        {
          id: "dp-cp4-d2-2",
          question: "Why would a mix engineer choose a slow attack on drums?",
          type: "mcq",
          options: [
            "To preserve the initial transient punch while controlling the sustain/body",
            "To make the drums quieter overall",
            "To remove the low frequencies from the drums",
            "To add a delay effect to each hit"
          ],
          correctIndex: 0,
          explanation: "A slow attack lets the initial transient pass through uncompressed, preserving the 'snap' and 'punch'. The compressor then kicks in to control the sustain and body that follows.",
          difficulty: 2,
        },
        // Difficulty 3
        {
          id: "dp-cp4-d3-1",
          question: "A compressor with a very fast attack and very fast release on a bass guitar causes audible distortion. Why?",
          type: "mcq",
          options: [
            "The compressor modulates the gain so rapidly it alters the waveform shape at audio frequencies",
            "The bass frequencies are too loud for the compressor",
            "Fast settings always cause clipping",
            "The release is resetting the threshold"
          ],
          correctIndex: 0,
          explanation: "When both attack and release are extremely fast, the compressor can change gain within individual cycles of low-frequency waveforms. This effectively reshapes the waveform, introducing harmonic distortion — sometimes desirable, often not.",
          difficulty: 3,
        },
        {
          id: "dp-cp4-d3-2",
          question: "An engineer sets a compressor with 30ms attack, 200ms release on a drum bus. The kick hits every 500ms (120 BPM). Will the compressor fully release between kick hits?",
          type: "mcq",
          options: [
            "Yes — 200ms release completes well within the 500ms gap between kicks",
            "No — 200ms is longer than 500ms",
            "It depends on the ratio setting",
            "The compressor ignores timing completely"
          ],
          correctIndex: 0,
          explanation: "At 120 BPM, kicks are 500ms apart. The compressor needs 30ms to engage + 200ms to release = 230ms total. That leaves 270ms of unity gain before the next kick — plenty of time to release fully. This avoids 'pumping'.",
          difficulty: 3,
        },
      ],
    },
  ],
};

// Registry of all video checkpoint configs
export const checkpointConfigs: Record<string, VideoCheckpointConfig> = {
  "dynamic-processing-revision": dynamicProcessingCheckpoints,
};

// Helper: get config for a video
export function getCheckpointConfig(videoId: string): VideoCheckpointConfig | null {
  return checkpointConfigs[videoId] ?? null;
}

// Helper: get questions for a specific checkpoint at a difficulty level
export function getQuestionsAtDifficulty(
  config: VideoCheckpointConfig,
  checkpointIndex: number,
  difficulty: 1 | 2 | 3,
): CheckpointQuestion[] {
  const checkpoint = config.checkpoints[checkpointIndex];
  if (!checkpoint) return [];
  return checkpoint.questions.filter((q) => q.difficulty === difficulty);
}
