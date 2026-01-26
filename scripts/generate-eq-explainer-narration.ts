/**
 * Generate ElevenLabs narration for EQ Explainer
 *
 * Usage: npx tsx scripts/generate-eq-explainer-narration.ts
 *
 * Timeline (at 30fps):
 * - 0-120 frames (0-4s): Title Card
 * - 120-300 frames (4-10s): Problem Statement
 * - 300-720 frames (10-24s): Graphic EQ Architecture
 * - 720-960 frames (24-32s): Frequency Bands
 * - 960-1440 frames (32-48s): Parametric EQ Architecture
 * - 1440-1680 frames (48-56s): Q Factor Demo
 * - 1680-2160 frames (56-72s): Head-to-Head
 * - 2160-2400 frames (72-80s): Routing Comparison (Extension)
 * - 2400-2700 frames (80-90s): Exam Summary
 */

import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

// Narration segments timed to the composition
const narrationSegments = [
  {
    id: "eq_01_title",
    startFrame: 0,
    text: "Equalization. Graphic versus parametric architecture.",
  },
  {
    id: "eq_02_problem",
    startFrame: 120,
    text: "Unprocessed audio rarely has a flat frequency response. Resonances, room modes, and source characteristics create imbalances that require correction.",
  },
  {
    id: "eq_03_graphic",
    startFrame: 300,
    text: "A graphic equalizer is a filter bank—multiple bandpass filters routed in parallel. Each band has a fixed centre frequency and constant Q. Only the gain can be adjusted. The slider positions directly represent the EQ curve—what you see is what you get.",
  },
  {
    id: "eq_04_bands",
    startFrame: 720,
    text: "Standard configurations divide the spectrum into ten, twenty, or thirty bands. Ten bands use octave spacing—each frequency is double the previous. The relationship follows the formula: frequency times two to the power of one over n, where n is the number of bands per octave.",
  },
  {
    id: "eq_05_parametric",
    startFrame: 960,
    text: "Parametric equalization takes a different approach. Fewer bands, but three parameters per band: frequency, gain, and Q. Filters are routed in series—each filter's output feeds the next filter's input. This means you can dial in the exact frequency you need, with precisely the bandwidth required.",
  },
  {
    id: "eq_06_qfactor",
    startFrame: 1440,
    text: "Q factor defines selectivity. Q equals centre frequency divided by bandwidth. Low Q for broad tonal shaping. High Q for surgical notch filtering and resonance removal. Professional parametric EQs typically offer Q values from nought-point-three to sixteen or higher.",
  },
  {
    id: "eq_07_headtohead",
    startFrame: 1680,
    text: "Consider a common scenario: an eight-hundred hertz room resonance. With graphic EQ, you're limited to the nearest fixed band—and the fixed Q affects surrounding frequencies. With parametric EQ, you dial in the exact frequency and narrow the Q to isolate the problem. Surgical precision versus broad correction.",
  },
  {
    id: "eq_08_routing",
    startFrame: 2160,
    text: "Series routing introduces cumulative phase shift—different frequencies arrive at slightly different times. In musical applications this is rarely problematic, but in system alignment and mastering, linear-phase alternatives may be preferred.",
  },
  {
    id: "eq_09_summary",
    startFrame: 2400,
    text: "For your examination, structure comparisons around three axes: routing—parallel versus series; parameters—one versus three per band; and application—live sound versus studio mixing. These distinctions will secure full marks on comparison questions.",
  },
];

async function generateNarration() {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    console.error("Missing ELEVENLABS_API_KEY environment variable");
    console.log("\nTo set up:");
    console.log("1. Create a .env file in the project root");
    console.log("2. Add: ELEVENLABS_API_KEY=your_key_here");
    process.exit(1);
  }

  const client = new ElevenLabsClient({ apiKey });

  // Use Rachel voice - clear, professional, educational
  // Alternative voices: "pNInz6obpgDQGcFmaJgB" (Adam - deep), "EXAVITQu4vr4xnSDxMaL" (Bella)
  const voiceId = "21m00Tcm4TlvDq8ikWAM"; // Rachel

  const outputDir = path.join(__dirname, "../public/audio/eq-explainer");

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Generating EQ Explainer narration...\n");
  console.log(`Output directory: ${outputDir}\n`);

  for (const segment of narrationSegments) {
    console.log(`Generating: ${segment.id}`);
    console.log(`  Start frame: ${segment.startFrame} (${(segment.startFrame / 30).toFixed(1)}s)`);
    console.log(`  Text: "${segment.text.substring(0, 60)}..."`);

    try {
      const audioStream = await client.textToSpeech.convert(voiceId, {
        text: segment.text,
        modelId: "eleven_multilingual_v2",
        voiceSettings: {
          stability: 0.65, // Slightly higher for academic clarity
          similarityBoost: 0.75,
          style: 0.25, // Subtle expressiveness for academic tone
          useSpeakerBoost: true,
        },
      });

      const outputPath = path.join(outputDir, `${segment.id}.mp3`);

      // Collect chunks from the stream
      const chunks: Uint8Array[] = [];
      for await (const chunk of audioStream) {
        chunks.push(chunk);
      }

      // Combine and write
      const buffer = Buffer.concat(chunks);
      fs.writeFileSync(outputPath, buffer);

      console.log(`  ✓ Saved: ${segment.id}.mp3\n`);
    } catch (error) {
      console.error(`  ✗ Error generating ${segment.id}:`, error);
    }
  }

  console.log("\n✓ Done! Audio files saved to /public/audio/eq-explainer/");
  console.log("\nNext steps:");
  console.log("1. Update EQExplainer/index.tsx to include <Audio> components");
  console.log("2. Preview in the Remotion studio to verify timing");
}

generateNarration().catch(console.error);
