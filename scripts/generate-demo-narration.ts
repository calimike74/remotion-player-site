/**
 * Generate ElevenLabs narration for the demo showcase
 *
 * Usage: npx tsx scripts/generate-demo-narration.ts
 */

import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

// Narration segments timed to the demo sequences
const narrationSegments = [
  {
    id: "demo_01_intro",
    text: "What you're about to see was created entirely with Claude Code. No manual animation. No design software. Just natural language prompts transformed into professional video.",
  },
  {
    id: "demo_02_logo",
    text: "This logo animation? Generated from a single image and a few lines of description. Particle effects, 3D transforms, glitch aesthetics - all programmatically created.",
  },
  {
    id: "demo_03_images",
    text: "Real images from your asset library, animated with Ken Burns effects, callouts, and parallax depth. The code understands composition and timing.",
  },
  {
    id: "demo_04_3d",
    text: "Full Three.js integration. A rotating carousel of images in actual 3D space. Camera movements. Dynamic lighting. This is what's possible when AI writes your motion graphics.",
  },
  {
    id: "demo_05_flythrough",
    text: "Flying through a gallery of floating frames. Every position, every rotation, every lighting effect - described in plain English, rendered in real-time.",
  },
  {
    id: "demo_06_outro",
    text: "Claude Code plus Remotion plus Eleven Labs. From idea to polished video in minutes, not days. This is the future of content creation.",
  },
];

async function generateNarration() {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    console.error("Missing ELEVENLABS_API_KEY environment variable");
    process.exit(1);
  }

  const client = new ElevenLabsClient({ apiKey });

  // Use Rachel voice - clear, professional
  const voiceId = "21m00Tcm4TlvDq8ikWAM";

  const outputDir = path.join(__dirname, "../public");

  console.log("Generating narration segments...\n");

  for (const segment of narrationSegments) {
    console.log(`Generating: ${segment.id}`);
    console.log(`  Text: "${segment.text.substring(0, 50)}..."`);

    try {
      const audioStream = await client.textToSpeech.convert(voiceId, {
        text: segment.text,
        modelId: "eleven_multilingual_v2",
        voiceSettings: {
          stability: 0.5,
          similarityBoost: 0.75,
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

  console.log("\nDone! Audio files saved to /public/");
}

generateNarration().catch(console.error);
