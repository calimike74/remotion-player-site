/**
 * Generate ElevenLabs narration for Sound Fundamentals
 *
 * Usage: npx tsx scripts/generate-sound-fundamentals-narration.ts
 *
 * Timeline (at 30fps):
 * - 0-180 frames (0-6s): Title Card
 * - 180-780 frames (6-26s): Waveform Shapes
 * - 780-1380 frames (26-46s): Digital Clipping
 * - 1380-1980 frames (46-66s): Decibel Scale
 * - 1980-2580 frames (66-86s): Compression & Rarefaction
 * - 2580-2700 frames (86-90s): Outro
 */

import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

// Narration segments timed to the composition
const narrationSegments = [
  {
    id: "sf_01_title",
    startFrame: 0,
    text: "Sound Fundamentals. Let's explore the core concepts you need for A-Level Music Technology.",
  },
  {
    id: "sf_02_waveforms",
    startFrame: 180,
    text: "Every sound begins with a waveform shape. A sine wave produces a pure, clean tone - just the fundamental frequency. Square waves sound hollow and woodwind-like, containing only odd harmonics. Sawtooth waves are bright and buzzy, with all harmonics present. Triangle waves sit in between - soft and mellow, with weak odd harmonics.",
  },
  {
    id: "sf_03_clipping",
    startFrame: 780,
    text: "Digital clipping occurs when your signal exceeds the maximum level - zero dB full scale. The waveform gets chopped flat, creating harsh distortion that cannot be fixed in post-production. Always record with headroom - leave three to six dB of safety margin below zero.",
  },
  {
    id: "sf_04_decibels",
    startFrame: 1380,
    text: "The decibel scale is logarithmic, not linear. Every plus six dB doubles the amplitude. Every minus six dB halves it. Remember: zero dBFS is the digital maximum. In the exam, you may be asked to calculate amplitude changes - know your six dB rule.",
  },
  {
    id: "sf_05_compression_rarefaction",
    startFrame: 1980,
    text: "Sound travels as a longitudinal wave. The speaker pushes air molecules together, creating compression - a region of high pressure. As the speaker pulls back, molecules spread apart, creating rarefaction - low pressure. These pressure waves travel outward, but the molecules themselves just vibrate back and forth.",
  },
  {
    id: "sf_06_outro",
    startFrame: 2580,
    text: "That's your Sound Fundamentals covered. Waveforms, clipping, decibels, and wave propagation. Good luck with your studies!",
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

  const outputDir = path.join(__dirname, "../public/audio/sound-fundamentals");

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Generating Sound Fundamentals narration...\n");
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
          stability: 0.6, // Slightly higher for educational clarity
          similarityBoost: 0.75,
          style: 0.3, // Add some expressiveness
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

  console.log("\n✓ Done! Audio files saved to /public/audio/sound-fundamentals/");
  console.log("\nNext steps:");
  console.log("1. Update SoundFundamentals.tsx to include <Audio> components");
  console.log("2. Preview in the player to verify timing");
}

generateNarration().catch(console.error);
